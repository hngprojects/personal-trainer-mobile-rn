import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/features/auth/store/auth.store';

import {
  getNotificationsWebSocketUrl,
  normalizeNotification,
  UserNotification,
} from '../api/notifications.api';

const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30_000;

export function useNotificationsSocket(enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const shouldReconnectRef = useRef(true);

  useEffect(() => {
    if (!enabled || !accessToken) return;

    const token = accessToken;
    shouldReconnectRef.current = true;

    function clearReconnectTimer() {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    }

    function prependNotification(notification: UserNotification) {
      queryClient.setQueryData<UserNotification[]>(['notifications'], (current = []) => {
        if (current.some((item) => item.id === notification.id)) return current;
        return [notification, ...current];
      });
    }

    function scheduleReconnect() {
      clearReconnectTimer();
      if (!shouldReconnectRef.current) return;

      const delay = reconnectDelayRef.current;
      reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_DELAY);
      reconnectTimerRef.current = setTimeout(connect, delay);
    }

    function connect() {
      socketRef.current?.close();

      const socket = new WebSocket(getNotificationsWebSocketUrl(token));
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.type && payload.type !== 'notification') return;

          const notification = normalizeNotification(payload);
          if (notification) prependNotification(notification);
        } catch {
          // Ignore malformed/unknown websocket messages.
        }
      };

      socket.onerror = () => {
        socket.close();
      };

      socket.onclose = () => {
        if (socketRef.current === socket) {
          socketRef.current = null;
        }
        scheduleReconnect();
      };
    }

    connect();

    return () => {
      shouldReconnectRef.current = false;
      clearReconnectTimer();
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [accessToken, enabled, queryClient]);
}
