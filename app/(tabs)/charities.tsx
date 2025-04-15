import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { CharityCard } from '@/components/CharityCard';
import { colors } from '@/constants/colors';
import { useCharityStore } from '@/store/charity-store';
import { Charity } from '@/types';

export default function CharitiesScreen() {
  const router = useRouter();
  const { charities, getCharities, isLoading } = useCharityStore();
  
  useEffect(() => {
    getCharities();
  }, []);
  
  const handleCharityPress = (charity: Charity) => {
    router.push(`/charity/${charity.id}`);
  };
  
  const handleAddCharity = () => {
    router.push('/add-charity');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Charities</Text>
          <Text style={styles.subtitle}>Support organizations making a difference</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCharity}
        >
          <Plus size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={charities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CharityCard charity={item} onPress={handleCharityPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});