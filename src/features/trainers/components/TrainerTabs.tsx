import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  active: string;
  setActive: (tab: string) => void;
}

export function TrainerTabs({
  active,
  setActive,
}: Props) {
  const tabs = ['About', 'Reviews', 'Packages'];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          onPress={() => setActive(tab)}
          style={[
            styles.tab,
            active === tab && styles.activeTab,
          ]}>
          <Text
            style={[
              styles.text,
              active === tab && styles.activeText,
            ]}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    padding: 4,
    marginTop: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#0D6EFD',
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
});