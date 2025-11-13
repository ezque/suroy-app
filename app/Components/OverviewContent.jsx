import { Alert, Linking, Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

const GOOGLE_STATIC_MAPS_API_KEY = "YOUR_GOOGLE_API_KEY"; // 🔐 replace with your Google Maps API key

export default function OverviewContent({ spot }) {
    const openMap = () => {
        if (spot?.location) {
            const encodedLocation = encodeURIComponent(spot.location);
            const mapUrl = `https://www.google.com/maps?q=${encodedLocation}`;
            Linking.openURL(mapUrl).catch(() =>
                Alert.alert("Error", "Could not open maps app")
            );
        } else {
            Alert.alert("No location", "This spot does not have a valid location.");
        }
    };

    const staticMapUrl = spot?.location
        ? `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
            spot.location
        )}&zoom=12&size=600x300&markers=color:red|${encodeURIComponent(
            spot.location
        )}&key=${GOOGLE_STATIC_MAPS_API_KEY}`
        : null;

    return (
        <View style={styles.tabContentInner}>
            <Text style={styles.tabTitle}>About this Spot</Text>
            <Text style={styles.tabDescription}>
                {spot?.description || "No description available."}
            </Text>

            {/* Location Section */}
            <View style={styles.mapSection}>
                <Text style={styles.mapTitle}>Location</Text>

                <TouchableOpacity
                    style={styles.mapContainer}
                    onPress={openMap}
                    activeOpacity={0.9}
                >
                    {staticMapUrl ? (
                        <Image
                            source={{ uri: staticMapUrl }}
                            style={styles.map}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.noMap}>
                            <Text style={styles.noMapText}>Map preview not available</Text>
                        </View>
                    )}

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
                        {spot?.location || "Location not found"}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tabContentInner: {
        padding: 10,
    },
    tabTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1a3c5a",
        marginBottom: 10,
    },
    tabDescription: {
        fontSize: 16,
        color: "#666",
        lineHeight: 22,
        marginBottom: 20,
    },
    mapSection: {
        marginTop: 20,
    },
    mapTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a3c5a",
        marginBottom: 12,
    },
    mapContainer: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        position: "relative",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    noMap: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
    },
    noMapText: {
        color: "#999",
        fontSize: 14,
    },
    mapOverlay: {
        position: "absolute",
        top: 8,
        right: 8,
    },
    openMapsButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(26, 60, 90, 0.9)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    openMapsText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
    },
    locationDetails: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 8,
        paddingHorizontal: 4,
    },
    locationText: {
        fontSize: 14,
        color: "#666",
    },
});
