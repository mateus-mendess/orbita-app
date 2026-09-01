import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nada por aqui ainda</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#121212',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#222',
    borderStyle: 'dashed',
  },
  text: {
    color: '#666',
    fontSize: 14,
  }
});
