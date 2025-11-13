import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import ExploreTourAgencies from "../Tabs/ExploreTourAgencies";

import BASE_URL from "../../apiConfig";
const api_remove = BASE_URL.endsWith('/api')
    ? BASE_URL.slice(0, -4)
    : BASE_URL;

const api_url = `${api_remove}/storage`;
export default function AgenciesContent({ agencies = [] }) {
    const router = useRouter();
    const [selectedAgency, setSelectedAgency] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter agencies based on nested agency_name
    const filteredAgencies = agencies.filter((agency) =>
        (agency.agency?.agency_name || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                {filteredAgencies.map((agencyWrapper) => {
                    const agency = agencyWrapper.agency; // destructure for convenience
                    return (
                        <TouchableOpacity
                            key={agencyWrapper.id}
                            style={styles.agencyCard}
                            onPress={() =>
                                setSelectedAgency({
                                    ...agencyWrapper.agency,
                                    packages_count: agencyWrapper.packages_count || 0,
                                    packages: agencyWrapper.packages || [],
                                })
                            }
                        >
                            <Image
                                source={{ uri: agency?.image_path ? `${api_url}/${agency.image_path}` : 'Image not Found' }}
                                style={styles.agencyImage}
                            />

                            <View style={styles.agencyContent}>
                                <View style={styles.agencyHeader}>
                                    <Text style={styles.agencyName}>{agency?.agency_name || 'Unnamed Agency'}</Text>
                                </View>
                                <Text style={styles.agencyDesc}>{agency?.description || 'No description'}</Text>

                                <View style={styles.agencyMeta}>
                                    <View style={styles.metaItem}>
                                        <MaterialIcons name="confirmation-number" size={14} color="#666" />
                                        <Text style={styles.metaText}>
                                            {agencyWrapper.packages_count || 0} packages
                                        </Text>

                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
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
}


const styles = StyleSheet.create({
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
})