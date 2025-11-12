// app/Tabs/Favorites.jsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SpotCard from '../Components/SpotCard';

const { width } = Dimensions.get('window');

// Mock saved spots data - replace with actual data from props/API
const mockSavedSpots = [
  {
    spot_id: 1,
    spot_name: "Siargao Cloud 9",
    location: "General Luna, Siargao",
    image_url: "https://images.unsplash.com/photo-1597149877677-0c31650b80e9",
    description: "World-renowned surfing spot with perfect waves",
    rating: 4.8,
    reviewCount: 156,
    images: [
      { spot_image: "https://images.unsplash.com/photo-1597149877677-0c31650b80e9" },
      { spot_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4" }
    ],
    reviews_count: 156
  },
  {
    spot_id: 2,
    spot_name: "Enchanted River",
    location: "Hinatuan, Surigao del Sur",
    image_url: "https://images.unsplash.com/photo-1588666309999-953b3a1d6e6a",
    description: "Mysterious deep blue river with crystal clear waters",
    rating: 4.9,
    reviewCount: 203,
    images: [
      { spot_image: "https://images.unsplash.com/photo-1588666309999-953b3a1d6e6a" }
    ],
    reviews_count: 203
  },
  {
    spot_id: 4,
    spot_name: "Sohoton Cove",
    location: "Socorro, Surigao del Norte",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    description: "Natural park with lagoons and caves",
    rating: 4.6,
    reviewCount: 134,
    images: [
      { spot_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4" }
    ],
    reviews_count: 134
  }
];

export default function Favorites({ saveSpots = mockSavedSpots }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter spots based on search query
  const filteredSpots = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return saveSpots;

    return saveSpots.filter((spot) => {
      const name = spot.spot_name?.toLowerCase() || '';
      const location = spot.location?.toLowerCase() || '';
      return name.includes(query) || location.includes(query);
    });
  }, [searchQuery, saveSpots]);

  const handleExplore = (spot) => {
    // Navigate to Explore screen with spot data
    router.push({
      pathname: '/Tabs/Explore',
      params: { 
        spot: JSON.stringify(spot),
        spotId: spot.spot_id,
        spotName: spot.spot_name,
        agencies: JSON.stringify([]),
        reviews: JSON.stringify([]),
        activePackages: JSON.stringify([])
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header & Search */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Saved Spots</Text>
        
        {/* Enhanced Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons 
            name="search" 
            size={20} 
            color={searchQuery ? '#00b4db' : '#666'} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or location..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <MaterialIcons name="close" size={18} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Spot Grid */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredSpots.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredSpots.map((spot) => (
              <View key={spot.spot_id} style={styles.cardWrapper}>
                <SpotCard 
                  spot={spot}
                  onExplore={() => handleExplore(spot)}
                />
              </View>
            ))}
          </View>
        ) : (
          /* Enhanced Empty State */
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons name="location-off" size={48} color="#999" />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery ? "No spots found" : "No saved spots yet"}
            </Text>
            <Text style={styles.emptyDescription}>
              {searchQuery
                ? `Try searching for "${searchQuery}" in a different way.`
                : "Explore the map and save your favorite spots to see them here."}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a2935',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  cardWrapper: {
    width: (width - 56) / 2,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
});