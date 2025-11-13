import {Text, View, StyleSheet} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import React from "react";


export default function StarRating({ rating, size = 20, showNumber = false }){
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
                <Text style={styles.ratingNumber}>{Number(rating || 0).toFixed(1)}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
})