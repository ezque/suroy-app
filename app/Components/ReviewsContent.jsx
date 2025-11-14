import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, ScrollView, ActivityIndicator,
    TextInput, TouchableOpacity, Alert
} from "react-native";
import axios from "axios";
import BASE_URL from "../../apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReviewsContent({ spot }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            if (!token) {
                console.warn("User not authenticated");
                setReviews([]);
                setLoading(false);
                return;
            }

            const response = await axios.get(`${BASE_URL}/reviews/${spot.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            setReviews(response.data);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const submitReview = async () => {
        if (!newReview.trim()) {
            Alert.alert("Error", "Please enter a review.");
            return;
        }

        setSubmitting(true);
        try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.post(
                `${BASE_URL}/reviews/${spot.id}`, // include spot id here
                { review: newReview },            // only the review text in body
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Add new review to the list
            setReviews([response.data.review, ...reviews]);
            setNewReview("");
            Alert.alert("Success", "Review added successfully!");
        } catch (error) {
            console.error("Failed to submit review:", error);
            Alert.alert("Error", "Unable to submit review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4ade80" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Input for new review */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Write your review..."
                    value={newReview}
                    onChangeText={setNewReview}
                    multiline
                />
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitReview}
                    disabled={submitting}
                >
                    <Text style={styles.submitButtonText}>
                        {submitting ? "Submitting..." : "Submit"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Reviews list */}
            {reviews.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No reviews yet for this spot.</Text>
                </View>
            ) : (
                reviews.map((review) => {
                    const createdAt = new Date(review.created_at).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    });

                    return (
                        <View key={review.id} style={styles.reviewCard}>
                            <Text style={styles.userName}>
                                {review.user?.userInfo?.firstName} {review.user?.userInfo?.lastName}
                            </Text>
                            <Text style={styles.reviewText}>{review.review}</Text>
                            <Text style={styles.dateText}>{createdAt}</Text>
                        </View>
                    );
                })

            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    loadingContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyContainer: {
        padding: 20,
        alignItems: "center",
    },
    emptyText: {
        color: "#666",
        fontSize: 14,
    },
    reviewCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    userName: {
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    reviewText: {
        color: "#555",
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 15,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    textInput: {
        minHeight: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        marginBottom: 10,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#4ade80",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    dateText: {
        fontSize: 12,
        color: "#999",
        marginTop: 5,
    }
});
