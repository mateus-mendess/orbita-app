import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
}

const keys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
];

export const NumericKeypad: React.FC<NumericKeypadProps> = ({ onKeyPress, onBackspace }) => {
  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            if (key === '') {
              return <View key="empty" style={styles.key} />;
            }

            if (key === 'backspace') {
              return (
                <TouchableOpacity 
                  key={key} 
                  style={styles.key} 
                  onPress={onBackspace}
                >
                  <Ionicons name="backspace-outline" size={28} color="#fff" />
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity 
                key={key} 
                style={styles.key} 
                onPress={() => onKeyPress(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  key: {
    width: Dimensions.get('window').width / 3 - 40,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '500',
  },
});
