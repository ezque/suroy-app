import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Review = ({ spotId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch reviews from backend
  const getReviews = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`/api/spots/${spotId}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Error', 'Failed to load reviews');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Submit new review
  const submitReview = async () => {
    if (!newReview.trim()) {
      Alert.alert('Error', 'Please write a review before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: newReview.trim()
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Add new review to top of list
        setReviews(prevReviews => [result.review, ...prevReviews]);
        setNewReview('');
        Alert.alert('Success', 'Review submitted successfully!');
      } else {
        throw new Error(result.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format name for display
  const formatName = (user) => {
    if (!user) return 'Anonymous';
    if (user.user_info) {
      return `${user.user_info.firstName} ${user.user_info.lastName}`;
    }
    return 'Anonymous';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    getReviews();
  };

  useEffect(() => {
    getReviews();
  }, [spotId]);

  if (isLoading && reviews.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a3c5a" />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Write a Review Section */}
      <View style={styles.writeReviewSection}>
        <Text style={styles.sectionTitle}>Write a Review</Text>
        
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={newReview}
            onChangeText={setNewReview}
            placeholder="Share your experience about this spot..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]}
          onPress={submitReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Reviews List Section */}
      <View style={styles.reviewsSection}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>

        {reviews.length > 0 ? (
          <View style={styles.reviewsList}>
            {reviews.map((review, index) => (
              <View key={review.id || index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.userInfo}>
                    <MaterialIcons name="person" size={16} color="#475569" />
                    <Text style={styles.userName}>
                      {formatName(review.user)}
                    </Text>
                  </View>
                  <Text style={styles.reviewDate}>
                    {formatDate(review.created_at)}
                  </Text>
                </View>
                
                <Text style={styles.reviewText}>{review.review}</Text>
                
                {index < reviews.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="reviews" size={48} color="#cbd5e1" />
            <Text style={styles.emptyStateTitle}>No Reviews Yet</Text>
            <Text style={styles.emptyStateText}>
              Be the first to share your experience!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  writeReviewSection: {
    backgroundColor: '#f0f9ff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reviewsSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a3c5a',
    marginBottom: 16,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#1a3c5a',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsList: {
    gap: 0,
  },
  reviewItem: {
    paddingVertical: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3c5a',
    marginLeft: 6,
  },
  reviewDate: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default Review;