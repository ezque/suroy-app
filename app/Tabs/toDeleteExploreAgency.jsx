import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Alert,
    Share,
    FlatList,
    TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ReservePackage from '../Components/ReservePackage';

const { width } = Dimensions.get('window');

const MOCK_AGENCY = {
    id: 1,
    name: "Surigao Adventure Tours",
    shortDesc: "Your trusted partner for unforgettable Surigao experiences",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
    rating: 4.8,
    location: "Surigao City",
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
            available_slot: 8,
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
        },
        {
            id: 2,
            title: "Enchanted River Tour",
            shortDesc: "Discover the mystical beauty of Hinatuan's Enchanted River",
            price: 1800,
            capacity: 12,
            startDate: "2024-01-22",
            endDate: "2024-01-22",
            startTime: "06:00 AM",
            endTime: "06:00 PM",
            pickUpPoint: "Surigao City Terminal",
            availableSlots: 0,
            available_slot: 0,
            badge: "Fully Booked",
            badgeType: "discount",
            destinations: ["Hinatuan Enchanted River", "Tinuy-an Falls"],
            inclusions: [
                "Round-trip transportation",
                "Lunch",
                "Entrance fees",
                "Tour guide"
            ],
            exclusions: [
                "Swimming gear rental",
                "Personal expenses"
            ]
        },
        {
            id: 3,
            title: "Sohoton Cove Adventure",
            shortDesc: "Experience the natural wonders of Sohoton Cove National Park",
            price: 3200,
            capacity: 10,
            startDate: "2024-01-25",
            endDate: "2024-01-26",
            startTime: "07:00 AM",
            endTime: "04:00 PM",
            pickUpPoint: "Hayanggabon Port",
            availableSlots: 5,
            available_slot: 5,
            badge: "New",
            badgeType: "new",
            destinations: ["Sohoton Cove", "Jellyfish Sanctuary", "Hagukan Cave"],
            inclusions: [
                "Boat transfers",
                "Meals (2 lunches, 1 dinner, 1 breakfast)",
                "Cottage rental",
                "Tour guide",
                "All entrance fees"
            ],
            exclusions: [
                "Personal expenses",
                "Extra activities"
            ]
        }
    ]
};

