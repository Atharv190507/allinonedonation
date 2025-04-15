import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaymentMethodCard } from '@/components/PaymentMethodCard';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useCharityStore } from '@/store/charity-store';
import { useAuthStore } from '@/store/auth-store';
import { useDonationStore } from '@/store/donation-store';
import { PaymentMethod, DonationType } from '@/types';

export default function PaymentScreen() {
  const { 
    type, 
    charityId, 
    amount, 
    items 
  } = useLocalSearchParams<{ 
    type: DonationType, 
    charityId: string, 
    amount?: string, 
    items?: string 
  }>();
  
  const router = useRouter();
  const { user } = useAuthStore();
  const { getCharityById } = useCharityStore();
  const { addDonation } = useDonationStore();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const charity = getCharityById(charityId);
  const parsedItems = items ? JSON.parse(items) : [];
  
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };
  
  const handlePayment = async () => {
    if (!user) {
      alert('You must be logged in to make a donation');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add donation to store
      await addDonation({
        type,
        charityId,
        userId: user.id,
        amount: amount ? parseFloat(amount) : undefined,
        items: items ? JSON.parse(items) : undefined,
        paymentMethod: selectedPaymentMethod,
      });
      
      // Navigate to success screen
      router.push({
        pathname: '/donation-success',
        params: {
          type,
          charityId,
          amount,
          items,
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };
  
  const getTypeTitle = () => {
    switch (type) {
      case 'food':
        return 'Food Donation';
      case 'funds':
        return 'Funds Donation';
      case 'clothes':
        return 'Clothes Donation';
      default:
        return 'Donation';
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Payment</Text>
          <Text style={styles.subtitle}>{getTypeTitle()}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donation Summary</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Charity</Text>
              <Text style={styles.summaryValue}>{charity?.name || 'Unknown'}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Donation Type</Text>
              <Text style={styles.summaryValue}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </View>
            
            {type === 'funds' && amount && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount</Text>
                <Text style={styles.summaryValue}>₹{parseFloat(amount).toFixed(2)}</Text>
              </View>
            )}
            
            {(type === 'food' || type === 'clothes') && parsedItems.length > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items</Text>
                <Text style={styles.summaryValue}>{parsedItems.length} items</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <PaymentMethodCard
            method="credit_card"
            selected={selectedPaymentMethod === 'credit_card'}
            onSelect={handlePaymentMethodSelect}
          />
          
          <PaymentMethodCard
            method="paypal"
            selected={selectedPaymentMethod === 'paypal'}
            onSelect={handlePaymentMethodSelect}
          />
          
          <PaymentMethodCard
            method="bank_transfer"
            selected={selectedPaymentMethod === 'bank_transfer'}
            onSelect={handlePaymentMethodSelect}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing Information</Text>
          
          <View style={styles.billingCard}>
            <Text style={styles.billingName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.billingEmail}>{user?.email || 'guest@example.com'}</Text>
            
            {user?.address ? (
              <Text style={styles.billingAddress}>{user.address}</Text>
            ) : (
              <Text style={styles.billingAddressPlaceholder}>No address provided</Text>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title={type === 'funds' ? `Pay ₹${parseFloat(amount || '0').toFixed(2)}` : 'Complete Donation'} 
          onPress={handlePayment}
          loading={isProcessing}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
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
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  billingCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  billingName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  billingEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  billingAddress: {
    fontSize: 14,
    color: colors.text,
  },
  billingAddressPlaceholder: {
    fontSize: 14,
    color: colors.textLighter,
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
});