import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        
        {/* Active Tab: Dia */}
        <TouchableOpacity style={styles.activeTab}>
          <Ionicons name="calendar-outline" size={20} color="#000" />
          <Text style={styles.activeText}>Dia</Text>
        </TouchableOpacity>

        {/* Inactive Tabs */}
        <TouchableOpacity style={styles.iconTab}>
          <Ionicons name="wallet-outline" size={24} color="#888" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconTab}>
          <Ionicons name="document-text-outline" size={24} color="#888" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconTab}>
          <Feather name="target" size={24} color="#888" />
        </TouchableOpacity>

      </View>
      
      {/* Separate More Button */}
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 50,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 12,
  },
  activeTab: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  activeText: {
    color: '#000',
    fontWeight: '600',
    marginLeft: 6,
  },
  iconTab: {
    paddingHorizontal: 12,
  },
  moreButton: {
    backgroundColor: '#1E1E1E',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
