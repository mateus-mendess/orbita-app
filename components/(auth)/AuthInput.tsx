import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const AuthInput: React.FC<AuthInputProps> = ({ label, iconName, multiline, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        multiline && styles.inputContainerMultiline
      ]}>
        <Ionicons name={iconName} size={20} color="#888" style={[styles.icon, multiline && styles.iconMultiline]} />
        <TextInput 
          style={[styles.input, multiline && styles.inputMultiline]} 
          placeholderTextColor="#666" 
          multiline={multiline}
          {...props} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 50,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputContainerMultiline: {
    height: 120,
    alignItems: 'flex-start',
    paddingTop: 16,
    borderRadius: 24,
  },
  icon: {
    marginRight: 12,
  },
  iconMultiline: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  inputMultiline: {
    height: '100%',
    textAlignVertical: 'top',
  }
});
