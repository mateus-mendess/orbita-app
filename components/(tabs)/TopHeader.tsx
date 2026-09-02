import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export const TopHeader = () => {
  return (
    <View style={styles.container}>
      {/* Left Group */}
      <View style={styles.leftGroup}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>Sábado, 18</Text>
        </View>
        <Ionicons name="calendar-clear-outline" size={24} color="#fff" style={styles.calendarIcon} />
      </View>

      {/* Right Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/new-task')}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 16,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    backgroundColor: '#1E1E1E',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  dateText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  calendarIcon: {
    marginLeft: 12,
  },
  addButton: {
    backgroundColor: '#1E1E1E',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
