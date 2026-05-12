import { StyleSheet, Text, View } from 'react-native';

export function TrainerPackagesTab() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Starter Plan</Text>

      <Text style={styles.price}>₦50,000/month</Text>

      <Text style={styles.desc}>Personalized workouts and weekly support.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F7F7F7',
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
  },
  price: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '700',
    color: '#0D6EFD',
  },
  desc: {
    marginTop: 10,
    color: '#666',
  },
});
