import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { palette, useTheme } from '@/shared/theme';
import { Typography } from './Typography';

interface SegmentedTabsProps {
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function SegmentedTabs({ tabs, activeIndex, onChange }: SegmentedTabsProps) {
  const { colors } = useTheme();

  const tabWidth = 100 / tabs.length;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: withSpring(`${activeIndex * tabWidth}%`, {
        damping: 20,
        stiffness: 200,
      }),
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: palette.neutral['1'] }]}>
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            width: `${tabWidth}%`,
            backgroundColor: colors.surface,
          },
          animatedStyle,
        ]}
      />
      {tabs.map((tab, index) => {
        const isActive = activeIndex === index;
        return (
          <Pressable
            key={tab}
            style={styles.tab}
            onPress={() => onChange(index)}
          >
            <Typography
              variant="body2"
              color={isActive ? colors.primary : palette.neutral['5']}
              style={[styles.tabText, isActive && styles.activeTabText]}
            >
              {tab}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 8,
    padding: 4,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
});
