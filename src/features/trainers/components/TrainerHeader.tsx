import { Image, StyleSheet, Text, View } from 'react-native';

interface Props {
  coverImage: string;
  image: string;
  name: string;
  specialty: string;
}

export function TrainerHeader({ coverImage, image, name, specialty }: Props) {
  return (
    <View>
      <Image source={{ uri: coverImage }} style={styles.cover} />

      <View style={styles.overlay} />

      <View style={styles.profile}>
        <Image source={{ uri: image }} style={styles.avatar} />

        <Text style={styles.name}>{name}</Text>

        <Text style={styles.specialty}>{specialty}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    height: 220,
  },

  overlay: {
    position: 'absolute',
    width: '100%',
    height: 220,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  profile: {
    position: 'absolute',
    bottom: -55,
    width: '100%',
    alignItems: 'center',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },

  name: {
    marginTop: 10,
    color: '#fff',
    fontWeight: '700',
    fontSize: 22,
  },

  specialty: {
    color: '#EAEAEA',
    marginTop: 4,
  },
});
