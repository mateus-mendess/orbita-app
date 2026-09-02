import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen 
        name="new-task" 
        options={{ 
          presentation: 'transparentModal',
          animation: 'slide_from_bottom'
        }} 
      />
    </Stack>
  );
}
