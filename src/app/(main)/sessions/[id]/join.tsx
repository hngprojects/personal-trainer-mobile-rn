import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function SessionJoinRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Redirect
      href={{
        pathname: '/live-session' as any,
        params: { id },
      }}
    />
  );
}
