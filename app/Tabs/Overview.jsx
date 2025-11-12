// app/Tabs/Overview.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Overview = ({ spot }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About this Spot</Text>
      <Text style={styles.description}>
        {spot?.description || 'No description available.'}
      </Text>
      
      {/* Additional spot details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{spot?.location || 'Not specified'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Rating:</Text>
          <Text style={styles.detailValue}>{spot?.rating ? spot.rating.toFixed(1) : 'Not rated'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Reviews:</Text>
          <Text style={styles.detailValue}>{spot?.reviews_count || 0}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3c5a',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a6572',
  },
  detailValue: {
    fontSize: 14,
    color: '#1a3c5a',
  },
});

export default Overview;