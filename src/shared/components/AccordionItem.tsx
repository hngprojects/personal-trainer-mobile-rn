import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '@/shared/theme';

import { Typography } from './Typography';

interface AccordionItemProps {
  title: string;
  content: string;
  isInitiallyExpanded?: boolean;
}

export function AccordionItem({ title, content, isInitiallyExpanded = false }: AccordionItemProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(isInitiallyExpanded);
  const heightValue = useSharedValue(isInitiallyExpanded ? 100 : 0); // 100 is a fallback
  const contentRef = useAnimatedRef<View>();

  const toggle = () => {
    if (expanded) {
      heightValue.value = withSpring(0, { damping: 20, stiffness: 200 });
      setExpanded(false);
    } else {
      runOnUI(() => {
        'worklet';
        const measurement = measure(contentRef);
        if (measurement) {
          heightValue.value = withSpring(measurement.height, {
            damping: 20,
            stiffness: 200,
          });
        }
      })();
      setExpanded(true);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: expanded ? heightValue.value : 0,
      opacity: expanded ? withSpring(1) : withSpring(0),
      overflow: 'hidden',
    };
  });

  return (
    <View
      style={[
        styles.container,
        { borderColor: colors.border, backgroundColor: colors.surfaceMuted },
      ]}
    >
      <Pressable style={styles.header} onPress={toggle}>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.text} />
        <Typography variant="body2" style={styles.titleText}>
          {title}
        </Typography>
      </Pressable>
      <Animated.View style={animatedStyle}>
        <View ref={contentRef} style={styles.contentContainer}>
          <Typography variant="label" color={colors.textSecondary} style={{ lineHeight: 20 }}>
            {content}
          </Typography>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  titleText: {
    fontWeight: '500',
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 0,
    paddingLeft: 48, // Aligns with the text, skipping icon
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
