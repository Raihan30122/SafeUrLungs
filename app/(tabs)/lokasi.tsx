import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { LinearGradient } from 'expo-linear-gradient';

interface LocationData {
  id: string;
  name: string;
  coordinates: string;
  accuracy?: string;
  aqi?: number;
  aqiCategory?: string;
  emoji?: string;
}

const App = () => {
  const router = useRouter();
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalLocations, setTotalLocations] = useState(0);
  const [bestLocations, setBestLocations] = useState(0);

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

  // Get AQI Info
  const getAQIInfo = (aqi: number = 50) => {
    if (aqi <= 50) return { label: 'Excellent', color: '#10B981', gradient: ['#10B981', '#059669'], emoji: '😊' };
    if (aqi <= 100) return { label: 'Good', color: '#4ADE80', gradient: ['#4ADE80', '#22C55E'], emoji: '🙂' };
    if (aqi <= 150) return { label: 'Moderate', color: '#FACC15', gradient: ['#FACC15', '#EAB308'], emoji: '😐' };
    if (aqi <= 200) return { label: 'Unhealthy', color: '#F97316', gradient: ['#F97316', '#EA580C'], emoji: '😷' };
    return { label: 'Hazardous', color: '#DC2626', gradient: ['#DC2626', '#991B1B'], emoji: '⚠️' };
  };

  // Load locations from Firebase
  const loadLocations = () => {
    const pointsRef = ref(db, 'points/');
    onValue(pointsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedLocations: LocationData[] = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name || 'Unnamed',
          coordinates: data[key].coordinates || '',
          accuracy: data[key].accuracy,
          aqi: data[key].aqi || 50,
          aqiCategory: data[key].aqiCategory,
          emoji: data[key].emoji,
        }));
        
        setLocations(loadedLocations);
        setTotalLocations(loadedLocations.length);
        
        // Count best locations (AQI <= 100)
        const bestCount = loadedLocations.filter(loc => (loc.aqi || 50) <= 100).length;
        setBestLocations(bestCount);
      } else {
        setLocations([]);
        setTotalLocations(0);
        setBestLocations(0);
      }
      setRefreshing(false);
    });
  };

  useEffect(() => {
    loadLocations();
  }, []);

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadLocations();
  };

  // Delete location
  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Location',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const pointRef = ref(db, `points/${id}`);
            remove(pointRef)
              .then(() => Alert.alert('Success', 'Location deleted'))
              .catch((error) => Alert.alert('Error', error.message));
          },
        },
      ]
    );
  };

  // Edit location
  const handleEdit = (item: LocationData) => {
    router.push({
      pathname: '/formeditlocation',
      params: {
        id: item.id,
        name: item.name,
        coordinates: item.coordinates,
        accuracy: item.accuracy || '',
        aqi: item.aqi?.toString() || '50',
        aqiCategory: item.aqiCategory || 'Excellent',
      },
    });
  };

  // Navigate to map
  const handleNavigate = (coordinates: string) => {
    const coords = coordinates.split(',').map(c => c.trim());
    if (coords.length === 2) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;
      Alert.alert('Navigate', 'Opening Google Maps...', [
        { text: 'OK', onPress: () => console.log('Navigate to:', url) }
      ]);
    }
  };

  // Render item
  const renderItem = ({ item }: { item: LocationData }) => {
    const aqiInfo = getAQIInfo(item.aqi || 50);
    
    return (
      <View style={styles.card}>
        <LinearGradient
          colors={aqiInfo.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardHeader}
        >
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardEmoji}>{item.emoji || aqiInfo.emoji}</Text>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.cardCategory}>{item.aqiCategory || aqiInfo.label}</Text>
            </View>
          </View>
          <View style={styles.aqiContainer}>
            <Text style={styles.aqiLabel}>AQI</Text>
            <Text style={styles.aqiValue}>{item.aqi || 50}</Text>
          </View>
        </LinearGradient>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 Coordinates:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{item.coordinates}</Text>
          </View>
          {item.accuracy && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🎯 Accuracy:</Text>
              <Text style={styles.infoValue}>{item.accuracy}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.navigateButton]}
            onPress={() => handleNavigate(item.coordinates)}
          >
            <Text style={styles.actionButtonText}>📍 Navigate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.actionButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id, item.name)}
          >
            <Text style={styles.actionButtonText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'My Locations',
            headerStyle: { backgroundColor: '#8B5CF6' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }} 
        />

        {/* Stats Header */}
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsHeader}
        >
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalLocations}</Text>
            <Text style={styles.statLabel}>Total Locations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bestLocations}</Text>
            <Text style={styles.statLabel}>Best Locations</Text>
          </View>
        </LinearGradient>

        {/* Empty State */}
        {locations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📍</Text>
            <Text style={styles.emptyTitle}>No Locations Yet</Text>
            <Text style={styles.emptyText}>Add your first location to get started!</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/forminput')}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>➕ Add Location</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={locations}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#8B5CF6']}
              />
            }
          />
        )}

        {/* Floating Add Button */}
        {locations.length > 0 && (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => router.push('/forminput')}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.floatingButtonGradient}
            >
              <Text style={styles.floatingButtonText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  statsHeader: {
    flexDirection: 'row',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.95,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
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
  cardHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  cardEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 13,
    color: 'white',
    opacity: 0.95,
    fontWeight: '600',
  },
  aqiContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  aqiLabel: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    marginBottom: 2,
  },
  aqiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  cardBody: {
    padding: 16,
    paddingTop: 12,
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  navigateButton: {
    backgroundColor: '#3B82F6',
  },
  editButton: {
    backgroundColor: '#F59E0B',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  floatingButton: {
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
  floatingButtonGradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '300',
  },
});

export default App;