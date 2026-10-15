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
      {/* Canto Esquerdo: Alternância de Visão (Lista / Calendário) */}
      <TouchableOpacity
        style={styles.circleButton}
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

      {/* Centro: Container/Chip da Data Atual */}
      <View style={styles.dateBadge}>
        <Text style={styles.dateText}>{headerDate}</Text>
      </View>

      {/* Canto Direito: Botão Adicionar "+" */}
      <TouchableOpacity
        style={styles.circleButton}
        onPress={() => router.push('/new-task')}
        hitSlop={10}
      >
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
  circleButton: {
    backgroundColor: '#1E1E1E',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadge: {
    backgroundColor: '#1E1E1E',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
