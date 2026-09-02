import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PinIndicatorProps {
  pin: string;
  length?: number;
}

export const PinIndicator: React.FC<PinIndicatorProps> = ({ pin, length = 6 }) => {
  const digits = pin.split('');
  const indicators = Array.from({ length }, (_, i) => digits[i] || '');

  return (
    <View style={styles.container}>
      {indicators.map((digit, index) => (
        <View 
          key={index} 
          style={[
            styles.indicator, 
            digit ? styles.indicatorFilled : styles.indicatorEmpty
          ]}
        >
          {digit ? <Text style={styles.digitText}>{digit}</Text> : null}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    gap: 12,
  },
  indicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorEmpty: {
    backgroundColor: '#1E1E1E',
  },
  indicatorFilled: {
    backgroundColor: '#333',
  },
  digitText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  }
});
