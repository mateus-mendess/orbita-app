import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthInput } from '../../components/(auth)/AuthInput';
import { OTPInput } from '../../components/(auth)/OTPInput';
import { PrimaryButton } from '../../components/shared/PrimaryButton';

type Step = 'email' | 'code' | 'new-password';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  
  // Data state
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(59);

  // Animations
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [scaleAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (step !== 'code' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleNextStep = async (nextStep: Step) => {
    setErrorMsg('');
    setIsLoading(true);

    // TODO: Replace this mock with a real backend call when the endpoint is available
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsLoading(false);

    // Fade out current step
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      if (nextStep === 'code') setTimeLeft(59);
      setStep(nextStep);
      // Fade in next step
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const submitEmail = () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Por favor, insira um e-mail válido.');
      return;
    }
    handleNextStep('code');
  };

  const submitCode = () => {
    if (pin.length < 4) { // Assumindo código de no mínimo 4 dígitos
      setErrorMsg('Código incompleto.');
      return;
    }
    handleNextStep('new-password');
  };

  const submitNewPassword = async () => {
    setErrorMsg('');
    if (!validatePassword(newPassword)) {
      setErrorMsg('Mínimo 8 caracteres, maiúscula, minúscula, número e especial.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    // TODO: Replace this mock with a real backend call to reset password
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsLoading(false);
    setIsSuccess(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 12,
      bounciness: 10,
    }).start(() => {
      setTimeout(() => {
        router.back();
      }, 1000);
    });
  };

  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(59);
      // Mock API call to resend email
      console.log('Reenviando e-mail de recuperação...');
    }
  };

  const maskEmail = (e: string) => {
    if (!e || !e.includes('@')) return 'seu e-mail';
    const [user, domain] = e.split('@');
    if (user.length <= 4) return `****@${domain}`;
    return `${user.substring(0, 4)}****@${domain}`;
  };

  const renderContent = () => {
    if (isSuccess) {
      return (
        <View style={styles.successContainer}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={32} color="#000" />
            </View>
          </Animated.View>
          <Text style={styles.successText}>Senha redefinida com sucesso!</Text>
        </View>
      );
    }

    switch (step) {
      case 'email':
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.title}>Redefinir senha</Text>
            <Text style={styles.subtitle}>
              Insira seu e-mail cadastrado para redefinir sua senha.
            </Text>
            
            <AuthInput
              label="E-mail"
              iconName="mail-outline"
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={!!errorMsg}
              errorMessage={errorMsg}
            />

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Enviar código"
                isLoading={isLoading}
                onPress={submitEmail}
              />
            </View>
          </Animated.View>
        );

      case 'code':
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.title}>Verifique seu e-mail</Text>
            <Text style={styles.subtitle}>
              Enviamos um e-mail para:{'\n'}
              <Text style={styles.emailText}>{maskEmail(email)}</Text>
            </Text>
            <Text style={styles.instructions}>
              Digite o código de verificação enviado para seu e-mail. Se não encontrar, confira também a caixa de spam.
            </Text>

            <OTPInput
              code={pin}
              setCode={setPin}
              onComplete={() => {}}
              isLoading={isLoading}
            />
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

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Confirmar"
                isLoading={isLoading}
                onPress={submitCode}
              />
            </View>
          </Animated.View>
        );

      case 'new-password':
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.title}>Nova senha</Text>
            <Text style={styles.subtitle}>
              Sua senha deve conter letras maiúsculas e minúsculas, números e caracteres especiais, com no mínimo 8 caracteres.
            </Text>

            <AuthInput
              label="Nova senha"
              iconName="lock-closed-outline"
              placeholder="Digite sua nova senha"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              error={!!errorMsg && errorMsg.includes('caracteres')}
              errorMessage={errorMsg.includes('caracteres') ? errorMsg : undefined}
            />

            <AuthInput
              label="Confirmar senha"
              iconName="lock-closed-outline"
              placeholder="Confirme sua nova senha"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={!!errorMsg && errorMsg.includes('coincidem')}
              errorMessage={errorMsg.includes('coincidem') ? errorMsg : undefined}
            />

            {errorMsg && !errorMsg.includes('caracteres') && !errorMsg.includes('coincidem') ? (
              <Text style={styles.errorMessage}>{errorMsg}</Text>
            ) : null}

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Redefinir senha"
                isLoading={isLoading}
                onPress={submitNewPassword}
              />
            </View>
          </Animated.View>
        );
    }
  };

  const handleBackPress = () => {
    if (isLoading || isSuccess) return;
    if (step === 'code') {
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setStep('email');
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      });
    } else if (step === 'new-password') {
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setStep('code');
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      });
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable style={styles.backdrop} onPress={() => {
        if (!isLoading && !isSuccess) router.back();
      }} />

      <SafeAreaView style={styles.sheet}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            disabled={isLoading || isSuccess}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {renderContent()}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    paddingTop: 8,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  emailText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorMessage: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  instructions: {
    color: '#888',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
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
  buttonContainer: {
    marginTop: 24,
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
  },
});
