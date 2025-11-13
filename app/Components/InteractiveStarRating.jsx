import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function InteractiveStarRating({rating = 0, onRatingChange, size = 24, interactive = false}) {
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
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.5;

    return (
        <View style={styles.starRatingContainer}>
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => {
                    let iconName = "star-border";
                    if (star <= fullStars) {
                        iconName = "star";
                    } else if (star === fullStars + 1 && hasHalfStar) {
                        iconName = "star-half";
                    }

                    return (
                        <TouchableOpacity
                            key={star}
                            disabled={!interactive}
                            onPress={() => handlePress(star)}
                            onPressIn={() => handlePressIn(star)}
                            onPressOut={handlePressOut}
                            activeOpacity={interactive ? 0.7 : 1}
                        >
                            <MaterialIcons name={iconName} size={size} color="#ffb400" />
                        </TouchableOpacity>
                    );
                })}
            </View>

            {interactive && (
                <Text style={styles.ratingText}>
                    {Number(currentRating || 0).toFixed(1)}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    starRatingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    starsContainer: {
        flexDirection: "row",
        gap: 2,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a3c5a",
        marginLeft: 8,
    },
});
