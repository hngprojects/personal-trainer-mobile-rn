import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export function TrainerReviewTab() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="person-circle" size={42} color="#999" />

        <View>
          <Text style={styles.name}>Sarah Adams</Text>
          <Text>⭐ 4.8</Text>
        </View>
      </View>

      <Text style={styles.review}>Charles transformed my body and confidence.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F7F7F7',
    padding: 16,
    borderRadius: 18,
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  name: {
    fontWeight: '700',
  },
  review: {
    marginTop: 14,
    color: '#555',
    lineHeight: 22,
  },
});
