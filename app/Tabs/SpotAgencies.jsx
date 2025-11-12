import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';

const SpotAgencies = ({ agencies = [], activePackages, spotId }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Filter agencies based on search query
  const filteredAgencies = useMemo(() => {
    if (!searchQuery.trim()) return agencies;
    return agencies.filter((agency) =>
      agency.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, agencies]);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Tour Agencies</Text>

      {/* 🔍 Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search agencies..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Agency Count */}
      <Text style={styles.message}>
        {filteredAgencies.length > 0
          ? `${filteredAgencies.length} agencies available`
          : 'No tour agencies found.'}
      </Text>

      {/* Agency List */}
      <FlatList
        data={filteredAgencies}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.agencyCard}>
            <Text style={styles.agencyName}>{item.name}</Text>
            {item.location && (
              <Text style={styles.agencyLocation}>{item.location}</Text>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default SpotAgencies;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007A8A',
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#f0f4f5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  agencyCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  agencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3c5a',
  },
  agencyLocation: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
