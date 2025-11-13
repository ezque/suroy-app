// app/Components/SpotCard.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BASE_URL from "../../apiConfig";
const { width } = Dimensions.get('window');

const api_remove = BASE_URL.endsWith('/api')
    ? BASE_URL.slice(0, -4)
    : BASE_URL;

const api_url = `${api_remove}/storage`;

// Default fallback data
const defaultSpot = {
  spot_id: 'fallback',
  spot_name: 'Unknown Spot',
  location: 'Location not available',
  description: 'No description available',
  rating: 0,
  reviewCount: 0,
  reviews_count: 0
};

const SpotCard = (props) => {
    const router = useRouter();

    // Safe destructuring with fallbacks
    const { spot = defaultSpot } = props || {};

    // Ensure we always have a valid spot object
    const safeSpot = spot && typeof spot === 'object' ? spot : defaultSpot;

    // Safe property access
    const spotName = safeSpot.spot_name || defaultSpot.spot_name;
    const location = safeSpot.location || defaultSpot.location;
    const imageUrl = safeSpot.images?.[0]?.spot_image
        ? `${api_url}/${safeSpot.images[0].spot_image}`
        : safeSpot.image_url || defaultSpot.image_url;
    const rating = safeSpot.rating || 0;
    const reviewCount = safeSpot.reviews_count || 0;

    const handleExplore = () => {
        if (safeSpot.spot_id !== 'fallback') {
            const imagesUrls = (safeSpot.images || []).map(img => `${api_url}/${img.spot_image}`);

            // Prepare agencies and packages data
            const agencies = safeSpot.agencies || []; // make sure backend includes this
            const activePackages = safeSpot.activePackages || []; // or filter packages containing this spot

            router.push({
                pathname: '/Tabs/Explore',
                params: {
                    spot: JSON.stringify(safeSpot),
                    spotId: safeSpot.spot_id,
                    spotName: spotName,
                    agencies: JSON.stringify(agencies),
                    activePackages: JSON.stringify(activePackages),
                    reviews: JSON.stringify(safeSpot.reviews || []),
                    images: JSON.stringify(imagesUrls),
                    isSaved: safeSpot.is_saved_by_user ? '1' : '0'
                }
            });
        }
    };


    // Calculate star components
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handleExplore}
        >
            {/* Image with overlay rating */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.cardImage}
                />

                {/* Gradient overlay for better text readability */}
                <View style={styles.imageGradientOverlay} />
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.spotName} numberOfLines={1}>
                    {spotName}
                </Text>

                {/* Detailed rating below title */}
                <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                        {/* Full stars */}
                        {Array.from({ length: fullStars }).map((_, index) => (
                            <MaterialIcons
                                key={`full-${index}`}
                                name="star"
                                size={14}
                                color="#ffb400"
                            />
                        ))}

                        {/* Half star */}
                        {hasHalfStar && (
                            <MaterialIcons
                                key="half"
                                name="star-half"
                                size={14}
                                color="#ffb400"
                            />
                        )}

                        {/* Empty stars */}
                        {Array.from({ length: emptyStars }).map((_, index) => (
                            <MaterialIcons
                                key={`empty-${index}`}
                                name="star-border"
                                size={14}
                                color="#ffb400"
                            />
                        ))}
                    </View>
                    <Text style={styles.ratingText}>({reviewCount} reviews)</Text>
                </View>

                <View style={styles.locationContainer}>
                    <MaterialIcons name="location-on" size={14} color="#666" />
                    <Text style={styles.location} numberOfLines={1}>
                        {location}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={handleExplore}
                >
                    <Text style={styles.exploreButtonText}>Explore</Text>
                    <MaterialIcons name="arrow-forward" size={14} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: (width - 56) / 2,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: 120,
    },
    imageRatingOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 2,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    ratingBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    imageGradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    cardContent: {
        padding: 12,
    },
    spotName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
    },
    ratingContainer: {
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    ratingText: {
        fontSize: 11,
        color: '#666',
        fontWeight: '500',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    location: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
        flex: 1,
    },
    exploreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00b4db',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginRight: 4,
    },
});

export default SpotCard;