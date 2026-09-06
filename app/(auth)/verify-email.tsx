import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NumericKeypad } from '../../components/(auth)/NumericKeypad';
import { PinIndicator } from '../../components/(auth)/PinIndicator';
import { useAuth } from '../../hooks/useAuth';

export default function VerifyEmail() {
  const params = useLocalSearchParams();
  const rawEmail = params.email as string;
  const userId = params.id as string;
  
  const [pin, setPin] = useState('');
  const [timeLeft, setTimeLeft] = useState(59);
  const [errorMsg, setErrorMsg] = useState('');

  const { verifyEmail, isLoading } = useAuth();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleKeyPress = async (key: string) => {
    if (pin.length < 6 && !isLoading) {
      const newPin = pin + key;
      setPin(newPin);
      setErrorMsg('');
      
      if (newPin.length === 6) {
        const res = await verifyEmail(userId, newPin);
        if (res.success) {
          router.replace('/(tabs)');
        } else {
          if (res.status === 400) {
            setErrorMsg('Código inválido, tente novamente');
            setPin('');
          } else if (res.status === 404) {
            setErrorMsg('Usuário não encontrado');
          } else if (res.status === 410) {
            setErrorMsg('Código expirado');
            setTimeLeft(0);
          } else {
            setErrorMsg('Erro ao verificar código');
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(prev => prev.slice(0, -1));
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
    <SafeAreaView style={styles.container}>
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

        <PinIndicator pin={pin} length={6} />
        {errorMsg ? <Text style={styles.errorMessage}>{errorMsg}</Text> : null}

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

        <View style={styles.spacer} />

        <NumericKeypad onKeyPress={handleKeyPress} onBackspace={handleBackspace} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  spacer: {
    flex: 1,
  }
});
