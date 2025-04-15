import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, AlertCircle, Phone, Calendar } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useBloodRequestStore } from '@/store/blood-request-store';
import { useAuthStore } from '@/store/auth-store';

export default function BloodRequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { requests } = useBloodRequestStore();
  const { user } = useAuthStore();
  
  const request = requests.find(req => req.id === id);
  
  if (!request) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Blood request not found</Text>
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
  
  const getUrgencyColor = () => {
    switch (request.urgency) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.info;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const handleCall = () => {
    Linking.openURL(`tel:${request.contactNumber}`);
  };
  
  const handleDonate = () => {
    router.push('/donate/blood');
  };
  
  const isCompatible = () => {
    if (!user?.bloodGroup) return false;
    
    // Simple blood compatibility check
    if (user.bloodGroup === 'O-') return true; // Universal donor
    if (user.bloodGroup === request.bloodGroup) return true;
    if (user.bloodGroup === 'O+' && request.bloodGroup.includes('+')) return true;
    if (user.bloodGroup === 'A-' && (request.bloodGroup === 'A-' || request.bloodGroup === 'AB-')) return true;
    if (user.bloodGroup === 'A+' && (request.bloodGroup === 'A+' || request.bloodGroup === 'AB+')) return true;
    if (user.bloodGroup === 'B-' && (request.bloodGroup === 'B-' || request.bloodGroup === 'AB-')) return true;
    if (user.bloodGroup === 'B+' && (request.bloodGroup === 'B+' || request.bloodGroup === 'AB+')) return true;
    if (user.bloodGroup === 'AB-' && request.bloodGroup === 'AB-') return true;
    if (user.bloodGroup === 'AB+' && request.bloodGroup === 'AB+') return true;
    
    return false;
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
          <View style={[styles.bloodGroupBadge, { backgroundColor: getUrgencyColor() }]}>
            <Text style={styles.bloodGroupText}>{request.bloodGroup}</Text>
          </View>
          
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor() }]}>
            <AlertCircle size={16} color={colors.white} />
            <Text style={styles.urgencyText}>
              {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Urgency
            </Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.hospitalName}>{request.hospital}</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MapPin size={20} color={colors.textLight} />
              <Text style={styles.infoText}>{request.location}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Calendar size={20} color={colors.textLight} />
              <Text style={styles.infoText}>Posted on {formatDate(request.date)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Phone size={20} color={colors.textLight} />
              <Text style={styles.infoText}>{request.contactNumber}</Text>
            </View>
          </View>
          
          {user?.bloodGroup && (
            <View style={styles.compatibilityCard}>
              <Text style={styles.compatibilityTitle}>Blood Compatibility</Text>
              
              <View style={styles.compatibilityContent}>
                <View style={styles.bloodTypeContainer}>
                  <Text style={styles.bloodTypeLabel}>Your Blood Type</Text>
                  <Text style={styles.bloodTypeValue}>{user.bloodGroup}</Text>
                </View>
                
                <View style={styles.compatibilityResult}>
                  {isCompatible() ? (
                    <>
                      <View style={styles.compatibleBadge}>
                        <Text style={styles.compatibleText}>Compatible</Text>
                      </View>
                      <Text style={styles.compatibilityMessage}>
                        Your blood type is compatible with this request
                      </Text>
                    </>
                  ) : (
                    <>
                      <View style={styles.incompatibleBadge}>
                        <Text style={styles.incompatibleText}>Not Compatible</Text>
                      </View>
                      <Text style={styles.compatibilityMessage}>
                        Your blood type is not compatible with this request
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Blood Donation</Text>
            <Text style={styles.sectionText}>
              Blood donation is a simple process that takes about 10-15 minutes. A single donation can save up to three lives.
            </Text>
            <Text style={styles.sectionText}>
              After donating, you should rest for a few minutes before resuming your normal activities. Drink plenty of fluids and avoid strenuous physical activity for the rest of the day.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title="Call Hospital" 
          onPress={handleCall}
          variant="outline"
          style={styles.callButton}
          textStyle={styles.callButtonText}
        />
        
        <Button 
          title="Donate Blood" 
          onPress={handleDonate}
          disabled={user?.bloodGroup ? !isCompatible() : false}
          style={styles.donateButton}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  bloodGroupBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bloodGroupText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 20,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  urgencyText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  hospitalName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  compatibilityCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compatibilityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  compatibilityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloodTypeContainer: {
    alignItems: 'center',
    marginRight: 24,
  },
  bloodTypeLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  bloodTypeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
  },
  compatibilityResult: {
    flex: 1,
  },
  compatibleBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  compatibleText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 14,
  },
  incompatibleBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  incompatibleText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 14,
  },
  compatibilityMessage: {
    fontSize: 14,
    color: colors.textLight,
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
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textLight,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  callButton: {
    flex: 1,
    marginRight: 12,
  },
  callButtonText: {
    color: colors.primary,
  },
  donateButton: {
    flex: 1,
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
});