import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialButtonProps extends TouchableOpacityProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ title, iconName, ...props }) => {
  return (
    <TouchableOpacity style={styles.button} {...props}>
      <Ionicons name={iconName} size={20} color="#fff" style={styles.icon} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 50,
    paddingVertical: 14,
    marginHorizontal: 6,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  }
});
