import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/(tabs)/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs 
      tabBar={(props: any) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
    </Tabs>
  );
}
