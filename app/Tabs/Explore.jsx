import {StyleSheet, Animated, ScrollView, View, Image, Text, TouchableOpacity, Alert} from "react-native";
import React, {useRef, useState } from "react";
import {MaterialIcons} from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import StarRating from "../Components/StarRating";
import InteractiveStarRating from "../Components/InteractiveStarRating";
import OverviewContent from "../Components/OverviewContent";
import AgenciesContent from "../Components/AgenciesContent";
import ReviewsContent from "../Components/ReviewsContent";

import BASE_URL from "../../apiConfig";

const api_config = `${BASE_URL}/save-unsave-spot`

export default function Explore() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const spot = params.spot ? JSON.parse(params.spot) : null;
    const agencies = params.agencies ? JSON.parse(params.agencies) : [];
    const activePackages = params.activePackages ? JSON.parse(params.activePackages) : [];
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const images = params.images ? JSON.parse(params.images) : [];
    const [isSaved, setIsSaved] = useState(params.isSaved === '1');
    const [userRating, setUserRating] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const changeTab = (tabName) => setActiveTab(tabName);

    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
    }).start();
    const toggleFavorite = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                Alert.alert('Error', 'User not authenticated.');
                return;
            }
            const response = await axios.post(api_config,
                { spot_id: spot.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    }
                }
            );

            const newSavedStatus = response.data.is_saved === '1';
            setIsSaved(newSavedStatus);

            Alert.alert(newSavedStatus ? 'Added to favorites' : 'Removed from favorites');

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Unable to update favorite. Please try again.');
        }
    };
    const formatSpotName = (name) => {
        if (!name) return 'Tourist Spot';
        return name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    const getSpotRating = () => {
        return spot?.rating || 0;
    };
    const getReviewsCount = () => {
        return spot?.reviews_count || 0;
    };
    const handleRatingSubmit = (rating) => {
        setUserRating(rating);
        Alert.alert('Rating Submitted', `You rated ${rating} stars for ${formatSpotName(spot?.spot_name)}!`);

        console.log(`Rating submitted for ${spot?.spot_name}: ${rating} stars`);
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerContainer}>
                    <Image
                        source={{ uri: images[0] }}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                    <View style={styles.headerOverlay}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <MaterialIcons name="arrow-back" size={20} color="#333" />
                            <Text style={styles.backButtonText}>Back to Explore</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.favoriteButton, isSaved && styles.favoriteButtonActive]}
                            onPress={toggleFavorite}
                        >
                            <MaterialIcons
                                name={isSaved ? "favorite" : "favorite-border"}
                                size={20}
                                color={isSaved ? "red" : "white"}
                            />
                            <Text style={[styles.favoriteButtonText, isSaved && styles.favoriteButtonTextActive]}>
                                {isSaved ? 'Favorite' : 'Add to Favorites'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.headerContent}>
                        <View style={styles.titleSection}>
                            <Text style={styles.spotName}>{formatSpotName(spot?.spot_name)}</Text>
                            <View style={styles.locationContainer}>
                                <MaterialIcons name="location-on" size={16} color="#666" />
                                <Text style={styles.location}>
                                    {spot?.location || 'No location'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.ratingSection}>
                            <StarRating rating={getSpotRating()} size={20} showNumber={true} />
                            <Text style={styles.reviewsCount}>
                                ({getReviewsCount()} reviews)
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rateSection}>
                        <Text style={styles.rateTitle}>Rate this Spot</Text>
                        <InteractiveStarRating
                            rating={userRating || getSpotRating()}
                            onRatingChange={handleRatingSubmit}
                            size={28}
                            interactive={true}
                        />
                        <Text style={styles.rateSubtitle}>
                            {userRating ? `You rated ${userRating} stars` : 'Tap to rate this spot'}
                        </Text>
                    </View>
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
                            onPress={() => changeTab('overview')}
                        >
                            <MaterialIcons name="info" size={16} color={activeTab === 'overview' ? '#fff' : '#4a6572'} />
                            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
                                Overview
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'spotAgencies' && styles.tabActive]}
                            onPress={() => changeTab('spotAgencies')}
                        >
                            <MaterialIcons name="business" size={16} color={activeTab === 'spotAgencies' ? '#fff' : '#4a6572'} />
                            <Text style={[styles.tabText, activeTab === 'spotAgencies' && styles.tabTextActive]}>
                                Agencies
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'reviews' && styles.tabActive]}
                            onPress={() => changeTab('reviews')}
                        >
                            <MaterialIcons name="chat" size={16} color={activeTab === 'reviews' ? '#fff' : '#4a6572'} />
                            <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>
                                Reviews
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tabContent}>
                        {activeTab === 'overview' && <OverviewContent spot={spot} />}
                        {activeTab === 'spotAgencies' && <AgenciesContent agencies={agencies} />}
                        {activeTab === 'reviews' && <ReviewsContent spot={spot} />}
                    </View>
                </View>
            </ScrollView>
        </Animated.View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0f7fa',
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        height: 300,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        paddingTop: 50,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 8,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    favoriteButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
    favoriteButtonTextActive: {
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    titleSection: {
        flex: 1,
    },
    spotName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a3c5a',
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    location: {
        fontSize: 16,
        color: '#666',
    },
    reviewsCount: {
        fontSize: 12,
        color: '#4a6572',
        marginTop: 4,
    },
    rateSection: {
        backgroundColor: '#f0f9ff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    rateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a3c5a',
        marginBottom: 12,
    },
    rateSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 6,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4,
        borderRadius: 8,
        gap: 4,
    },
    tabActive: {
        backgroundColor: '#1a3c5a',
    },
    tabText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#4a6572',
    },
    tabTextActive: {
        color: '#fff',
    },
    tabContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        minHeight: 120,
    },

});
