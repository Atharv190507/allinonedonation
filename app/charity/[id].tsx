import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MapPin, Users, Heart, ArrowRight, CreditCard, QrCode, Landmark } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useCharityStore } from '@/store/charity-store';
import { DonationType } from '@/types';

export default function CharityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getCharityById } = useCharityStore();
  
  const charity = getCharityById(id);
  
  if (!charity) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Charity not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const handleDonate = (type: DonationType) => {
    router.push({
      pathname: `/donate/${type}`,
      params: { charityId: charity.id }
    });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: charity.image }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{charity.name}</Text>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Text style={styles.rating}>{charity.rating.toFixed(1)}</Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={colors.textLight} />
            <Text style={styles.location}>{charity.location}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Users size={20} color={colors.primary} />
              <Text style={styles.statValue}>{charity.donationsCount.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Donations</Text>
            </View>
            
            <View style={styles.categoriesContainer}>
              {charity.categories.map((category, index) => (
                <View key={index} style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{charity.description}</Text>
          </View>
          
          {/* Payment Information Section - Only show if charity accepts funds */}
          {charity.categories.includes('funds') && charity.paymentInfo && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Direct Payment Options</Text>
              
              {charity.paymentInfo.upiId && (
                <View style={styles.paymentInfoItem}>
                  <View style={styles.paymentInfoIcon}>
                    <CreditCard size={20} color={colors.primary} />
                  </View>
                  <View style={styles.paymentInfoContent}>
                    <Text style={styles.paymentInfoTitle}>UPI ID</Text>
                    <Text style={styles.paymentInfoValue}>{charity.paymentInfo.upiId}</Text>
                  </View>
                </View>
              )}
              
              {charity.paymentInfo.qrCodeImage && (
                <View style={styles.paymentInfoItem}>
                  <View style={styles.paymentInfoIcon}>
                    <QrCode size={20} color={colors.primary} />
                  </View>
                  <View style={styles.paymentInfoContent}>
                    <Text style={styles.paymentInfoTitle}>QR Code</Text>
                    <View style={styles.qrCodeContainer}>
                      <Image 
                        source={{ uri: charity.paymentInfo.qrCodeImage }} 
                        style={styles.qrCodeImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.qrCodeHelp}>Scan this QR code to donate directly</Text>
                  </View>
                </View>
              )}
              
              {charity.paymentInfo.bankDetails && (
                <View style={styles.paymentInfoItem}>
                  <View style={styles.paymentInfoIcon}>
                    <Landmark size={20} color={colors.primary} />
                  </View>
                  <View style={styles.paymentInfoContent}>
                    <Text style={styles.paymentInfoTitle}>Bank Details</Text>
                    <View style={styles.bankDetailsContainer}>
                      <View style={styles.bankDetailRow}>
                        <Text style={styles.bankDetailLabel}>Account Name:</Text>
                        <Text style={styles.bankDetailValue}>{charity.paymentInfo.bankDetails.accountName}</Text>
                      </View>
                      <View style={styles.bankDetailRow}>
                        <Text style={styles.bankDetailLabel}>Account Number:</Text>
                        <Text style={styles.bankDetailValue}>{charity.paymentInfo.bankDetails.accountNumber}</Text>
                      </View>
                      <View style={styles.bankDetailRow}>
                        <Text style={styles.bankDetailLabel}>IFSC Code:</Text>
                        <Text style={styles.bankDetailValue}>{charity.paymentInfo.bankDetails.ifscCode}</Text>
                      </View>
                      <View style={styles.bankDetailRow}>
                        <Text style={styles.bankDetailLabel}>Bank Name:</Text>
                        <Text style={styles.bankDetailValue}>{charity.paymentInfo.bankDetails.bankName}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Donation Options</Text>
            
            {charity.categories.includes('funds') && (
              <TouchableOpacity 
                style={styles.donationOption}
                onPress={() => handleDonate('funds')}
              >
                <View style={styles.donationOptionContent}>
                  <Heart size={20} color={colors.primary} />
                  <View style={styles.donationOptionTextContainer}>
                    <Text style={styles.donationOptionTitle}>Donate Funds</Text>
                    <Text style={styles.donationOptionDescription}>
                      Support with financial contribution
                    </Text>
                  </View>
                </View>
                <ArrowRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
            
            {charity.categories.includes('food') && (
              <TouchableOpacity 
                style={styles.donationOption}
                onPress={() => handleDonate('food')}
              >
                <View style={styles.donationOptionContent}>
                  <Text style={styles.donationOptionIcon}>🍲</Text>
                  <View style={styles.donationOptionTextContainer}>
                    <Text style={styles.donationOptionTitle}>Donate Food</Text>
                    <Text style={styles.donationOptionDescription}>
                      Provide meals to those in need
                    </Text>
                  </View>
                </View>
                <ArrowRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
            
            {charity.categories.includes('clothes') && (
              <TouchableOpacity 
                style={styles.donationOption}
                onPress={() => handleDonate('clothes')}
              >
                <View style={styles.donationOptionContent}>
                  <Text style={styles.donationOptionIcon}>👕</Text>
                  <View style={styles.donationOptionTextContainer}>
                    <Text style={styles.donationOptionTitle}>Donate Clothes</Text>
                    <Text style={styles.donationOptionDescription}>
                      Share clothing with those less fortunate
                    </Text>
                  </View>
                </View>
                <ArrowRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
            
            {charity.categories.includes('blood') && (
              <TouchableOpacity 
                style={styles.donationOption}
                onPress={() => handleDonate('blood')}
              >
                <View style={styles.donationOptionContent}>
                  <Text style={styles.donationOptionIcon}>🩸</Text>
                  <View style={styles.donationOptionTextContainer}>
                    <Text style={styles.donationOptionTitle}>Donate Blood</Text>
                    <Text style={styles.donationOptionDescription}>
                      Save lives with blood donation
                    </Text>
                  </View>
                </View>
                <ArrowRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title="Donate Now" 
          onPress={() => handleDonate(charity.categories[0])}
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
  imageContainer: {
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textLight,
  },
  donationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  donationOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  donationOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  donationOptionTextContainer: {
    flex: 1,
  },
  donationOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  donationOptionDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: colors.textLight,
    marginBottom: 16,
  },
  errorButton: {
    minWidth: 120,
  },
  // Payment Information Styles
  paymentInfoItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentInfoContent: {
    flex: 1,
  },
  paymentInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  paymentInfoValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  qrCodeHelp: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  bankDetailsContainer: {
    backgroundColor: colors.grayLight,
    borderRadius: 8,
    padding: 12,
  },
  bankDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bankDetailLabel: {
    fontSize: 14,
    color: colors.textLight,
    width: 120,
  },
  bankDetailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
});