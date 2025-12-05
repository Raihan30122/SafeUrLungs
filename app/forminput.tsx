import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const App = () => {
  const router = useRouter();

  // State untuk data form
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [aqi, setAqi] = useState('50');
  const [selectedCategory, setSelectedCategory] = useState('Excellent');

  // AQI Categories
  const aqiCategories = [
    { 
      name: 'Excellent', 
      emoji: '😊', 
      minAQI: 0, 
      maxAQI: 50, 
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
      description: 'Perfect for outdoor activities'
    },
    { 
      name: 'Good', 
      emoji: '🙂', 
      minAQI: 51, 
      maxAQI: 100, 
      color: '#4ADE80',
      gradient: ['#4ADE80', '#22C55E'],
      description: 'Great day for exercise'
    },
    { 
      name: 'Moderate', 
      emoji: '😐', 
      minAQI: 101, 
      maxAQI: 150, 
      color: '#FACC15',
      gradient: ['#FACC15', '#EAB308'],
      description: 'Sensitive groups beware'
    },
    { 
      name: 'Unhealthy', 
      emoji: '😷', 
      minAQI: 151, 
      maxAQI: 200, 
      color: '#F97316',
      gradient: ['#F97316', '#EA580C'],
      description: 'Reduce outdoor activities'
    },
    { 
      name: 'Hazardous', 
      emoji: '⚠️', 
      minAQI: 201, 
      maxAQI: 500, 
      color: '#DC2626',
      gradient: ['#DC2626', '#991B1B'],
      description: 'Stay indoors!'
    },
  ];

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

  // Auto-update category based on AQI
  useEffect(() => {
    const aqiValue = parseInt(aqi) || 0;
    const category = aqiCategories.find(
      cat => aqiValue >= cat.minAQI && aqiValue <= cat.maxAQI
    );
    if (category) {
      setSelectedCategory(category.name);
    }
  }, [aqi]);

  // Get current location - FIXED accuracy error
  const getCoordinates = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const coords = `${loc.coords.latitude}, ${loc.coords.longitude}`;
      setLocation(coords);
      
      // FIX: Pastikan accuracy ada dan convert ke string dengan toFixed
      const accuracyValue = loc.coords.accuracy ? loc.coords.accuracy.toFixed(2) : '0';
      setAccuracy(accuracyValue + ' meter');
      
      Alert.alert('Success', 'Location captured!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to get location');
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: typeof aqiCategories[0]) => {
    setSelectedCategory(category.name);
    const middleAQI = Math.floor((category.minAQI + category.maxAQI) / 2);
    setAqi(middleAQI.toString());
  };

  // Save location
  const saveLocation = () => {
    if (!name || !location) {
      Alert.alert("Error", "Name and coordinates are required");
      return;
    }

    const selectedCat = aqiCategories.find(cat => cat.name === selectedCategory);
    const locationsRef = ref(db, 'points/');
    
    push(locationsRef, {
      name: name,
      coordinates: location,
      accuracy: accuracy,
      aqi: parseInt(aqi) || 50,
      aqiCategory: selectedCategory,
      emoji: selectedCat?.emoji || '😊',
      timestamp: new Date().toISOString(),
    }).then(() => {
      Alert.alert("Success", "Location saved successfully!", [
        { 
          text: 'Add Another', 
          onPress: () => {
            setName('');
            setLocation('');
            setAccuracy('');
            setAqi('50');
            setSelectedCategory('Excellent');
          }
        },
        { 
          text: 'View Map', 
          onPress: () => router.back()
        },
      ]);
    }).catch((e) => {
      console.error("Error adding: ", e);
      Alert.alert("Error", "Failed to save location");
    });
  };

  const currentCategory = aqiCategories.find(cat => cat.name === selectedCategory);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Add New Location',
            headerStyle: { backgroundColor: '#8B5CF6' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }} 
        />

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Card */}
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <Text style={styles.headerEmoji}>🌍</Text>
            <Text style={styles.headerTitle}>Add New Location</Text>
            <Text style={styles.headerSubtitle}>Mark a spot and set air quality</Text>
          </LinearGradient>

          {/* Location Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Location Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Central Park, Mall Area"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Coordinates */}
          <View style={styles.section}>
            <Text style={styles.label}>Coordinates *</Text>
            <TextInput
              style={styles.input}
              placeholder="-7.7956, 110.3695"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCoordinates}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.locationButtonIcon}>📍</Text>
                <Text style={styles.buttonText}>Get Current Location</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Accuracy */}
          <View style={styles.section}>
            <Text style={styles.label}>Accuracy</Text>
            <TextInput
              style={styles.input}
              placeholder="Auto-filled from GPS"
              value={accuracy}
              onChangeText={setAccuracy}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* AQI Value Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Air Quality Index (AQI)</Text>
            <View style={styles.aqiInputContainer}>
              <TextInput
                style={styles.aqiInput}
                placeholder="50"
                value={aqi}
                onChangeText={setAqi}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
              <View style={[styles.aqiBadge, { backgroundColor: currentCategory?.color }]}>
                <Text style={styles.aqiBadgeText}>{currentCategory?.emoji}</Text>
              </View>
            </View>
            <Text style={styles.helpText}>Enter a value between 0-500</Text>
          </View>

          {/* Current Category Display */}
          <View style={[styles.categoryDisplay, { backgroundColor: currentCategory?.color + '20' }]}>
            <Text style={styles.categoryDisplayEmoji}>{currentCategory?.emoji}</Text>
            <View style={styles.categoryDisplayInfo}>
              <Text style={[styles.categoryDisplayName, { color: currentCategory?.color }]}>
                {currentCategory?.name}
              </Text>
              <Text style={styles.categoryDisplayDesc}>{currentCategory?.description}</Text>
              <Text style={styles.categoryDisplayRange}>
                AQI Range: {currentCategory?.minAQI} - {currentCategory?.maxAQI}
              </Text>
            </View>
          </View>

          {/* Category Selection Grid */}
          <View style={styles.section}>
            <Text style={styles.label}>Or Select Air Quality Category</Text>
            <View style={styles.categoryGrid}>
              {aqiCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.name && styles.categoryCardSelected
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <LinearGradient
                    colors={category.gradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.categoryGradient}
                  >
                    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryRange}>
                      {category.minAQI}-{category.maxAQI}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveLocation}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>💾 Save Location</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.95,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: '#1F2937',
  },
  locationButton: {
    marginTop: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  locationButtonIcon: {
    fontSize: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  aqiInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aqiInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  aqiBadge: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aqiBadgeText: {
    fontSize: 32,
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    fontWeight: '500',
  },
  categoryDisplay: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  categoryDisplayEmoji: {
    fontSize: 48,
  },
  categoryDisplayInfo: {
    flex: 1,
  },
  categoryDisplayName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  categoryDisplayDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  categoryDisplayRange: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 64) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    borderColor: '#8B5CF6',
    transform: [{ scale: 1.02 }],
  },
  categoryGradient: {
    padding: 16,
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  categoryRange: {
    fontSize: 11,
    color: 'white',
    opacity: 0.95,
    fontWeight: '600',
  },
  saveButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
  },
});

export default App;