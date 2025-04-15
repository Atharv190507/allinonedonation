import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useCharityStore } from '@/store/charity-store';
import { DonationType } from '@/types';

export default function DonationSuccessScreen() {
  const { 
    type, 
    charityId, 
    amount, 
    items,
    units
  } = useLocalSearchParams<{ 
    type: DonationType, 
    charityId: string, 
    amount?: string, 
    items?: string,
    units?: string
  }>();
  
  const router = useRouter();
  const { getCharityById } = useCharityStore();
  
  const charity = getCharityById(charityId);
  
  // Note: In a real app, we would use the proper navigation event listener
  // This is just a placeholder comment
  
  const getSuccessMessage = () => {
    switch (type) {
      case 'food':
        return 'Your food donation has been successfully processed.';
      case 'funds':
        return `Your donation of ₹${parseFloat(amount || '0').toFixed(2)} has been successfully processed.`;
      case 'clothes':
        return 'Your clothing donation has been successfully processed.';
      case 'blood':
        return `Your blood donation of ${units || '1'} unit(s) has been successfully scheduled.`;
      default:
        return 'Your donation has been successfully processed.';
    }
  };
  
  const getTypeSpecificMessage = () => {
    switch (type) {
      case 'food':
        return 'Your contribution will help provide meals to those in need.';
      case 'funds':
        return 'Your generosity will make a real difference in the lives of others.';
      case 'clothes':
        return 'Your donated items will help those less fortunate stay warm and dignified.';
      case 'blood':
        return 'Your blood donation can save up to 3 lives. Thank you for being a lifesaver!';
      default:
        return 'Thank you for your generosity.';
    }
  };
  
  const handleGoHome = () => {
    router.replace('/(tabs)');
  };
  
  const handleViewDonations = () => {
    router.replace('/(tabs)/profile');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <Check size={64} color={colors.white} />
        </View>
        
        <Text style={styles.title}>Thank You!</Text>
        <Text style={styles.message}>{getSuccessMessage()}</Text>
        
        {charity && (
          <View style={styles.charityContainer}>
            <Text style={styles.charityLabel}>Donation to:</Text>
            <Text style={styles.charityName}>{charity.name}</Text>
          </View>
        )}
        
        <Text style={styles.impactMessage}>{getTypeSpecificMessage()}</Text>
        
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1469571486292-b53601010376?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80' }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="View My Donations" 
          onPress={handleViewDonations}
          variant="outline"
          style={styles.viewDonationsButton}
          fullWidth
        />
        
        <Button 
          title="Back to Home" 
          onPress={handleGoHome}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  charityContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  charityLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  charityName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  impactMessage: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 32,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  viewDonationsButton: {
    marginBottom: 16,
  },
});