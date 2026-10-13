import React, { useEffect, useState } from 'react';
import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { formatCurrentHeaderDate } from '../../types/tasks';

interface TopHeaderProps {
  viewMode?: 'list' | 'calendar';
  onToggleView?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  viewMode = 'list',
  onToggleView,
}) => {
  const [headerDate, setHeaderDate] = useState(() => formatCurrentHeaderDate());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setHeaderDate(formatCurrentHeaderDate());
      }
    });

    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1).getTime() -
      now.getTime();

    const timer = setTimeout(() => {
      setHeaderDate(formatCurrentHeaderDate());
    }, msUntilMidnight);

    return () => {
      subscription.remove();
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Left Group */}
      <View style={styles.leftGroup}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{headerDate}</Text>
        </View>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={onToggleView}
          disabled={!onToggleView}
          hitSlop={10}
        >
          <Ionicons
            name={viewMode === 'calendar' ? 'calendar-clear-outline' : 'list-outline'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
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
  toggleButton: {
    marginLeft: 12,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
