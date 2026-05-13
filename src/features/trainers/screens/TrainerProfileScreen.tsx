import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { trainers } from '../data/trainers.data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200',
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800',
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800',
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=800',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800',
];

const SORT_OPTIONS = ['Most Recent', 'Highest Rated', 'Lowest Rated'];

const TRAINING_STYLES = ['Discipline', 'Result-Driven', 'Supportive', 'Motivating'];

const BENEFITS = [
  {
    icon: require('../../../../assets/images/trainer/Barbell.png') as number,
    title: 'Personalized Training Plans',
    text: 'Tailored to your goals and fitness level.',
  },
  {
    icon: require('../../../../assets/images/trainer/Handshake.png') as number,
    title: 'Real Accountability',
    text: 'Stay consistent with ongoing support.',
  },
  {
    icon: require('../../../../assets/images/trainer/UserCircleGear.png') as number,
    title: 'Proven Results',
    text: 'Delivering visible strength and weight loss progress.',
  },
  {
    icon: require('../../../../assets/images/trainer/ChartBar.png') as number,
    title: 'Structured Progression',
    text: 'Clear plans that track and improve your performance.',
  },
];

const REVIEWS = [
  {
    name: 'Daniel K.',
    date: '1 month ago',
    rating: 4.5,
    avatar: 'https://i.pravatar.cc/150?img=11',
    text: 'The free trial was incredibly helpful. I understood her coaching style immediately and felt confident booking more sessions.',
  },
  {
    name: 'Sam Jones',
    date: '1 month ago',
    rating: 3.2,
    avatar: 'https://i.pravatar.cc/150?img=47',
    text: 'Very professional and encouraging. She explained every step clearly and kept me accountable throughout the program.',
  },
  {
    name: 'Maya T.',
    date: '1 month ago',
    rating: 4.5,
    avatar: 'https://i.pravatar.cc/150?img=23',
    text: 'Very professional and encouraging. She explained every step clearly and kept me accountable throughout the program.',
  },
];

