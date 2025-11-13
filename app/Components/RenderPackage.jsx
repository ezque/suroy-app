import {StyleSheet, View, Text, TouchableOpacity, Alert} from "react-native";
import React, {useState} from "react";

export default function RenderPackage({ item: pkg, onReserve  }) {

    const calculateDuration = (pkg) => {
        // Combine date and time strings into full timestamps
        const start = new Date(`${pkg.start_date}T${pkg.start_time}`);
        const end = new Date(`${pkg.end_date}T${pkg.end_time}`);

        // Calculate difference in milliseconds
        const diffMs = Math.abs(end - start);

        // Convert to days and hours
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

        // Return formatted duration
        if (diffDays > 0 && diffHours > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
        } else if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        } else {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes);

        return date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };
    const handleReserveClick = () => {
        if (pkg.available_slot === 0) {
            Alert.alert('Fully Booked', 'This package is currently fully booked. Please check back later.');
            return;
        }

        if (onReserve) {
            onReserve(pkg);
        }
    };


    return (
        <View style={[
            styles.packageCard,
            pkg.availableSlots === 0 && styles.fullyBookedCard
        ]}>
            <View style={styles.packageHeader}>
                <View style={styles.packageTitleSection}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', flexShrink: 1 }}>
                        <Text
                            style={[styles.packageName, { flexShrink: 1, flexWrap: 'wrap', marginRight: 8 }]}
                            adjustsFontSizeToFit
                            numberOfLines={2}
                            minimumFontScale={0.85}
                        >
                            {pkg.package_name}
                        </Text>
                    </View>
                </View>
                <View style={styles.packageStatus}>
                    <View style={styles.availabilityStatus}>
                        <View style={[
                            styles.statusDot,
                            pkg.available_slot > 0 ? styles.availableDot : styles.fullDot
                        ]} />
                        <Text style={[
                            styles.availabilityText,
                            pkg.available_slot > 0 ? styles.availableText : styles.fullText
                        ]}>
                            {pkg.available_slot > 0 ? `${pkg.available_slot} slots left` : "Fully Booked"}
                        </Text>
                    </View>
                </View>
            </View>
            <Text style={styles.packageDesc}>{pkg.description}</Text>
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
                        <Text style={styles.scheduleValue}>
                            {formatDate(pkg.start_date)} at {formatTime(pkg.start_time)}
                        </Text>
                    </View>
                    <View style={styles.scheduleItem}>
                        <Text style={styles.scheduleLabel}>End</Text>
                        <Text style={styles.scheduleValue}>
                            {formatDate(pkg.end_date)} at {formatTime(pkg.end_time)}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.detailSection}>
                <View style={styles.detailTitle}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailTitleText}>Pick-up Point</Text>
                </View>
                <Text style={styles.detailContent}>{pkg.pickup_point}</Text>
            </View>
            <View style={styles.detailSection}>
                <View style={styles.detailTitle}>
                    <Text style={styles.detailIcon}>🏖️</Text>
                    <Text style={styles.detailTitleText}>Destinations</Text>
                </View>
                <View style={styles.destinationsGrid}>
                    {pkg.tour_destinations && pkg.tour_destinations.length > 0 ? (
                        pkg.tour_destinations.map((spot, index) => (
                            <View key={spot.id || index} style={styles.destinationTag}>
                                <Text style={styles.destinationText}>{spot.spot_name}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDestinations}>No destinations listed</Text>
                    )}
                </View>
            </View>
            <View style={styles.featuresGrid}>
                <View style={styles.featureColumn}>
                    <View style={styles.featureTitle}>
                        <Text style={styles.featureIcon}>✅</Text>
                        <Text style={[styles.featureTitleText, styles.positiveText]}>Inclusions</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={[styles.checkIcon, styles.positiveText]}>✔</Text>
                        <Text style={styles.featureText}>{pkg.inclusions}</Text>
                    </View>

                </View>
                <View style={styles.featureColumn}>
                    <View style={styles.featureTitle}>
                        <Text style={styles.featureIcon}>❌</Text>
                        <Text style={[styles.featureTitleText, styles.negativeText]}>Exclusions</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={[styles.xIcon, styles.negativeText]}>✖</Text>
                        <Text style={styles.featureText}>{pkg.exclusions}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.packageActions}>
                <TouchableOpacity
                    style={[
                        styles.bookBtn,
                        pkg.available_slot === 0 && styles.fullyBookedBtn
                    ]}
                    disabled={pkg.available_slot === 0}
                    onPress={() => handleReserveClick(pkg)}
                >
                    <View style={styles.btnContent}>
                        <Text style={styles.btnIcon}>
                            {pkg.available_slot > 0 ? '💬' : '🔒'}
                        </Text>
                        <Text style={styles.btnText}>
                            {pkg.available_slot > 0 ? 'Reserve Now' : 'Fully Booked'}
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
    )
}

const styles = StyleSheet.create({
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
    packageName: {
        fontSize: 18,
        color: '#2c3e50',
        fontWeight: '700',
        flex: 1,
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
})