import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: (isLogin: boolean) => void;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, onToggle }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [slideAnim] = useState(() => new Animated.Value(isLogin ? 0 : 1));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isLogin ? 0 : 1,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isLogin, slideAnim]);

  const innerWidth = containerWidth - 8; // padding is 4 on each side
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, innerWidth / 2]
  });

  return (
    <View 
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.activeBackground,
            { 
              width: innerWidth / 2,
              transform: [{ translateX }] 
            }
          ]}
        />
      )}
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => onToggle(true)}
      >
        <Text style={[styles.text, isLogin && styles.activeText]}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
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
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    zIndex: 1,
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
