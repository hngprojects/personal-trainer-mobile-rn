import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';

import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { SegmentedTabs, Typography } from '@/shared/components';
import { toast } from '@/shared/components/toast';
import { fonts, palette, useTheme } from '@/shared/theme';

import { notificationService } from '../services/notificationService';
import { useNotificationStore } from '../store/notifications.store';
import type { NotificationType } from '../api/notifications.types';

export function NotificationsScreen() {
  const { user } = useAuthSession();
  const { colors, isDark } = useTheme();

  const {
    permissionStatus,
    deviceToken,
    notifications,
    logs,
    settings,
    isRegistering,
    updateSettings,
    clearNotifications,
    clearLogs,
    addLog,
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState<'push' | 'local'>('local');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleShareToken = async () => {
    if (!deviceToken) {
      toast.error('No device token generated yet.');
      return;
    }
    try {
      await Share.share({
        message: deviceToken,
        title: 'Expo Push Token',
      });
      toast.success('Token shared successfully!');
    } catch {
      toast.error('Failed to share token.');
    }
  };

  const handleTriggerAlert = async (type: NotificationType) => {
    if (!user?.id) {
      toast.error('You must be logged in.');
      return;
    }

    let title = '';
    let body = '';

    switch (type) {
      case 'workout':
        title = '🏋️‍♂️ Time to hit your goals!';
        body = "Your 'Upper Body Power' workout is scheduled for today. Don't skip a beat!";
        break;
      case 'trainer':
        title = '💬 Coach Marcus';
        body =
          "Hey! Just reviewed your weight tracking log. You're doing amazing! Ready for tomorrow's session?";
        break;
      case 'session':
        title = '📅 Session Scheduled';
        body = 'Your personal training session is confirmed for Thursday, May 28th at 9:00 AM.';
        break;
      case 'progress':
        title = '🎉 Milestone Unlocked!';
        body = 'You completed 5 workouts this week! Keep up this incredible momentum.';
        break;
    }

    setIsLoading(type);
    let result = null;
    try {
      result = await notificationService.triggerNotification({
        userId: user.id,
        type,
        title,
        body,
        deliveryMode,
      });
    } finally {
      setIsLoading(null);
    }

    if (result && result.success) {
      if (result.deliveryKind === 'local') {
        toast.info('Notification scheduled! Lock your screen or go Home now.');
      } else {
        toast.success('Push notification sent via Expo API!');
      }
    } else {
      toast.error(result?.error || 'Failed to trigger notification.');
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderNotificationCard = ({ item }: { item: (typeof notifications)[0] }) => {
    let iconName: keyof typeof Ionicons.glyphMap = 'notifications-outline';
    let iconColor = colors.primary;
    let typeLabel = 'Alert';

    switch (item.type) {
      case 'workout':
        iconName = 'barbell-outline';
        iconColor = '#FF6B6B';
        typeLabel = 'Workout';
        break;
      case 'trainer':
        iconName = 'chatbubble-outline';
        iconColor = '#4DABF7';
        typeLabel = 'Coach Message';
        break;
      case 'session':
        iconName = 'calendar-outline';
        iconColor = '#20C997';
        typeLabel = 'Schedule';
        break;
      case 'progress':
        iconName = 'trophy-outline';
        iconColor = '#FCC419';
        typeLabel = 'Milestone';
        break;
    }

    return (
      <Animated.View
        entering={FadeInDown}
        layout={Layout.springify()}
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardIconContainer}>
            <Ionicons name={iconName} size={18} color={iconColor} />
            <Typography variant="body2" style={[styles.cardType, { color: iconColor }]}>
              {typeLabel}
            </Typography>
          </View>
          <Typography variant="body2" style={{ color: colors.textSecondary }}>
            {formatTime(item.timestamp)}
          </Typography>
        </View>
        <Typography variant="h3" style={[styles.cardTitle, { color: colors.text }]}>
          {item.title}
        </Typography>
        <Typography variant="body2" style={[styles.cardBody, { color: colors.textSecondary }]}>
          {item.body}
        </Typography>
      </Animated.View>
    );
  };

  const renderLogItem = ({ item }: { item: (typeof logs)[0] }) => {
    let levelColor = colors.textSecondary;
    let levelIcon: keyof typeof Ionicons.glyphMap = 'information-circle-outline';

    switch (item.level) {
      case 'success':
        levelColor = '#20C997';
        levelIcon = 'checkmark-circle-outline';
        break;
      case 'warning':
        levelColor = '#FCC419';
        levelIcon = 'alert-circle-outline';
        break;
      case 'error':
        levelColor = '#FF6B6B';
        levelIcon = 'close-circle-outline';
        break;
      case 'info':
        levelColor = '#4DABF7';
        levelIcon = 'information-circle-outline';
        break;
    }

    return (
      <View style={[styles.logRow, { borderBottomColor: colors.border }]}>
        <View style={styles.logMeta}>
          <Ionicons name={levelIcon} size={14} color={levelColor} />
          <Typography variant="body2" style={[styles.logTime, { color: colors.textSecondary }]}>
            {formatTime(item.timestamp)}
          </Typography>
          <Typography
            variant="body2"
            style={[styles.logLevel, { color: levelColor, fontFamily: fonts.bold }]}
          >
            {item.level.toUpperCase()}
          </Typography>
        </View>
        <Typography
          variant="body2"
          style={[
            styles.logMessage,
            { color: isDark ? '#E9ECEF' : '#343A40', fontFamily: fonts.medium },
          ]}
        >
          {item.message}
        </Typography>
        {item.details && (
          <View
            style={[
              styles.logDetailsContainer,
              { backgroundColor: isDark ? '#1A1D20' : '#F1F3F5' },
            ]}
          >
            <Typography
              variant="body2"
              style={[styles.logDetails, { color: colors.textSecondary }]}
            >
              {item.details}
            </Typography>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Navigates back to the previous screen"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Typography variant="h2" style={{ color: colors.text }}>
          Notifications
        </Typography>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            if (activeTab === 0) {
              clearNotifications();
              toast.success('Alert history cleared!');
            } else {
              clearLogs();
              toast.success('Console logs cleared!');
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={activeTab === 0 ? 'Clear alert history' : 'Clear console logs'}
          accessibilityHint="Permanently deletes all logs or alerts from the display"
        >
          <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Permission Info Glassmorphism Card */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.glassContainer}>
          <View
            style={[
              styles.glassCard,
              {
                backgroundColor: isDark ? 'rgba(33, 37, 41, 0.7)' : 'rgba(255, 255, 255, 0.75)',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.glassHeader}>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor:
                        permissionStatus === 'granted'
                          ? '#20C997'
                          : permissionStatus === 'undetermined'
                            ? '#FCC419'
                            : '#FF6B6B',
                    },
                  ]}
                />
                <Typography
                  variant="body2"
                  style={{ fontFamily: fonts.semibold, color: colors.text }}
                >
                  Status: {permissionStatus.toUpperCase()}
                </Typography>
              </View>
              {isRegistering && <ActivityIndicator size="small" color={colors.primary} />}
            </View>

            <Typography
              variant="body2"
              style={[styles.tokenLabel, { color: colors.textSecondary }]}
            >
              DEVICE PUSH TOKEN
            </Typography>
            <View style={[styles.tokenBox, { backgroundColor: isDark ? '#1C1E21' : '#F1F3F5' }]}>
              <Typography
                variant="body2"
                numberOfLines={1}
                ellipsizeMode="middle"
                style={[styles.tokenText, { color: colors.text, fontFamily: fonts.regular }]}
              >
                {deviceToken || 'Token not registered yet'}
              </Typography>
              <TouchableOpacity
                style={styles.tokenCopyBtn}
                onPress={handleShareToken}
                accessibilityRole="button"
                accessibilityLabel="Share device push token"
                accessibilityHint="Opens the share tray to copy or send the token"
              >
                <Ionicons name="share-outline" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Diagnostics & Testing Section */}
        <View style={styles.section}>
          <Typography variant="h3" style={[styles.sectionTitle, { color: colors.text }]}>
            Diagnostics & Trigger Suite
          </Typography>
          <Typography variant="body2" style={[styles.sectionDesc, { color: colors.textSecondary }]}>
            Simulate backend pushes in real time. Choose &quot;Local Simulator&quot; and lock your
            device to test background delivery!
          </Typography>

          {/* Delivery Mode Toggle */}
          <View style={[styles.modeToggleRow, { backgroundColor: isDark ? '#212529' : '#F1F3F5' }]}>
            <TouchableOpacity
              style={[
                styles.modeBtn,
                deliveryMode === 'local' && [
                  styles.modeBtnActive,
                  { backgroundColor: colors.surface },
                ],
              ]}
              onPress={() => setDeliveryMode('local')}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={14}
                color={deliveryMode === 'local' ? colors.primary : colors.textSecondary}
              />
              <Typography
                variant="body2"
                style={{
                  fontFamily: fonts.semibold,
                  color: deliveryMode === 'local' ? colors.text : colors.textSecondary,
                }}
              >
                Local Simulator (2s)
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeBtn,
                deliveryMode === 'push' && [
                  styles.modeBtnActive,
                  { backgroundColor: colors.surface },
                ],
              ]}
              onPress={() => {
                if (deviceToken && deviceToken.includes('mock')) {
                  addLog('warning', 'Push API requires a physical device. Setting fallback.');
                }
                setDeliveryMode('push');
              }}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={14}
                color={deliveryMode === 'push' ? colors.primary : colors.textSecondary}
              />
              <Typography
                variant="body2"
                style={{
                  fontFamily: fonts.semibold,
                  color: deliveryMode === 'push' ? colors.text : colors.textSecondary,
                }}
              >
                Expo Push API (Direct)
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Trigger Deck */}
          <View style={styles.triggerDeck}>
            <View style={styles.triggerRow}>
              <TouchableOpacity
                style={[styles.triggerBtn, { backgroundColor: '#FFF5F5', borderColor: '#FFE3E3' }]}
                onPress={() => handleTriggerAlert('workout')}
                disabled={isLoading !== null}
              >
                {isLoading === 'workout' ? (
                  <ActivityIndicator size="small" color="#FF6B6B" />
                ) : (
                  <>
                    <View style={[styles.triggerIconCircle, { backgroundColor: '#FFE3E3' }]}>
                      <Ionicons name="barbell" size={18} color="#FF6B6B" />
                    </View>
                    <Typography
                      variant="body2"
                      style={{ fontFamily: fonts.bold, color: '#FF6B6B' }}
                    >
                      Workout Reminder
                    </Typography>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.triggerBtn, { backgroundColor: '#E7F5FF', borderColor: '#D0EBFF' }]}
                onPress={() => handleTriggerAlert('trainer')}
                disabled={isLoading !== null}
              >
                {isLoading === 'trainer' ? (
                  <ActivityIndicator size="small" color="#228BE6" />
                ) : (
                  <>
                    <View style={[styles.triggerIconCircle, { backgroundColor: '#D0EBFF' }]}>
                      <Ionicons name="chatbubble-ellipses" size={18} color="#228BE6" />
                    </View>
                    <Typography
                      variant="body2"
                      style={{ fontFamily: fonts.bold, color: '#228BE6' }}
                    >
                      Trainer Message
                    </Typography>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.triggerRow}>
              <TouchableOpacity
                style={[styles.triggerBtn, { backgroundColor: '#E6FCF5', borderColor: '#C3FAE8' }]}
                onPress={() => handleTriggerAlert('session')}
                disabled={isLoading !== null}
              >
                {isLoading === 'session' ? (
                  <ActivityIndicator size="small" color="#0CA678" />
                ) : (
                  <>
                    <View style={[styles.triggerIconCircle, { backgroundColor: '#C3FAE8' }]}>
                      <Ionicons name="calendar" size={18} color="#0CA678" />
                    </View>
                    <Typography
                      variant="body2"
                      style={{ fontFamily: fonts.bold, color: '#0CA678' }}
                    >
                      Schedule Alert
                    </Typography>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.triggerBtn, { backgroundColor: '#FFF9DB', borderColor: '#FFF3BF' }]}
                onPress={() => handleTriggerAlert('progress')}
                disabled={isLoading !== null}
              >
                {isLoading === 'progress' ? (
                  <ActivityIndicator size="small" color="#F59F00" />
                ) : (
                  <>
                    <View style={[styles.triggerIconCircle, { backgroundColor: '#FFF3BF' }]}>
                      <Ionicons name="trophy" size={18} color="#F59F00" />
                    </View>
                    <Typography
                      variant="body2"
                      style={{ fontFamily: fonts.bold, color: '#F59F00' }}
                    >
                      Progress Milestone
                    </Typography>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Categories Preferences Toggles */}
        <View style={styles.section}>
          <Typography variant="h3" style={[styles.sectionTitle, { color: colors.text }]}>
            Notification Categories
          </Typography>
          <View
            style={[
              styles.preferenceList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.preferenceRow, { borderBottomColor: colors.border }]}>
              <View style={styles.prefLabelContainer}>
                <Ionicons name="barbell-outline" size={18} color={colors.textSecondary} />
                <Typography
                  variant="body1"
                  style={{ color: colors.text, fontFamily: fonts.medium }}
                >
                  Workout Reminders
                </Typography>
              </View>
              <Switch
                value={settings.workoutReminders}
                onValueChange={(v) => updateSettings({ workoutReminders: v })}
                trackColor={{ false: palette.neutral['2'], true: '#20C997' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.preferenceRow, { borderBottomColor: colors.border }]}>
              <View style={styles.prefLabelContainer}>
                <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
                <Typography
                  variant="body1"
                  style={{ color: colors.text, fontFamily: fonts.medium }}
                >
                  Trainer Messages
                </Typography>
              </View>
              <Switch
                value={settings.trainerMessages}
                onValueChange={(v) => updateSettings({ trainerMessages: v })}
                trackColor={{ false: palette.neutral['2'], true: '#20C997' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.preferenceRow, { borderBottomColor: colors.border }]}>
              <View style={styles.prefLabelContainer}>
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                <Typography
                  variant="body1"
                  style={{ color: colors.text, fontFamily: fonts.medium }}
                >
                  Schedule Alerts
                </Typography>
              </View>
              <Switch
                value={settings.sessionAlerts}
                onValueChange={(v) => updateSettings({ sessionAlerts: v })}
                trackColor={{ false: palette.neutral['2'], true: '#20C997' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.preferenceRow, { borderBottomColor: colors.border }]}>
              <View style={styles.prefLabelContainer}>
                <Ionicons name="trophy-outline" size={18} color={colors.textSecondary} />
                <Typography
                  variant="body1"
                  style={{ color: colors.text, fontFamily: fonts.medium }}
                >
                  Progress Updates
                </Typography>
              </View>
              <Switch
                value={settings.progressUpdates}
                onValueChange={(v) => updateSettings({ progressUpdates: v })}
                trackColor={{ false: palette.neutral['2'], true: '#20C997' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.preferenceRow, { borderBottomColor: colors.border }]}>
              <View style={styles.prefLabelContainer}>
                <Ionicons name="volume-high-outline" size={18} color={colors.textSecondary} />
                <Typography
                  variant="body1"
                  style={{ color: colors.text, fontFamily: fonts.medium }}
                >
                  Sound Effects
                </Typography>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(v) => updateSettings({ soundEnabled: v })}
                trackColor={{ false: palette.neutral['2'], true: '#20C997' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.preferenceRow}>
              <View style={styles.prefLabelContainer}>
                <Ionicons name="pulse-outline" size={18} color={colors.textSecondary} />
                <Typography
                  variant="body1"
                  style={{ color: colors.text, fontFamily: fonts.medium }}
                >
                  Vibrate Patterns
                </Typography>
              </View>
              <Switch
                value={settings.vibrateEnabled}
                onValueChange={(v) => updateSettings({ vibrateEnabled: v })}
                trackColor={{ false: palette.neutral['2'], true: '#20C997' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Tab Selection (Alerts Feed vs Console Logs) */}
        <View style={[styles.tabSelection, { paddingHorizontal: 20, paddingTop: 16 }]}>
          <SegmentedTabs
            tabs={['Alert History', 'Console Logs']}
            activeIndex={activeTab}
            onChange={(idx) => setActiveTab(idx)}
          />
        </View>

        {/* Dynamically Loaded Feed or Log list */}
        <View style={[styles.listWrapper]}>
          {activeTab === 0 ? (
            notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={40} color={colors.border} />
                <Typography
                  variant="body2"
                  style={[styles.emptyText, { color: colors.textSecondary }]}
                >
                  No notifications received yet
                </Typography>
              </View>
            ) : (
              <FlatList
                data={notifications}
                renderItem={renderNotificationCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.listContainer}
              />
            )
          ) : logs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="terminal-outline" size={40} color={colors.border} />
              <Typography
                variant="body2"
                style={[styles.emptyText, { color: colors.textSecondary }]}
              >
                No diagnostics logs recorded
              </Typography>
            </View>
          ) : (
            <FlatList
              data={logs}
              renderItem={renderLogItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  clearButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  glassContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  glassCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  glassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tokenLabel: {
    fontSize: 9,
    fontFamily: fonts.bold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  tokenBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 8,
  },
  tokenText: {
    flex: 1,
    fontSize: 11,
    marginRight: 8,
  },
  tokenCopyBtn: {
    padding: 6,
    borderRadius: 6,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 11,
    marginBottom: 12,
  },
  modeToggleRow: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 8,
    marginBottom: 12,
    gap: 2,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  modeBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  triggerDeck: {
    gap: 10,
  },
  triggerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  triggerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  triggerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preferenceList: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  prefLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tabSelection: {
    marginTop: 8,
  },
  listWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  listContainer: {
    gap: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardType: {
    fontSize: 10,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
  cardBody: {
    fontSize: 12,
    lineHeight: 16,
  },
  logRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 4,
  },
  logMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logTime: {
    fontSize: 10,
  },
  logLevel: {
    fontSize: 9,
  },
  logMessage: {
    fontSize: 12,
  },
  logDetailsContainer: {
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  logDetails: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
