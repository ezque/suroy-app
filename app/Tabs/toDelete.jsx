import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Alert,
    Linking,
    Animated,
    TextInput,
    Modal,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

// Import components
import BlogContent from './BlogContent';
import ExploreTourAgencies from './ExploreTourAgencies';
import Review from './Review';

const { width, height } = Dimensions.get('window');

// Mock spot data for testing
const MOCK_SPOTS = [
    {
        id: 1,
        name: "Siargao Island",
        location: "Surigao del Norte",
        description: "Famous surfing destination with beautiful islands and lagoons. Known as the Surfing Capital of the Philippines.",
        rating: 4.8,
        reviews_count: 342,
        images: [
            { spot_image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd" },
            { spot_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5" }
        ]
    },
    {
        id: 2,
        name: "Enchanted River",
        location: "Hinatuan, Surigao del Sur",
        description: "A deep spring river with a clean and blue water. The river appears to be flowing from nowhere.",
        rating: 4.6,
        reviews_count: 287,
        images: [
            { spot_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4" }
        ]
    },
    {
        id: 3,
        name: "Sohoton Cove",
        location: "Socorro, Surigao del Norte",
        description: "National park known for its limestone formations, caves, and jellyfish sanctuary.",
        rating: 4.7,
        reviews_count: 156,
        images: [
            { spot_image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e" }
        ]
    }
];

// Mock agencies data
const MOCK_AGENCIES = [
    {
        id: 1,
        name: "Surigao Adventure Tours",
        shortDesc: "Your trusted partner for unforgettable Surigao experiences",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
        rating: 4.8,
        established: "2015",
        toursCompleted: 1250,
        responseTime: "< 1 hour",
        location: "Surigao City",
        totalCustomers: 5000,
        packages: [
            {
                id: 1,
                title: "Siargao Island Hopping",
                shortDesc: "Explore the beautiful islands of Siargao with our expert guides",
                price: 2500,
                capacity: 15,
                startDate: "2024-01-20",
                endDate: "2024-01-21",
                startTime: "08:00 AM",
                endTime: "05:00 PM",
                pickUpPoint: "General Luna Port",
                availableSlots: 8,
                badge: "Popular",
                badgeType: "popular",
                destinations: ["Guyam Island", "Daku Island", "Naked Island"],
                inclusions: [
                    "Boat transfers",
                    "Lunch buffet",
                    "Snorkeling gear",
                    "Tour guide",
                    "Entrance fees"
                ],
                exclusions: [
                    "Personal expenses",
                    "Alcoholic drinks",
                    "Hotel transfers"
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Island Explorer Philippines",
        shortDesc: "Premium island tours with luxury amenities",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        rating: 4.9,
        established: "2018",
        toursCompleted: 800,
        responseTime: "< 2 hours",
        location: "Siargao",
        totalCustomers: 3000,
        packages: [
            {
                id: 2,
                title: "Private Island Tour",
                shortDesc: "Exclusive private tour for small groups",
                price: 5000,
                capacity: 6,
                startDate: "2024-01-22",
                endDate: "2024-01-22",
                startTime: "09:00 AM",
                endTime: "04:00 PM",
                pickUpPoint: "Your accommodation",
                availableSlots: 3,
                badgeType: "new",
                destinations: ["Secret Lagoon", "Private Beach", "Coral Garden"],
                inclusions: [
                    "Private boat",
                    "Gourmet lunch",
                    "Premium snorkeling gear",
                    "Personal guide",
                    "All fees included"
                ],
                exclusions: [
                    "Personal shopping",
                    "Extra activities"
                ]
            }
        ]
    }
];

// Mock reviews data
const MOCK_REVIEWS = [
    {
        id: 1,
        user: {
            user_info: {
                firstName: "Maria",
                lastName: "Santos"
            }
        },
        review: "Absolutely breathtaking! The crystal clear waters and friendly locals made this an unforgettable experience.",
        created_at: "2024-01-15T10:30:00Z"
    },
    {
        id: 2,
        user: {
            user_info: {
                firstName: "John",
                lastName: "Doe"
            }
        },
        review: "Great spot for photography. The sunrise views are spectacular!",
        created_at: "2024-01-10T14:20:00Z"
    },
    {
        id: 3,
        user: {
            user_info: {
                firstName: "Sarah",
                lastName: "Gonzales"
            }
        },
        review: "Perfect for family outings. Kids loved the beach and we enjoyed the local cuisine.",
        created_at: "2024-01-08T09:15:00Z"
    }
];

// Mock coordinates for popular Surigao spots
const MOCK_COORDINATES = {
    "Siargao Island": { latitude: 9.9056, longitude: 126.0500 },
    "Enchanted River": { latitude: 8.3622, longitude: 126.3342 },
    "Sohoton Cove": { latitude: 9.9000, longitude: 125.9667 },
    "Surigao City": { latitude: 9.7833, longitude: 125.4833 },
    "General Luna": { latitude: 9.8239, longitude: 126.1583 },
    "Cloud 9": { latitude: 9.8586, longitude: 126.0458 },
    "Bucas Grande": { latitude: 9.6667, longitude: 125.9667 }
};

// Get coordinates for a spot
const getSpotCoordinates = (spotName) => {
    const defaultCoords = { latitude: 9.7833, longitude: 125.4833, latitudeDelta: 0.1, longitudeDelta: 0.1 };

    for (const [key, value] of Object.entries(MOCK_COORDINATES)) {
        if (spotName.toLowerCase().includes(key.toLowerCase())) {
            return {
                ...value,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            };
        }
    }

    return defaultCoords;
};

// Interactive Star Rating Component
const InteractiveStarRating = ({ rating, onRatingChange, size = 24, interactive = false }) => {
    const [currentRating, setCurrentRating] = useState(rating);
    const [tempRating, setTempRating] = useState(0);

    const handlePress = (star) => {
        if (interactive && onRatingChange) {
            setCurrentRating(star);
            onRatingChange(star);
        }
    };

    const handlePressIn = (star) => {
        if (interactive) {
            setTempRating(star);
        }
    };

    const handlePressOut = () => {
        if (interactive) {
            setTempRating(0);
        }
    };

    const displayRating = tempRating || currentRating;

    return (
        <View style={styles.starRatingContainer}>
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        disabled={!interactive}
                        onPress={() => handlePress(star)}
                        onPressIn={() => handlePressIn(star)}
                        onPressOut={handlePressOut}
                        activeOpacity={interactive ? 0.7 : 1}
                    >
                        <MaterialIcons
                            name={star <= displayRating ? "star" : "star-border"}
                            size={size}
                            color="#ffb400"
                        />
                    </TouchableOpacity>
                ))}
            </View>
            {interactive && (
                <Text style={styles.ratingText}>{currentRating.toFixed(1)}</Text>
            )}
        </View>
    );
};

// Static Star Rating Component for Display
const StarRating = ({ rating, size = 20, showNumber = false }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <View style={styles.starRatingContainer}>
            <View style={styles.starsContainer}>
                {/* Full stars */}
                {[...Array(fullStars)].map((_, index) => (
                    <MaterialIcons key={`full-${index}`} name="star" size={size} color="#ffb400" />
                ))}

                {/* Half star */}
                {hasHalfStar && (
                    <MaterialIcons name="star-half" size={size} color="#ffb400" />
                )}

                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, index) => (
                    <MaterialIcons key={`empty-${index}`} name="star-border" size={size} color="#ffb400" />
                ))}
            </View>

            {showNumber && (
                <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
            )}
        </View>
    );
};

