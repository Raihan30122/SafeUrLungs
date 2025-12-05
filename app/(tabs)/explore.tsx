import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

const { width } = Dimensions.get('window');

interface ExerciseEntry {
  id: string;
  date: string;
  activity: string;
  duration: string;
  location: string;
  aqi: number;
  mood: string;
  notes: string;
  photo?: string;
  calories?: string;
  distance?: string;
}

const ExerciseJournal = () => {
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Form states
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [aqi, setAqi] = useState('50');
  const [selectedMood, setSelectedMood] = useState('😊');
  const [notes, setNotes] = useState('');
  const [calories, setCalories] = useState('');
  const [distance, setDistance] = useState('');

  // Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyCErCqpDMZxBrarOLYnjbsRDNJVukLT2pM",
    authDomain: "reactnative111-d22bc.firebaseapp.com",
    databaseURL: "https://reactnative111-d22bc-default-rtdb.firebaseio.com",
    projectId: "reactnative111-d22bc",
    storageBucket: "reactnative111-d22bc.firebasestorage.app",
    messagingSenderId: "409863493439",
    appId: "1:409863493439:web:5a7f66b219ff5b322d658a"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // Activities & Moods
  const activities = [
    { name: 'Running', emoji: '🏃', color: '#3B82F6' },
    { name: 'Cycling', emoji: '🚴', color: '#10B981' },
    { name: 'Walking', emoji: '🚶', color: '#F59E0B' },
    { name: 'Yoga', emoji: '🧘', color: '#8B5CF6' },
    { name: 'Swimming', emoji: '🏊', color: '#06B6D4' },
    { name: 'Gym', emoji: '💪', color: '#EF4444' },
  ];

  const moods = ['😊', '😃', '😌', '😎', '🤗', '💪', '🔥', '⚡'];

  // Load entries from Firebase
  useEffect(() => {
    const entriesRef = ref(db, 'exercise_entries/');
    onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedEntries: ExerciseEntry[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        // Sort by date, newest first
        loadedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEntries(loadedEntries);
      } else {
        setEntries([]);
      }
    });
  }, []);

  // Pick image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Save entry
  const saveEntry = () => {
    if (!activity || !duration || !location) {
      Alert.alert('Error', 'Please fill activity, duration, and location');
      return;
    }

    const entriesRef = ref(db, 'exercise_entries/');
    push(entriesRef, {
      date: new Date().toISOString(),
      activity,
      duration,
      location,
      aqi: parseInt(aqi) || 50,
      mood: selectedMood,
      notes,
      photo: selectedImage,
      calories,
      distance,
    }).then(() => {
      Alert.alert('Success', 'Exercise entry saved!');
      resetForm();
      setModalVisible(false);
    }).catch((e) => {
      Alert.alert('Error', 'Failed to save entry');
    });
  };

  // Reset form
  const resetForm = () => {
    setActivity('');
    setDuration('');
    setLocation('');
    setAqi('50');
    setSelectedMood('😊');
    setNotes('');
    setCalories('');
    setDistance('');
    setSelectedImage(null);
  };

  // Delete entry
  const deleteEntry = (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const entryRef = ref(db, `exercise_entries/${id}`);
          remove(entryRef).then(() => Alert.alert('Deleted!'));
        },
      },
    ]);
  };

  // Get AQI color
  const getAQIColor = (aqiValue: number) => {
    if (aqiValue <= 50) return '#10B981';
    if (aqiValue <= 100) return '#4ADE80';
    if (aqiValue <= 150) return '#FACC15';
    if (aqiValue <= 200) return '#F97316';
    return '#DC2626';
  };

  // Calculate stats
  const totalWorkouts = entries.length;
  const thisWeekEntries = entries.filter(e => {
    const entryDate = new Date(e.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });
  const totalMinutes = entries.reduce((sum, e) => sum + parseInt(e.duration || '0'), 0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Exercise Journal</Text>
          <Text style={styles.headerSubtitle}>Track your healthy activities</Text>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{thisWeekEntries.length}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Math.floor(totalMinutes / 60)}</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>

        {/* Entries List */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {entries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🏃‍♂️</Text>
              <Text style={styles.emptyTitle}>No Entries Yet</Text>
              <Text style={styles.emptyText}>Start documenting your exercises!</Text>
            </View>
          ) : (
            entries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                {entry.photo && (
                  <Image source={{ uri: entry.photo }} style={styles.entryPhoto} />
                )}
                
                <View style={styles.entryHeader}>
                  <View style={styles.entryHeaderLeft}>
                    <Text style={styles.entryActivity}>{entry.activity}</Text>
                    <Text style={styles.entryDate}>
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.entryMood}>{entry.mood}</Text>
                </View>

                <View style={styles.entryDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>⏱️</Text>
                    <Text style={styles.detailText}>{entry.duration} minutes</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailText}>{entry.location}</Text>
                  </View>
                  {entry.distance && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>📏</Text>
                      <Text style={styles.detailText}>{entry.distance} km</Text>
                    </View>
                  )}
                  {entry.calories && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>🔥</Text>
                      <Text style={styles.detailText}>{entry.calories} cal</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>💨</Text>
                    <View style={[styles.aqiBadge, { backgroundColor: getAQIColor(entry.aqi) }]}>
                      <Text style={styles.aqiText}>AQI {entry.aqi}</Text>
                    </View>
                  </View>
                </View>

                {entry.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{entry.notes}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteEntry(entry.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Text style={styles.fabText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Add Entry Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Log Exercise</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Activity Selection */}
                <Text style={styles.inputLabel}>Activity Type *</Text>
                <View style={styles.activityGrid}>
                  {activities.map((act) => (
                    <TouchableOpacity
                      key={act.name}
                      style={[
                        styles.activityButton,
                        activity === act.name && { 
                          backgroundColor: act.color,
                          transform: [{ scale: 1.05 }],
                        },
                      ]}
                      onPress={() => setActivity(act.name)}
                    >
                      <Text style={styles.activityEmoji}>{act.emoji}</Text>
                      <Text style={[
                        styles.activityName,
                        activity === act.name && { color: 'white', fontWeight: '700' },
                      ]}>
                        {act.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Duration & Location */}
                <Text style={styles.inputLabel}>Duration (minutes) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 30"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.inputLabel}>Location *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Central Park"
                  value={location}
                  onChangeText={setLocation}
                  placeholderTextColor="#9CA3AF"
                />

                {/* Optional Fields */}
                <View style={styles.optionalRow}>
                  <View style={styles.optionalField}>
                    <Text style={styles.inputLabel}>Distance (km)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="5.2"
                      value={distance}
                      onChangeText={setDistance}
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={styles.optionalField}>
                    <Text style={styles.inputLabel}>Calories</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="250"
                      value={calories}
                      onChangeText={setCalories}
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* AQI */}
                <Text style={styles.inputLabel}>Air Quality (AQI)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="50"
                  value={aqi}
                  onChangeText={setAqi}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Mood Selection */}
                <Text style={styles.inputLabel}>How do you feel?</Text>
                <View style={styles.moodGrid}>
                  {moods.map((mood) => (
                    <TouchableOpacity
                      key={mood}
                      style={[
                        styles.moodButton,
                        selectedMood === mood && styles.moodButtonSelected,
                      ]}
                      onPress={() => setSelectedMood(mood)}
                    >
                      <Text style={styles.moodEmoji}>{mood}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Photo */}
                <Text style={styles.inputLabel}>Add Photo (Optional)</Text>
                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                  {selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={styles.photoPreview} />
                  ) : (
                    <>
                      <Text style={styles.photoIcon}>📷</Text>
                      <Text style={styles.photoText}>Tap to add photo</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Notes */}
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="How was your workout?"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9CA3AF"
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButtonGradient}
                  >
                    <Text style={styles.saveButtonText}>💾 Save Entry</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.95,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  entryPhoto: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  entryHeaderLeft: {
    flex: 1,
  },
  entryActivity: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  entryMood: {
    fontSize: 36,
  },
  entryDetails: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  aqiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aqiText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '700',
  },
  notesContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  deleteButton: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalClose: {
    fontSize: 28,
    color: '#6B7280',
    fontWeight: '300',
  },
  modalScroll: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  activityButton: {
    width: (width - 80) / 3,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activityEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  activityName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  optionalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionalField: {
    flex: 1,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodButtonSelected: {
    backgroundColor: '#8B5CF6',
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 24,
  },
  photoButton: {
    height: 150,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  photoText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default ExerciseJournal;