import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OTPInput } from '../../components/(auth)/OTPInput';
import { useAuth } from '../../hooks/useAuth';

export default function VerifyEmail() {
  const params = useLocalSearchParams();
  const rawEmail = params.email as string;
  const userId = params.id as string;
  
  const [pin, setPin] = useState('');
  const [timeLeft, setTimeLeft] = useState(59);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const { verifyEmail, isLoading } = useAuth();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOTPComplete = async (code: string) => {
    if (isLoading) return;
    setErrorMsg('');
    
    const res = await verifyEmail(userId, code);
    if (res.success) {
      setIsSuccess(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 10,
      }).start(() => {
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 600);
      });
    } else {
      if (res.status === 400) {
        setErrorMsg('Código inválido, tente novamente');
        setPin(''); // clear pins on invalid code
      } else if (res.status === 404) {
        setErrorMsg('Usuário não encontrado');
      } else if (res.status === 410) {
        setErrorMsg('Código expirado');
        setTimeLeft(0);
      } else {
        setErrorMsg('Erro ao verificar código');
      }
    }
  };

  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(59);
      // Mock resend logic
      console.log('Resending email...');
    }
  };

  const maskEmail = (e: string) => {
    if (!e || !e.includes('@')) return 'seu e-mail';
    const [user, domain] = e.split('@');
    if (user.length <= 4) return `****@${domain}`;
    return `${user.substring(0, 4)}****@${domain}`;
  };

  const displayedEmail = maskEmail(rawEmail);

  return (
    <KeyboardAvoidingView 
      style={styles.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <SafeAreaView style={styles.sheet}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Verifique seu e-mail</Text>
          
          <Text style={styles.subtitle}>
            Enviamos um e-mail para:{'\n'}
            <Text style={styles.emailText}>{displayedEmail}</Text>
          </Text>

          <Text style={styles.instructions}>
            Digite o código de verificação enviado para seu e-mail. Se não encontrar, confira também a caixa de spam.
          </Text>

          {isSuccess ? (
            <View style={styles.successContainer}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={32} color="#000" />
                </View>
              </Animated.View>
              <Text style={styles.successText}>Código validado!</Text>
            </View>
          ) : (
            <OTPInput 
              code={pin}
              setCode={setPin}
              onComplete={handleOTPComplete}
              isLoading={isLoading}
            />
          )}
          
          {!isSuccess && errorMsg ? <Text style={styles.errorMessage}>{errorMsg}</Text> : null}

          {!isSuccess && (
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Não recebeu o e-mail?</Text>
              <TouchableOpacity 
                style={[styles.resendButton, timeLeft > 0 && styles.resendButtonDisabled]} 
                onPress={handleResend}
                disabled={timeLeft > 0}
              >
                <Text style={[styles.resendButtonText, timeLeft > 0 && styles.resendButtonTextDisabled]}>
                  Reenviar e-mail {timeLeft > 0 ? `(${timeLeft}s)` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  emailText: {
    color: '#fff',
    fontWeight: '600',
  },
  instructions: {
    color: '#888',
    fontSize: 14,
    lineHeight: 22,
  },
  errorMessage: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  resendText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 16,
  },
  resendButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
  },
  resendButtonDisabled: {
    backgroundColor: '#1E1E1E',
  },
  resendButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  resendButtonTextDisabled: {
    color: '#666',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  }
});
