import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen 
        name="verify-email" 
        options={{ 
          headerShown: false,
          presentation: 'transparentModal',
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          headerShown: false,
          presentation: 'transparentModal',
        }} 
      />
    </Stack>
  );
}
