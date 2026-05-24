import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

import { ScreenHeader } from './ScreenHeader';

const FAQ_ITEMS = [
  {
    question: 'What is FitCall and how does it work?',
    answer:
      'FitCall connects you with vetted trainers for discovery calls and virtual training sessions. Choose a trainer, pick an available slot, and meet by Zoom or phone.',
  },
  {
    question: 'What types of training sessions does FitCall offer?',
    answer:
      'You can find trainers for strength, cardio, yoga, mobility, endurance, speed, and other goal-focused programs. Availability depends on each trainer.',
  },
  {
    question: 'How do I book a session with a FitCall trainer?',
    answer:
      'Open a trainer profile, choose Work With Trainer, select your preferred platform, pick an available time, and confirm your booking.',
  },
  {
    question: 'Can I reschedule a booked session?',
    answer:
      'Yes. Open the session from your Sessions tab and select Reschedule. The app will only show available slots based on the trainer or call schedule.',
  },
  {
    question: 'How do discovery calls work?',
    answer:
      'Discovery calls help you ask questions before starting. You can choose Zoom or a phone call, then pick one of the available call slots.',
  },
];

export function FAQScreen() {
  const { colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader title="FAQ" />

      <Animated.ScrollView
        entering={FadeInDown.duration(280)}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(80).duration(360)}>
          <Typography style={[styles.title, { color: colors.text }]}>
            Frequently Asked{'\n'}Questions
          </Typography>
        </Animated.View>

        <View style={styles.list}>
          {FAQ_ITEMS.map((item, index) => (
            <FAQItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              index={index}
              isOpen={openId === index}
              onPress={() => setOpenId((current) => (current === index ? null : index))}
            />
          ))}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

function FAQItem({
  question,
  answer,
  index,
  isOpen,
  onPress,
}: {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const rotation = useSharedValue(isOpen ? 45 : 0);

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 45 : 0, { duration: 180 });
  }, [isOpen, rotation]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(150 + index * 70).duration(360)}
      layout={LinearTransition.duration(220)}
      style={[styles.item, { borderBottomColor: colors.divider }]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        style={styles.questionRow}
      >
        <Typography style={[styles.question, { color: colors.text }]}>{question}</Typography>
        <Animated.View style={iconStyle}>
          <Ionicons name="add" size={18} color={colors.text} />
        </Animated.View>
      </Pressable>

      {isOpen ? (
        <Animated.View
          entering={FadeInDown.duration(180)}
          exiting={FadeOutUp.duration(140)}
          style={styles.answerWrap}
        >
          <Typography style={[styles.answer, { color: colors.textSecondary }]}>{answer}</Typography>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: fonts.bold,
    marginTop: 8,
    marginBottom: 28,
  },
  list: {
    gap: 0,
  },
  item: {
    borderBottomWidth: 1,
  },
  questionRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  question: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
  },
  answerWrap: {
    paddingBottom: 16,
    paddingRight: 28,
  },
  answer: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.regular,
  },
});
