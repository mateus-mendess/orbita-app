import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FieldRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
  children?: ReactNode;
  isExpanded?: boolean;
}

export const FieldRow: React.FC<FieldRowProps> = ({ iconName, label, value, onPress, children, isExpanded }) => {
  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.5 }]} 
        onPress={onPress}
      >
        <View style={styles.leftContent}>
          <Ionicons name={iconName} size={20} color="#888" style={styles.icon} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.value}>{value}</Text>
      </Pressable>
      
      {isExpanded && children && (
        <View style={styles.childrenContainer}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  childrenContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    color: '#aaa',
    fontSize: 16,
  },
});
