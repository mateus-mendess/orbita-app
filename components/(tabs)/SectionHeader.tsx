import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
  count: number;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, count }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>· {count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  count: {
    color: '#666',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  }
});