// Review Card Component
const ReviewCard = ({ review }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatName = (user) => {
        if (!user) return 'Anonymous';
        if (user.user_info) {
            return `${user.user_info.firstName} ${user.user_info.lastName}`;
        }
        return 'Anonymous';
    };

    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                    <View style={styles.avatar}>
                        <MaterialIcons name="person" size={20} color="#666" />
                    </View>
                    <View>
                        <Text style={styles.reviewerName}>{formatName(review.user)}</Text>
                        <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.reviewText}>{review.review}</Text>
        </View>
    );
};

// Write Review Modal Component
const WriteReviewModal = ({ visible, onClose, onSubmit, spotName }) => {
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reviewText.trim()) {
            Alert.alert('Error', 'Please write your review before submitting.');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        onSubmit({
            review: reviewText,
            created_at: new Date().toISOString()
        });

        setIsSubmitting(false);
        setReviewText('');
        onClose();
    };

    const handleClose = () => {
        setReviewText('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Write a Review</Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <Text style={styles.spotName}>{spotName}</Text>

                    <View style={styles.reviewInputSection}>
                        <Text style={styles.reviewInputLabel}>Your Review</Text>
                        <TextInput
                            style={styles.reviewTextInput}
                            value={reviewText}
                            onChangeText={setReviewText}
                            placeholder="Share your experience about this spot..."
                            placeholderTextColor="#94a3b8"
                            multiline
                            numberOfLines={8}
                            textAlignVertical="top"
                        />
                    </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleClose}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.submitReviewButton,
                            (!reviewText.trim() || isSubmitting) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!reviewText.trim() || isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.submitReviewButtonText}>Submit Review</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// Updated Reviews Content Component
