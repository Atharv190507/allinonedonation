import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { BloodRequestCard } from '@/components/BloodRequestCard';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useBloodRequestStore } from '@/store/blood-request-store';
import { useAuthStore } from '@/store/auth-store';
import { BloodRequest } from '@/types';

export default function BloodScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { requests, getRequests, isLoading } = useBloodRequestStore();
  
  useEffect(() => {
    getRequests();
  }, []);
  
  const handleRequestPress = (request: BloodRequest) => {
    router.push(`/blood-request/${request.id}`);
  };
  
  const handleCreateRequest = () => {
    router.push('/create-blood-request');
  };
  
  const handleDonate = () => {
    router.push('/donate/blood');
  };
  
  // Filter requests that match user's blood group if available
  const matchingRequests = user?.bloodGroup 
    ? requests.filter(request => 
        request.status === 'open' && 
        (request.bloodGroup === user.bloodGroup || 
         (user.bloodGroup === 'O-' || // Universal donor
          (user.bloodGroup === 'O+' && request.bloodGroup.includes('+')) ||
          (user.bloodGroup === 'A-' && (request.bloodGroup === 'A-' || request.bloodGroup === 'AB-')) ||
          (user.bloodGroup === 'A+' && (request.bloodGroup === 'A+' || request.bloodGroup === 'AB+')) ||
          (user.bloodGroup === 'B-' && (request.bloodGroup === 'B-' || request.bloodGroup === 'AB-')) ||
          (user.bloodGroup === 'B+' && (request.bloodGroup === 'B+' || request.bloodGroup === 'AB+')) ||
          (user.bloodGroup === 'AB-' && request.bloodGroup === 'AB-') ||
          (user.bloodGroup === 'AB+' && request.bloodGroup === 'AB+'))
        )
      )
    : [];
  
  const otherRequests = requests.filter(request => 
    request.status === 'open' && 
    !matchingRequests.includes(request)
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Blood Donation</Text>
          <Text style={styles.subtitle}>Save lives with your donation</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateRequest}
        >
          <Plus size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.bloodInfoContainer}>
        <View style={styles.bloodInfoContent}>
          <Text style={styles.bloodInfoTitle}>Your Blood Type</Text>
          <Text style={styles.bloodInfoValue}>{user?.bloodGroup || 'Not set'}</Text>
        </View>
        
        <Button 
          title="Donate Blood" 
          onPress={handleDonate}
          variant="secondary"
          size="small"
        />
      </View>
      
      {user?.bloodGroup && matchingRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Matching Requests</Text>
          <Text style={styles.sectionSubtitle}>
            These requests match your blood type ({user.bloodGroup})
          </Text>
        </View>
      )}
      
      <FlatList
        data={[...matchingRequests, ...otherRequests]}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          // Add section header for "Other Requests"
          if (index === matchingRequests.length && matchingRequests.length > 0) {
            return (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Other Requests</Text>
                </View>
                <BloodRequestCard request={item} onPress={handleRequestPress} />
              </>
            );
          }
          return <BloodRequestCard request={item} onPress={handleRequestPress} />;
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No blood requests available</Text>
          </View>
        }
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
  createButton: {
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
  bloodInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 24,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bloodInfoContent: {
    flex: 1,
  },
  bloodInfoTitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  bloodInfoValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});