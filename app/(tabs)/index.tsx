import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TopHeader } from '../../components/(tabs)/TopHeader';
import { SectionHeader } from '../../components/(tabs)/SectionHeader';
import { EmptyState } from '../../components/(tabs)/EmptyState';

export default function Home() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <TopHeader />

        <View style={styles.content}>
          <SectionHeader title="Manhã" count={0} />
          <EmptyState />

          <SectionHeader title="Hábitos" count={0} />
          <EmptyState />

          <SectionHeader title="Concluídas" count={0} />
          <EmptyState />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60, // Top inset
    paddingBottom: 120, // Tab bar overlap
    paddingHorizontal: 24,
  },
  content: {
    marginTop: 16,
  }
});
