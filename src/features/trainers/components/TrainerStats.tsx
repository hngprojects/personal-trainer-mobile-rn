import { StyleSheet, Text, View } from 'react-native';

interface Props {
  experience: string;
  clients: number;
  rating: number;
}

export function TrainerStats({
  experience,
  clients,
  rating,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.value}>{experience}</Text>
        <Text style={styles.label}>Exp</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.value}>{clients}</Text>
        <Text style={styles.label}>Clients</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.value}>{rating}</Text>
        <Text style={styles.label}>Rating</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  box: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    color: '#777',
    marginTop: 6,
  },
});