export function TrainerProfileScreen() {
  const trainer = trainers[0];

  const [tab, setTab] = useState('Coach');
  const [bioExpanded, setBioExpanded] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const videoPlayer = useVideoPlayer(trainer.videoUrl, (p) => {
    p.loop = true;
  });
  const [sortVisible, setSortVisible] = useState(false);
  const [sortOption, setSortOption] = useState('Most Recent');
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryRef = useRef<FlatList>(null);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryVisible(true);
  };

  const bio =
    "I help you stay consistent with your workouts, even on the days you don't feel like showing up. Whether your goal is weight loss, muscle gain, or just getting back into shape, I'll guide you through structured sessions and keep you accountable every step of the way.";

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <View style={styles.hero}>
          <Image source={{ uri: trainer.coverImage }} style={styles.cover} />

          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>

          <Image source={{ uri: trainer.image }} style={styles.avatar} />
        </View>

        {/* CONTENT */}
        <View style={styles.info}>
          <Text style={styles.name}>{trainer.name}</Text>

          <Text style={styles.specialties}>Cardio · Mobility · Strength</Text>

          {/* STATS */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12+</Text>
              <Text style={styles.statLabel}>Clients</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3+</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* TABS */}
          <View style={styles.tabs}>
            {['Coach', 'Benefits', 'Ratings'].map((item) => (
              <Pressable
                key={item}
                onPress={() => setTab(item)}
                style={[styles.tabButton, tab === item && styles.activeTab]}
              >
                <Text style={[styles.tabText, tab === item && styles.activeText]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          {/* COACH TAB */}
          {tab === 'Coach' && (
            <>
              <Text style={styles.sectionTitle}>About {trainer.name}</Text>

              <Text style={styles.description} numberOfLines={bioExpanded ? undefined : 4}>
                {bio}
              </Text>

              <Pressable onPress={() => setBioExpanded((v) => !v)}>
                <Text style={styles.readMore}>{bioExpanded ? 'Show less' : 'Read more'}</Text>
              </Pressable>

              <Text style={styles.sectionTitle}>Training Style</Text>

              <View style={styles.pillsRow}>
                {TRAINING_STYLES.map((style) => (
                  <View key={style} style={styles.pill}>
                    <Text style={styles.pillText}>{style}</Text>
                  </View>
                ))}
              </View>

              {/* GALLERY */}
              <View style={styles.gallery}>
                <Pressable style={styles.galleryThumb} onPress={() => openGallery(0)}>
                  <Image source={{ uri: GALLERY_IMAGES[0] }} style={styles.galleryThumbImage} />
                </Pressable>
                <Pressable style={styles.galleryThumb} onPress={() => openGallery(1)}>
                  <Image source={{ uri: GALLERY_IMAGES[1] }} style={styles.galleryThumbImage} />
                </Pressable>
                <Pressable style={styles.galleryThumb} onPress={() => openGallery(2)}>
                  <Image source={{ uri: GALLERY_IMAGES[2] }} style={styles.galleryThumbImage} />
                  <View style={styles.galleryOverlay}>
                    <Text style={styles.galleryOverlayText}>+ 6</Text>
                  </View>
                </Pressable>
              </View>

              {/* VIDEO */}
              <Text style={styles.sectionTitle}>See Trainer In Action</Text>

              <Pressable style={styles.videoThumbnailWrapper} onPress={() => setVideoVisible(true)}>
                <Image source={{ uri: trainer.image }} style={styles.videoThumbnail} />
                <View style={styles.playOverlay}>
                  <Ionicons name="play" size={32} color="#fff" />
                </View>
              </Pressable>
            </>
          )}

          {/* BENEFITS TAB */}
          {tab === 'Benefits' && (
            <>
              <Text style={styles.sectionTitle}>Why Work With Charles</Text>

              {BENEFITS.map((item) => (
                <View key={item.title} style={styles.benefitCard}>
                  <View style={styles.iconWrapper}>
                    <Image source={item.icon} style={styles.benefitIcon} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.benefitTitle}>{item.title}</Text>
                    <Text style={styles.benefitText}>{item.text}</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* RATINGS TAB */}
          {tab === 'Ratings' && (
            <>
              <View style={styles.ratingHeader}>
                <Text style={styles.sectionTitle}>Trainer Ratings</Text>

                <Pressable style={styles.sortButton} onPress={() => setSortVisible(true)}>
                  <Text style={styles.sortButtonText}>{sortOption}</Text>
                  <Ionicons name="chevron-down" size={14} color="#555" />
                </Pressable>
              </View>

              {REVIEWS.map((review) => (
                <View key={review.name} style={styles.ratingCard}>
                  <View style={styles.ratingTop}>
                    <Image source={{ uri: review.avatar }} style={styles.userAvatar} />

                    <View style={{ flex: 1 }}>
                      <Text style={styles.userName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>

                    <View style={styles.starRow}>
                      <Ionicons name="star" size={14} color="#E8A000" />
                      <Text style={styles.starText}>{review.rating}</Text>
                    </View>
                  </View>

                  <Text style={styles.reviewText}>&ldquo;{review.text}&rdquo;</Text>
                </View>
              ))}
            </>
          )}

          {/* BUTTONS */}
          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Work With Charles</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Request a Call</Text>
            <Image
              source={require('../../../../assets/images/trainer/PhoneCall.png')}
              style={styles.phoneIcon}
            />
          </Pressable>
        </View>
      </ScrollView>

      {/* VIDEO MODAL */}
      <Modal
        visible={videoVisible}
        animationType="fade"
        statusBarTranslucent
        onShow={() => videoPlayer.play()}
        onDismiss={() => videoPlayer.pause()}
      >
        <View style={styles.videoModal}>
          <Pressable style={styles.videoBackButton} onPress={() => setVideoVisible(false)}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>

          <VideoView
            player={videoPlayer}
            style={styles.videoPlayer}
            contentFit="contain"
            nativeControls
          />
        </View>
      </Modal>

      {/* GALLERY MODAL */}
      <Modal visible={galleryVisible} animationType="fade" statusBarTranslucent>
        <View style={styles.galleryModal}>
          <Pressable style={styles.galleryCloseBtn} onPress={() => setGalleryVisible(false)}>
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>

          <Text style={styles.galleryCounter}>
            {galleryIndex + 1} / {GALLERY_IMAGES.length}
          </Text>

          <FlatList
            ref={galleryRef}
            data={GALLERY_IMAGES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={galleryIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setGalleryIndex(index);
            }}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <View style={styles.gallerySlide}>
                <Image
                  source={{ uri: item }}
                  style={styles.galleryFullImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />
        </View>
      </Modal>

      {/* SORT DROPDOWN MODAL */}
      <Modal visible={sortVisible} transparent animationType="fade">
        <Pressable style={styles.sortBackdrop} onPress={() => setSortVisible(false)}>
          <View style={styles.sortDropdown}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.sortOption, option === sortOption && styles.sortOptionActive]}
                onPress={() => {
                  setSortOption(option);
                  setSortVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    option === sortOption && styles.sortOptionTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  hero: {
    height: 200,
  },

  cover: {
    width: '100%',
    height: 150,
  },

  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
  },

  info: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    paddingTop: 8,
  },

  name: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 13,
    color: '#1C1C1C',
  },

  specialties: {
    textAlign: 'center',
    color: '#999',
    marginTop: 7,
    fontSize: 12,
  },

  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111',
  },

  statLabel: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    marginTop: 20,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
  },

  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  tabText: {
    textAlign: 'center',
    color: '#A3A3A3',
    fontSize: 14,
    fontWeight: '500',
  },

  activeText: {
    color: '#063660',
  },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 16,
    color: '#1C1C1C',
  },

  description: {
    fontSize: 14,
    color: '#5C5C5C',
    lineHeight: 18,
  },

  readMore: {
    marginTop: 8,
    color: '#063660',
    fontWeight: '500',
    fontSize: 14,
  },

  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },

  pill: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#F7F7F7',
  },

  pillText: {
    fontSize: 12,
    color: '#5C5C5C',
  },

  gallery: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  galleryThumb: {
    width: '31%',
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },

  galleryThumbImage: {
    width: '100%',
    height: '100%',
  },

  galleryOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  galleryOverlayText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  videoThumbnailWrapper: {
    width: '100%',
    height: 242,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },

  videoThumbnail: {
    width: '100%',
    height: '100%',
  },

  playOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  benefitCard: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    padding: 14,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#D1D1D1',
  },

  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  benefitIcon: {
    width: 24,
    height: 24,
  },

  benefitTitle: {
    fontWeight: '500',
    fontSize: 14,
    color: '#2A2A2A',
  },

  benefitText: {
    color: '#555555',
    fontSize: 12,
    marginTop: 6,
  },

  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  sortButtonText: {
    fontSize: 13,
    color: '#555',
  },

  ratingCard: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginTop: 16,
  },

  ratingTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },

  userName: {
    fontWeight: '700',
    fontSize: 13,
    color: '#111',
  },

  reviewDate: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
  },

  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  starText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '500',
  },

  reviewText: {
    color: '#555',
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
  },

  primaryBtn: {
    backgroundColor: '#005F8B',
    marginTop: 44,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  primaryText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 14,
  },

  secondaryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#0F4690',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  secondaryText: {
    color: '#1A5276',
    fontWeight: '700',
    fontSize: 14,
  },

  phoneIcon: {
    width: 20,
    height: 20,
  },

  // Video modal
  videoModal: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },

  videoBackButton: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  videoPlayer: {
    width: '100%',
    height: 280,
  },

  // Sort dropdown
  sortBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sortDropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  sortOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  sortOptionActive: {
    backgroundColor: '#F0F4FF',
  },

  sortOptionText: {
    fontSize: 14,
    color: '#444',
  },

  sortOptionTextActive: {
    color: '#1A5276',
    fontWeight: '700',
  },

  // Gallery modal
  galleryModal: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },

  galleryCloseBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  galleryCounter: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    zIndex: 10,
  },

  gallerySlide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },

  galleryFullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
});
