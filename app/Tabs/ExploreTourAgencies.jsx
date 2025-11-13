import {StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, TextInput, FlatList, Alert} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import React, {useState} from "react";

import RenderPackage from "../Components/RenderPackage";
import ReservePackage from "../Components/ReservePackage";

import BASE_URL from "../../apiConfig";

const api_remove = BASE_URL.endsWith('/api')
    ? BASE_URL.slice(0, -4)
    : BASE_URL;

const api_url = `${api_remove}/storage`;

export default function ExploreTourAgencies({ agency, onBack }){
    const [searchQuery, setSearchQuery] = useState('');
    const [reservationModalVisible, setReservationModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const filteredPackages = (agency.packages || []).filter(pkg => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return pkg.package_name.toLowerCase().includes(query);
        }
        return true;
    });
    const handleReservationClose = () => {
        setReservationModalVisible(false);
        setSelectedPackage(null);
    };

    const handleReservationCompleted = () => {
        Alert.alert('Success', 'Your reservation has been successfully submitted!');
        setReservationModalVisible(false);
        setSelectedPackage(null);
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
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
                <View style={styles.agencyHeader}>
                    <View style={styles.bannerContainer}>
                        <Image
                            source={{
                                uri: agency?.image_path
                                    ? `${api_url}/${agency.image_path}`
                                    : 'Image Not Found',
                            }}
                            style={styles.agencyBanner}
                        />
                    </View>
                    <View style={styles.agencyInfo}>
                        <Text style={styles.agencyName}>{agency.agency_name}</Text>
                        <Text style={styles.agencyDesc}>{agency.description}</Text>
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
                        <Text style={styles.packageCount}>({agency.packages_count})</Text>
                    </View>
                    <FlatList
                        data={filteredPackages}
                        renderItem={({ item }) => (
                            <RenderPackage
                                item={item}
                                onReserve={(pkg) => {
                                    setSelectedPackage(pkg);
                                    setReservationModalVisible(true);
                                }}
                            />
                        )}
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
            <ReservePackage
                visible={reservationModalVisible}
                onClose={handleReservationClose}
                package={selectedPackage}
                onReservationCompleted={handleReservationCompleted}
            />

        </View>
    )
}

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