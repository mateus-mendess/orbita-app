import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/(tabs)/CustomTabBar';
import { THEME_COLORS } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs 
      tabBar={(props: any) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        sceneStyle: { backgroundColor: THEME_COLORS.background },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="notes" />
    </Tabs>
  );
}