const ReviewsContent = ({ spot, reviews = MOCK_REVIEWS }) => {
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [spotReviews, setSpotReviews] = useState(reviews);

    const handleSubmitReview = (newReview) => {
        const reviewToAdd = {
            id: Date.now(),
            user: {
                user_info: {
                    firstName: "You",
                    lastName: ""
                }
            },
            ...newReview
        };

        setSpotReviews(prev => [reviewToAdd, ...prev]);
        Alert.alert('Success', 'Your review has been submitted!');
    };

    return (
        <View style={styles.reviewsContent}>
            {/* Reviews Header */}
            <View style={styles.reviewsHeader}>
                <View style={styles.reviewsSummary}>
                    <Text style={styles.totalReviews}>{spotReviews.length} Reviews</Text>
                    <Text style={styles.reviewsSubtitle}>Read what others are saying</Text>
                </View>

                <TouchableOpacity
                    style={styles.writeReviewButton}
                    onPress={() => setShowWriteReview(true)}
                >
                    <MaterialIcons name="edit" size={16} color="#fff" />
                    <Text style={styles.writeReviewButtonText}>Write Review</Text>
                </TouchableOpacity>
            </View>

            {/* Reviews List */}
            <View style={styles.reviewsList}>
                {spotReviews.length > 0 ? (
                    spotReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                    <View style={styles.noReviews}>
                        <MaterialIcons name="reviews" size={48} color="#cbd5e1" />
                        <Text style={styles.noReviewsTitle}>No Reviews Yet</Text>
                        <Text style={styles.noReviewsText}>
                            Be the first to share your experience!
                        </Text>
                        <TouchableOpacity
                            style={styles.firstReviewButton}
                            onPress={() => setShowWriteReview(true)}
                        >
                            <Text style={styles.firstReviewButtonText}>Write First Review</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Write Review Modal */}
            <WriteReviewModal
                visible={showWriteReview}
                onClose={() => setShowWriteReview(false)}
                onSubmit={handleSubmitReview}
                spotName={spot?.name || 'This Spot'}
            />
        </View>
    );
};

// Agencies Content Component
const AgenciesContent = ({ agencies = [] }) => {
    const router = useRouter();
    const [selectedAgency, setSelectedAgency] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAgencies = agencies.filter((agency) =>
        agency.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedAgency) {
        return (
            <ExploreTourAgencies
                agency={selectedAgency}
                onBack={() => setSelectedAgency(null)}
            />
        );
    }

    return (
        <ScrollView style={styles.agenciesContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.agenciesHeader}>
                <Text style={styles.agenciesTitle}>Tour Agencies</Text>
                <Text style={styles.agenciesSubtitle}>
                    Discover trusted tour operators in Surigao
                </Text>

                {/* 🔍 Search Bar */}
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search agencies..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.agenciesList}>
                {filteredAgencies.map((agency) => (
                    <TouchableOpacity
                        key={agency.id}
                        style={styles.agencyCard}
                        onPress={() => setSelectedAgency(agency)}
                    >
                        <Image
                            source={{ uri: agency.image }}
                            style={styles.agencyImage}
                        />
                        <View style={styles.agencyContent}>
                            <View style={styles.agencyHeader}>
                                <Text style={styles.agencyName}>{agency.name}</Text>
                                <View style={styles.agencyRating}>
                                    <MaterialIcons name="star" size={16} color="#ffb400" />
                                    <Text style={styles.ratingText}>{agency.rating}</Text>
                                </View>
                            </View>
                            <Text style={styles.agencyDesc}>{agency.shortDesc}</Text>

                            <View style={styles.agencyMeta}>
                                <View style={styles.metaItem}>
                                    <MaterialIcons name="location-on" size={14} color="#666" />
                                    <Text style={styles.metaText}>{agency.location}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <MaterialIcons name="confirmation-number" size={14} color="#666" />
                                    <Text style={styles.metaText}>{agency.packages?.length || 0} packages</Text>
                                </View>
                            </View>

                            <View style={styles.agencyStats}>
                                <Text style={styles.statText}>
                                    {agency.toursCompleted?.toLocaleString()}+ tours • {agency.totalCustomers?.toLocaleString()}+ customers
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {filteredAgencies.length === 0 && (
                <View style={styles.noAgencies}>
                    <MaterialIcons name="business" size={48} color="#ccc" />
                    <Text style={styles.noAgenciesTitle}>No Agencies Found</Text>
                    <Text style={styles.noAgenciesText}>
                        Try searching with a different name.
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

// Updated Overview Content Component with Map
const OverviewContent = ({ spot }) => {
    const openMap = () => {
        if (spot?.location) {
            const encodedLocation = encodeURIComponent(spot.location);
            const mapUrl = `https://www.google.com/maps?q=${encodedLocation}`;
            Linking.openURL(mapUrl).catch(() =>
                Alert.alert('Error', 'Could not open maps app')
            );
        }
    };

    const region = getSpotCoordinates(spot?.name || spot?.location || '');

    return (
        <View style={styles.tabContentInner}>
            <Text style={styles.tabTitle}>About this Spot</Text>
            <Text style={styles.tabDescription}>
                {spot?.description || 'No description available.'}
            </Text>

            {/* Map Section */}
            <View style={styles.mapSection}>
                <Text style={styles.mapTitle}>Location</Text>
                <TouchableOpacity
                    style={styles.mapContainer}
                    onPress={openMap}
                    activeOpacity={0.9}
                >
                    <MapView
                        style={styles.map}
                        region={region}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                    >
                        <Marker
                            coordinate={{
                                latitude: region.latitude,
                                longitude: region.longitude
                            }}
                            title={spot?.name || 'Tourist Spot'}
                            description={spot?.location || 'Surigao del Norte'}
                        >
                            <View style={styles.marker}>
                                <MaterialIcons name="location-on" size={24} color="#ff6b6b" />
                            </View>
                        </Marker>
                    </MapView>

                    <View style={styles.mapOverlay}>
                        <TouchableOpacity
                            style={styles.openMapsButton}
                            onPress={openMap}
                        >
                            <MaterialIcons name="open-in-new" size={16} color="#fff" />
                            <Text style={styles.openMapsText}>Open in Maps</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <View style={styles.locationDetails}>
                    <MaterialIcons name="location-on" size={16} color="#666" />
                    <Text style={styles.locationText}>
                        {spot?.location || 'Surigao del Norte, Philippines'}
                    </Text>
                </View>
            </View>

        </View>
    );
};

// Spot Details Component
const SpotDetails = ({ spot, agencies = [], activePackages = [] }) => {
    const router = useRouter();
    const [currentImage, setCurrentImage] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [userRating, setUserRating] = useState(0);
    const intervalRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Get the actual spot data - use mock data if no spot is passed
    const actualSpot = spot || MOCK_SPOTS[0];

    // Format spot name properly
    const formatSpotName = (name) => {
        if (!name) return 'Tourist Spot';

        // Remove any extra formatting and return proper title case
        return name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Get spot rating with default value
    const getSpotRating = () => {
        return actualSpot?.rating || 4.5;
    };

    // Get reviews count with default value
    const getReviewsCount = () => {
        return actualSpot?.reviews_count || 124;
    };

    // Handle rating submission
    const handleRatingSubmit = (rating) => {
        setUserRating(rating);
        Alert.alert('Rating Submitted', `You rated ${rating} stars for ${formatSpotName(actualSpot?.name)}!`);

        // Here you would typically send the rating to your backend
        console.log(`Rating submitted for ${actualSpot?.name}: ${rating} stars`);
    };

    useEffect(() => {
        if (actualSpot?.images && actualSpot.images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImage(prev => (prev + 1) % actualSpot.images.length);
            }, 4000);
        }

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [actualSpot]);

    const toggleFavorite = async () => {
        setIsSaved(!isSaved);
        Alert.alert(isSaved ? 'Removed from favorites' : 'Added to favorites');
    };

    const changeTab = (tabName) => setActiveTab(tabName);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header/Banner */}
                <View style={styles.headerContainer}>
                    <Image
                        source={{
                            uri:
                                actualSpot.images?.[currentImage]?.spot_image ||
                                actualSpot.image_url ||
                                'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
                        }}
                        style={styles.headerImage}
                    />

                    {/* Image Indicators */}
                    {actualSpot?.images && actualSpot.images.length > 1 && (
                        <View style={styles.imageIndicators}>
                            {actualSpot.images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.imageIndicator,
                                        index === currentImage && styles.imageIndicatorActive,
                                    ]}
                                />
                            ))}
                        </View>
                    )}

                    {/* Header Buttons Overlay */}
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
                                color={isSaved ? "#fff" : "#333"}
                            />
                            <Text style={[styles.favoriteButtonText, isSaved && styles.favoriteButtonTextActive]}>
                                {isSaved ? 'Favorite' : 'Add to Favorites'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Spot Header Info */}
                    <View style={styles.headerContent}>
                        <View style={styles.titleSection}>
                            <Text style={styles.spotName}>{formatSpotName(actualSpot?.name)}</Text>
                            <View style={styles.locationContainer}>
                                <MaterialIcons name="location-on" size={16} color="#666" />
                                <Text style={styles.location}>
                                    {actualSpot?.location || 'Surigao del Norte'}
                                </Text>
                            </View>
                        </View>

                        {/* Spot Rating Section */}
                        <View style={styles.ratingSection}>
                            <StarRating rating={getSpotRating()} size={20} showNumber={true} />
                            <Text style={styles.reviewsCount}>
                                ({getReviewsCount()} reviews)
                            </Text>
                        </View>
                    </View>

                    {/* Rate This Spot Section */}
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

                    {/* Tabs */}
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

                    {/* Tab Content */}
                    <View style={styles.tabContent}>
                        {activeTab === 'overview' && <OverviewContent spot={actualSpot} />}
                        {activeTab === 'spotAgencies' && <AgenciesContent agencies={MOCK_AGENCIES} />}
                        {activeTab === 'reviews' && <ReviewsContent spot={actualSpot} />}
                    </View>
                </View>
            </ScrollView>
        </Animated.View>
    );
};

// Main Explore Component
const Explore = ({ blogsURL = [] }) => {
    const params = useLocalSearchParams();

    // Check if we're viewing a specific spot or the main explore page
    const spot = params.spot ? JSON.parse(params.spot) : null;
    const agencies = params.agencies ? JSON.parse(params.agencies) : [];
    const activePackages = params.activePackages ? JSON.parse(params.activePackages) : [];

    // If no spot data, show blog content (main Explore page)
    if (!spot) {
        return <BlogContent blogsURL={blogsURL} />;
    }

    // Otherwise, show spot details
    return (
        <SpotDetails
            spot={spot}
            agencies={agencies}
            activePackages={activePackages}
        />
    );
};

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
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 8,
    },
    favoriteButtonActive: {
        backgroundColor: '#ff6b6b',
    },
    favoriteButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    favoriteButtonTextActive: {
        color: '#fff',
    },
    imageIndicators: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    imageIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    imageIndicatorActive: {
        backgroundColor: '#fff',
        width: 20,
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
    ratingSection: {
        alignItems: 'flex-end',
    },
    starRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    ratingNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a3c5a',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a3c5a',
        marginLeft: 8,
    },
    reviewsCount: {
        fontSize: 12,
        color: '#4a6572',
        marginTop: 4,
    },
    // Rate Section Styles
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
    tabContentInner: {
        padding: 10,
    },
    tabTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a3c5a',
        marginBottom: 10,
    },
    tabDescription: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
        marginBottom: 20,
    },
    // Map Styles
    mapSection: {
        marginTop: 20,
    },
    mapTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a3c5a',
        marginBottom: 12,
    },
    mapContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    marker: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 4,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    mapOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    openMapsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(26, 60, 90, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    openMapsText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    locationDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
        paddingHorizontal: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#666',
    },
    // Reviews Styles
    reviewsContent: {
        flex: 1,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    reviewsSummary: {
        flex: 1,
    },
    totalReviews: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a3c5a',
        marginBottom: 4,
    },
    reviewsSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    writeReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a3c5a',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    writeReviewButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    reviewsList: {
        gap: 16,
    },
    reviewCard: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a3c5a',
        marginBottom: 4,
    },
    reviewDate: {
        fontSize: 12,
        color: '#666',
    },
    reviewText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    noReviews: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    noReviewsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a3c5a',
        marginTop: 12,
        marginBottom: 8,
    },
    noReviewsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },
    firstReviewButton: {
        backgroundColor: '#1a3c5a',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    firstReviewButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a3c5a',
    },
    closeButton: {
        padding: 4,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    spotName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a3c5a',
        marginBottom: 20,
        textAlign: 'center',
    },
    reviewInputSection: {
        gap: 8,
    },
    reviewInputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a3c5a',
    },
    reviewTextInput: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        color: '#1e293b',
        minHeight: 160,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#475569',
    },
    submitReviewButton: {
        flex: 2,
        backgroundColor: '#1a3c5a',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    submitReviewButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Agencies Styles
    agenciesContainer: {
        flex: 1,
    },
    agenciesHeader: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    agenciesTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a3c5a',
        marginBottom: 4,
    },
    agenciesSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    agenciesList: {
        padding: 16,
        gap: 16,
    },
    agencyCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    agencyImage: {
        width: '100%',
        height: 150,
    },
    agencyContent: {
        padding: 16,
    },
    agencyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    agencyName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a3c5a',
        flex: 1,
        marginRight: 12,
    },
    agencyRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a3c5a',
    },
    agencyDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    agencyMeta: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
    },
    agencyStats: {
        borderTopWidth: 1,
        borderTopColor: '#f1f1f1',
        paddingTop: 8,
    },
    statText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
    },
    noAgencies: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 20,
    },
    noAgenciesTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a3c5a',
        marginTop: 12,
        marginBottom: 8,
    },
    noAgenciesText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f3f4',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        paddingVertical: 8,
    },
});

export default Explore;