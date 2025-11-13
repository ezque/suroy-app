import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import SpotCard from "../Components/SpotCard";
import React, {useEffect, useMemo, useState} from "react";
import {useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width } = Dimensions.get('window');
import BASE_URL from "../../apiConfig";

const api_url = `${BASE_URL}/spot-card`;

export default function Favorites({ onNavigate }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [allSpots, setAllSpots] = useState([]);



    const fetchSpots = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.get(api_url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Filter only saved spots here
            const savedSpots = response.data.filter(
                (spot) => spot.is_saved_by_user === true
            );
            setAllSpots(savedSpots);
        } catch (error) {
            console.log("Error fetching spots:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    const filteredSpots = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return allSpots;

        return allSpots.filter((spot) => {
            const name = spot.spot_name?.toLowerCase() || "";
            const location = spot.location?.toLowerCase() || "";
            return name.includes(query) || location.includes(query);
        });
    }, [searchQuery, allSpots]);

    useEffect(() => {
        fetchSpots();
    }, []);

    const goToExplore = (spot) => {
        if (!spot) return;
        if (onNavigate) onNavigate("exploreSpots", spot);
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
                {loading ? (
                    <ActivityIndicator size="large" color="#00b4db" style={{ marginTop: 40 }} />
                ) : filteredSpots.length > 0 ? (
                    <View style={styles.spotsGrid}>
                        {filteredSpots.map((spot, index) => (
                            <View key={spot.id || `spot-${index}`} style={styles.cardWrapper}>
                                <SpotCard
                                    spot={spot}
                                    onExplore={goToExplore}
                                />
                            </View>
                        ))}
                    </View>
                ) : (
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
    )
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
    spotsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingBottom: 20,
    },

    cardWrapper: {
        width: (width - 48) / 2, // 2 columns with spacing
        marginBottom: 16,
    },

});