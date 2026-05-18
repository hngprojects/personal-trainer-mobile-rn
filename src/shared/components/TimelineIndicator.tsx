import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { palette, useTheme } from '@/shared/theme';

import { Typography } from './Typography';

export interface TimelineStep {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isCompleted?: boolean;
  isActive?: boolean;
}

interface TimelineIndicatorProps {
  steps: TimelineStep[];
}

export function TimelineIndicator({ steps }: TimelineIndicatorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.leftColumn}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: step.isActive
                      ? palette.highlightBlue['0.5']
                      : step.isCompleted
                        ? palette.success['0.5']
                        : palette.neutral['1'],
                    borderColor: step.isActive ? colors.primary : 'transparent',
                    borderWidth: step.isActive ? 2 : 0,
                  },
                ]}
              >
                {step.icon && (
                  <Ionicons
                    name={step.icon}
                    size={16}
                    color={
                      step.isActive
                        ? colors.primary
                        : step.isCompleted
                          ? palette.success['5']
                          : palette.neutral['5']
                    }
                  />
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: step.isCompleted ? palette.success['3'] : palette.neutral['2'] },
                  ]}
                />
              )}
            </View>

            <View style={styles.contentColumn}>
              <Typography
                variant="body1"
                style={[
                  styles.title,
                  { color: step.isActive || step.isCompleted ? colors.text : palette.neutral['6'] },
                ]}
              >
                {step.title}
              </Typography>
              <Typography variant="body2" color={palette.neutral['5']} style={styles.description}>
                {step.description}
              </Typography>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  leftColumn: {
    alignItems: 'center',
    width: 40,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -4,
    marginBottom: -4,
    minHeight: 40,
    zIndex: 0,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 32, // Spacing between steps
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    lineHeight: 20,
  },
});
