import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: (isLogin: boolean) => void;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, onToggle }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, isLogin && styles.activeButton]} 
        onPress={() => onToggle(true)}
      >
        <Text style={[styles.text, isLogin && styles.activeText]}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, !isLogin && styles.activeButton]} 
        onPress={() => onToggle(false)}
      >
        <Text style={[styles.text, !isLogin && styles.activeText]}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 50,
    padding: 4,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#fff',
  },
  text: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    color: '#000',
  }
});
