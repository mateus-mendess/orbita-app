import { Feather, Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import React from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TabConfig {
  name: string;
  label: string;
  iconName: string;
  isFeather?: boolean;
}

const TABS: TabConfig[] = [
  { name: 'index', label: 'Dia', iconName: 'calendar-outline' },
  { name: 'notes', label: 'Notas', iconName: 'document-text-outline' },
  { name: 'target', label: 'Metas', iconName: 'target', isFeather: true },
];

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const currentRouteName = state.routes[state.index]?.name || 'index';

  const handleTabPress = (tab: TabConfig) => {
    if (tab.name === 'target') {
      router.push('/habits' as any);
      return;
    }
    if (tab.name === currentRouteName) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    navigation.navigate(tab.name);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = tab.name === currentRouteName;
          const iconColor = isActive ? '#000' : '#888';
          const iconSize = isActive ? 20 : 24;

          return (
            <TouchableOpacity
              key={tab.name}
              activeOpacity={0.8}
              onPress={() => handleTabPress(tab)}
              style={[styles.tabItem, isActive && styles.activeTab]}
            >
              {tab.isFeather ? (
                <Feather name={tab.iconName as any} size={iconSize} color={iconColor} />
              ) : (
                <Ionicons name={tab.iconName as any} size={iconSize} color={iconColor} />
              )}
              {isActive ? <Text style={styles.activeText}>{tab.label}</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 50,
    padding: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  activeText: {
    color: '#000',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
});