const ExploreTourAgencies = ({ agency = MOCK_AGENCY, onReservePackage }) => {
    const router = useRouter();
    const [isFavorited, setIsFavorited] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [reservationModalVisible, setReservationModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const filteredPackages = agency.packages.filter(pkg => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                pkg.title.toLowerCase().includes(query) ||
                pkg.shortDesc.toLowerCase().includes(query) ||
                pkg.destinations.some(dest => dest.toLowerCase().includes(query)) ||
                pkg.inclusions.some(inc => inc.toLowerCase().includes(query))
            );
        }
        return true;
    });

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
        Alert.alert(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    };

    const shareAgency = async () => {
        try {
            await Share.share({
                message: `Check out ${agency.name} - ${agency.shortDesc}`,
                url: 'https://suroy-app.com/agencies'
            });
        } catch (error) {
            Alert.alert('Agency link copied to clipboard!');
        }
    };

    const handleReserveClick = (pkg) => {
        console.log('🟡 Reserve button clicked for package:', pkg.title);

        if (pkg.availableSlots === 0) {
            Alert.alert('Fully Booked', 'This package is currently fully booked. Please check back later.');
            return;
        }

        // Set the selected package and open reservation modal
        setSelectedPackage(pkg);
        setReservationModalVisible(true);
    };

    const handleReservationCompleted = (reservationData) => {
        console.log('✅ Reservation completed:', reservationData);
        setReservationModalVisible(false);
        Alert.alert(
            'Reservation Confirmed!',
            `Your reservation for ${reservationData.package} has been confirmed.\n\nReservation ID: ${reservationData.reservationId}\nTotal Amount: ₱${reservationData.totalAmount.toLocaleString()}`,
            [{ text: 'OK', onPress: () => console.log('Reservation flow completed') }]
        );
    };

    const handleReservationClose = () => {
        setReservationModalVisible(false);
        setSelectedPackage(null);
    };

    const calculateDuration = (pkg) => {
        const start = new Date(pkg.startDate);
        const end = new Date(pkg.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderPackageCard = ({ item: pkg }) => (
        <View style={[
            styles.packageCard,
            pkg.availableSlots === 0 && styles.fullyBookedCard
        ]}>
            {/* ... (rest of the package card JSX remains exactly the same) ... */}
            {/* Package Header */}
            <View style={styles.packageHeader}>
                <View style={styles.packageTitleSection}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', flexShrink: 1 }}>
                        <Text
                            style={[styles.packageName, { flexShrink: 1, flexWrap: 'wrap', marginRight: 8 }]}
                            adjustsFontSizeToFit
                            numberOfLines={2}
                            minimumFontScale={0.85}
                        >
                            {pkg.title}
                        </Text>

                        <View style={[
                            styles.packageBadge,
                            styles[pkg.badgeType + 'Badge']
                        ]}>
                            <Text style={styles.packageBadgeText}>{pkg.badge}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.packageStatus}>
                    <View style={styles.availabilityStatus}>
                        <View style={[
                            styles.statusDot,
                            pkg.availableSlots > 0 ? styles.availableDot : styles.fullDot
                        ]} />
                        <Text style={[
                            styles.availabilityText,
                            pkg.availableSlots > 0 ? styles.availableText : styles.fullText
                        ]}>
                            {pkg.availableSlots > 0 ? `${pkg.availableSlots} slots left` : "Fully Booked"}
                        </Text>
                    </View>
                </View>
            </View>

            <Text style={styles.packageDesc}>{pkg.shortDesc}</Text>

            <View style={styles.quickInfo}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>💰</Text>
                    <Text style={styles.infoText}>₱{pkg.price.toLocaleString()} / person</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>👥</Text>
                    <Text style={styles.infoText}>Up to {pkg.capacity} persons</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoIcon}>🕒</Text>
                    <Text style={styles.infoText}>{calculateDuration(pkg)}</Text>
                </View>
            </View>

            <View style={styles.detailSection}>
                <View style={styles.detailTitle}>
                    <Text style={styles.detailIcon}>🕒</Text>
                    <Text style={styles.detailTitleText}>Tour Schedule</Text>
                </View>
                <View style={styles.scheduleGrid}>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleLabel}>Start</Text>
                        <Text style={styles.scheduleValue}>{formatDate(pkg.startDate)} at {pkg.startTime}</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleLabel}>End</Text>
                        <Text style={styles.scheduleValue}>{formatDate(pkg.endDate)} at {pkg.endTime}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.detailSection}>
                <View style={styles.detailTitle}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailTitleText}>Pick-up Point</Text>
                </View>
                <Text style={styles.detailContent}>{pkg.pickUpPoint}</Text>
            </View>

            <View style={styles.detailSection}>
                <View style={styles.detailTitle}>
                    <Text style={styles.detailIcon}>🏖️</Text>
                    <Text style={styles.detailTitleText}>Destinations</Text>
                </View>
                <View style={styles.destinationsGrid}>
                    {pkg.destinations.map((destination, index) => (
                        <View key={index} style={styles.destinationTag}>
                            <Text style={styles.destinationText}>{destination}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.featuresGrid}>
                <View style={styles.featureColumn}>
                    <View style={styles.featureTitle}>
                        <Text style={styles.featureIcon}>✅</Text>
                        <Text style={[styles.featureTitleText, styles.positiveText]}>Inclusions</Text>
                    </View>
                    {pkg.inclusions.map((inclusion, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Text style={[styles.checkIcon, styles.positiveText]}>✔</Text>
                            <Text style={styles.featureText}>{inclusion}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.featureColumn}>
                    <View style={styles.featureTitle}>
                        <Text style={styles.featureIcon}>❌</Text>
                        <Text style={[styles.featureTitleText, styles.negativeText]}>Exclusions</Text>
                    </View>
                    {pkg.exclusions.map((exclusion, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Text style={[styles.xIcon, styles.negativeText]}>✖</Text>
                            <Text style={styles.featureText}>{exclusion}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.packageActions}>
                <TouchableOpacity
                    style={[
                        styles.bookBtn,
                        pkg.availableSlots === 0 && styles.fullyBookedBtn
                    ]}
                    disabled={pkg.availableSlots === 0}
                    onPress={() => handleReserveClick(pkg)}
                >
                    <View style={styles.btnContent}>
                        <Text style={styles.btnIcon}>
                            {pkg.availableSlots > 0 ? '💬' : '🔒'}
                        </Text>
                        <Text style={styles.btnText}>
                            {pkg.availableSlots > 0 ? 'Reserve Now' : 'Fully Booked'}
                        </Text>
                        {pkg.availableSlots > 0 && (
                            <View style={styles.btnPrice}>
                                <Text style={styles.btnPriceText}>₱{pkg.price.toLocaleString()}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#2c3e50" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tour Agency</Text>
                <View style={styles.headerRight}>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ... (rest of the JSX remains exactly the same) ... */}
                <View style={styles.agencyHeader}>
                    <View style={styles.bannerContainer}>
                        <Image
                            source={{ uri: agency.image }}
                            style={styles.agencyBanner}
                        />
                    </View>

                    <View style={styles.agencyInfo}>
                        <Text style={styles.agencyName}>{agency.name}</Text>
                        <Text style={styles.agencyDesc}>{agency.shortDesc}</Text>
                        <View style={styles.agencyMeta}>
                            <View style={styles.metaItem}>
                                <MaterialIcons name="location-on" size={16} color="#666" />
                                <Text style={styles.metaText}>{agency.location}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <MaterialIcons name="star" size={16} color="#FFD700" />
                                <Text style={styles.metaText}>{agency.rating}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <MaterialIcons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search packages..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            clearButtonMode="while-editing"
                        />
                        {searchQuery ? (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <MaterialIcons name="clear" size={20} color="#666" />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>

                <View style={styles.packagesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Available Tour Packages</Text>
                        <Text style={styles.packageCount}>({filteredPackages.length})</Text>
                    </View>

                    <FlatList
                        data={filteredPackages}
                        renderItem={renderPackageCard}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        contentContainerStyle={styles.packagesList}
                    />

                    {filteredPackages.length === 0 && (
                        <View style={styles.noPackages}>
                            <Text style={styles.noPackagesIcon}>
                                {searchQuery ? '🔍' : '📭'}
                            </Text>
                            <Text style={styles.noPackagesTitle}>
                                {searchQuery ? 'No Packages Found' : 'No Packages Available'}
                            </Text>
                            <Text style={styles.noPackagesText}>
                                {searchQuery
                                    ? `No packages found for "${searchQuery}". Try different keywords.`
                                    : 'There are no packages available at the moment.'
                                }
                            </Text>
                            {searchQuery && (
                                <TouchableOpacity
                                    style={styles.clearSearchBtn}
                                    onPress={() => setSearchQuery('')}
                                >
                                    <Text style={styles.clearSearchText}>Clear Search</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Reservation Modal */}
            <ReservePackage
                visible={reservationModalVisible}
                onClose={handleReservationClose}
                package={selectedPackage}
                onReservationCompleted={handleReservationCompleted}
            />
        </View>
    );
};

// ... (styles remain exactly the same as in the previous version) ...

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e8f0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e3e8f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e3e8f0',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    // New Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e8f0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e3e8f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e3e8f0',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    agencyHeader: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 5,
    },
    bannerContainer: {
        position: 'relative',
    },
    agencyBanner: {
        width: '100%',
        height: 200,
    },
    agencyInfo: {
        padding: 20,
    },
    agencyName: {
        fontSize: 24,
        color: '#2c3e50',
        fontWeight: '800',
        marginBottom: 8,
    },
    agencyDesc: {
        color: '#6c7a89',
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
    },
    agencyMeta: {
        flexDirection: 'row',
        gap: 20,
        flexWrap: 'wrap',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        color: '#5d6d7e',
        fontSize: 12,
    },
    searchSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 3,
        borderWidth: 2,
        borderColor: '#e3e8f0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#2c3e50',
    },
    packagesSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#2c3e50',
        fontWeight: '700',
    },
    packageCount: {
        fontSize: 14,
        color: '#6c7a89',
        fontWeight: '500',
    },
    packagesList: {
        gap: 20,
    },
    packageCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 30,
        elevation: 5,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    fullyBookedCard: {
        opacity: 0.7,
        borderColor: '#e3e8f0',
    },
    packageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    packageTitleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        flex: 1,
    },
    packageName: {
        fontSize: 18,
        color: '#2c3e50',
        fontWeight: '700',
        flex: 1,
    },
    packageBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularBadge: {
        backgroundColor: '#fff3cd',
    },
    newBadge: {
        backgroundColor: '#d1ecf1',
    },
    discountBadge: {
        backgroundColor: '#d4edda',
    },
    packageBadgeText: {
        fontSize: 10,
        fontWeight: '600',
    },
    packageStatus: {
        marginLeft: 10,
    },
    availabilityStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    availableDot: {
        backgroundColor: '#27ae60',
    },
    fullDot: {
        backgroundColor: '#e74c3c',
    },
    availabilityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    availableText: {
        color: '#27ae60',
    },
    fullText: {
        color: '#e74c3c',
    },
    packageDesc: {
        color: '#5d6d7e',
        lineHeight: 20,
        marginBottom: 16,
        fontSize: 14,
    },
    quickInfo: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        gap: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoIcon: {
        fontSize: 16,
    },
    infoText: {
        fontWeight: '600',
        color: '#2c3e50',
        fontSize: 14,
    },
    detailSection: {
        marginBottom: 20,
    },
    detailTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    detailIcon: {
        fontSize: 16,
    },
    detailTitleText: {
        color: '#2c3e50',
        fontSize: 16,
        fontWeight: '600',
    },
    detailContent: {
        color: '#5d6d7e',
        lineHeight: 20,
        fontSize: 14,
    },
    scheduleGrid: {
        gap: 12,
    },
    scheduleItem: {
        gap: 4,
    },
    scheduleLabel: {
        fontSize: 12,
        color: '#6c7a89',
        fontWeight: '600',
    },
    scheduleValue: {
        color: '#2c3e50',
        fontWeight: '500',
        fontSize: 14,
    },
    destinationsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    destinationTag: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
    },
    destinationText: {
        color: '#1976d2',
        fontSize: 12,
        fontWeight: '500',
    },
    featuresGrid: {
        flexDirection: 'row',
        gap: 20,
        marginVertical: 20,
    },
    featureColumn: {
        flex: 1,
    },
    featureTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    featureIcon: {
        fontSize: 14,
    },
    featureTitleText: {
        fontSize: 14,
        fontWeight: '600',
    },
    positiveText: {
        color: '#27ae60',
    },
    negativeText: {
        color: '#e74c3c',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 6,
    },
    checkIcon: {
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 2,
    },
    xIcon: {
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 2,
    },
    featureText: {
        color: '#5d6d7e',
        lineHeight: 18,
        fontSize: 12,
        flex: 1,
    },
    packageActions: {
        marginTop: 20,
    },
    bookBtn: {
        backgroundColor: '#2ecc71',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    fullyBookedBtn: {
        backgroundColor: '#95a5a6',
    },
    btnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
    },
    btnIcon: {
        fontSize: 16,
    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    btnPrice: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    btnPriceText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    noPackages: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginTop: 20,
    },
    noPackagesIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    noPackagesTitle: {
        color: '#2c3e50',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    noPackagesText: {
        color: '#6c7a89',
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 16,
    },
    clearSearchBtn: {
        backgroundColor: '#3498db',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    clearSearchText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default ExploreTourAgencies;