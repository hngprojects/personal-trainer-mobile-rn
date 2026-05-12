import { StyleSheet, Text, View } from 'react-native';

interface Props {
  bio: string;
}

export function TrainerAboutTab({ bio }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Trainer</Text>

      <Text style={styles.bio}>{bio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  bio: {
    marginTop: 12,
    lineHeight: 24,
    color: '#555',
  },
});
