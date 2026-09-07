import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface OTPInputProps {
  code: string;
  setCode: (code: string) => void;
  length?: number;
  onComplete?: (code: string) => void;
  isLoading?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({ code, setCode, length = 6, onComplete, isLoading }) => {
  const inputs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length }, (_, i) => code[i] || '');

  const handleChangeText = (text: string, index: number) => {
    const newCode = digits.slice();
    newCode[index] = text;
    const nextCodeString = newCode.join('');
    setCode(nextCodeString);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (nextCodeString.length === length && onComplete) {
      onComplete(nextCodeString);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {digits.map((digit, index) => (
        <View 
          key={index} 
          style={[
            styles.indicator, 
            digit ? styles.indicatorFilled : styles.indicatorEmpty
          ]}
        >
          <TextInput
            ref={(ref) => { inputs.current[index] = ref; }}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            editable={!isLoading}
            selectTextOnFocus
          />
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
    overflow: 'hidden',
  },
  indicatorEmpty: {
    backgroundColor: '#1E1E1E',
  },
  indicatorFilled: {
    backgroundColor: '#333',
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  }
});
