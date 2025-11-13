// app/Tabs/Home.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import SpotCard from '../Components/SpotCard';
import axios from 'axios';
import BASE_URL from "../../apiConfig";

const api_url = `${BASE_URL}/spot-card`; // your API endpoint
const { width } = Dimensions.get('window');

export default function Home({ onNavigate }) {
    const [allSpots, setAllSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch spots from API with token
    const fetchSpots = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.get(api_url, {
                headers: {
                    Authorization: `Bearer ${token}`, // include token here
                },
            });
            setAllSpots(response.data);
        } catch (error) {
            console.log("Error fetching spots:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpots();
    }, []);

    const enhancedSpots = useMemo(() => {
        return (allSpots || []).map(spot => ({
            ...spot,
            rating: spot.average_rating || (Math.random() * 2 + 3.5),
            reviewCount: spot.reviews_count || Math.floor(Math.random() * 200) + 20,
        }));
    }, [allSpots]);

    const filteredSpots = useMemo(() => {
        const validSpots = enhancedSpots.filter(spot =>
            spot && typeof spot === 'object' && spot.id
        );

        if (!searchQuery.trim()) return validSpots;

        return validSpots.filter((spot) => {
            const spotName = spot.spot_name || '';
            const location = spot.location || '';
            const description = spot.description || '';

            return (
                spotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }, [enhancedSpots, searchQuery]);

    const goToExplore = (spot) => {
        if (onNavigate && spot) onNavigate('exploreSpots', spot);
    };

    const clearSearch = () => setSearchQuery('');

    const WaveBackground = () => (
        <View style={styles.waveContainer}>
            <View style={styles.wave} />
            <View style={[styles.wave, styles.wave2]} />
            <View style={[styles.wave, styles.wave3]} />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4' }}
                    style={styles.heroBackground}
                    imageStyle={styles.heroImage}
                >
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>Ali na sa Surigao!</Text>
                        <Text style={styles.heroSubtitle}>
                            Discover the most beautiful spots in Surigao del Norte
                        </Text>
                    </View>
                    <WaveBackground />
                </ImageBackground>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Filter Section */}
                <View style={styles.filterSection}>
                    <View style={styles.searchContainer}>
                        <MaterialIcons name="search" size={24} color="#00b4db" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for beaches, parks, waterfalls..."
                            placeholderTextColor="#666"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery ? (
                            <TouchableOpacity onPress={clearSearch} style={styles.clearSearchBtn}>
                                <MaterialIcons name="close" size={20} color="#999" />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBadge}>
                            <MaterialIcons name="explore" size={20} color="#fff" />
                            <Text style={styles.statText}>{filteredSpots.length} Spots</Text>
                        </View>
                    </View>
                </View>

                {/* Spots Grid */}
                <View style={styles.spotsContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#00b4db" style={{ marginTop: 40 }} />
                    ) : filteredSpots.length > 0 ? (
                        <View style={styles.spotsGrid}>
                            {filteredSpots.map((spot, index) => (
                                <SpotCard
                                    key={spot.id || `spot-${index}`}
                                    spot={spot}
                                    onExplore={goToExplore}
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <MaterialIcons name="search-off" size={80} color="#d1d5db" />
                            <Text style={styles.emptyTitle}>No spots found</Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery.trim()
                                    ? "Try adjusting your search to find what you're looking for"
                                    : "No spots available at the moment"}
                            </Text>
                            {searchQuery.trim() && (
                                <TouchableOpacity style={styles.clearAllBtn} onPress={clearSearch}>
                                    <Text style={styles.clearAllBtnText}>Clear Search</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    heroSection: {
        height: 250,
    },
    heroBackground: {
        flex: 1,
        justifyContent: 'center',
    },
    heroImage: {
        borderRadius: 0,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    heroContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 2,
        marginBottom: 50,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.95,
        maxWidth: 300,
        lineHeight: 24,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    waveContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    wave: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    wave2: {
        opacity: 0.5,
        transform: [{ translateY: 10 }],
    },
    wave3: {
        opacity: 0.25,
        transform: [{ translateY: 20 }],
    },
    scrollView: {
        flex: 1,
    },
    filterSection: {
        backgroundColor: '#fff',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 16,
        marginBottom: 16,
        paddingRight: 12,
    },
    searchIcon: {
        marginLeft: 16,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 14,
        paddingRight: 8,
        fontSize: 16,
        color: '#333',
    },
    clearSearchBtn: {
        padding: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00b4db',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#00b4db',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    statText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    spotsContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    spotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#9ca3af',
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 22,
        marginBottom: 16,
    },
    clearAllBtn: {
        backgroundColor: '#00b4db',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    clearAllBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
