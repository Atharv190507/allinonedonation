import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, LogOut, Heart, Clock, User as UserIcon, Droplet, MapPin, Phone, Shield } from 'lucide-react-native';
import { DonationHistoryCard } from '@/components/DonationHistoryCard';
import { Button } from '@/components/Button';
import { KYCStatusBadge } from '@/components/KYCStatusBadge';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useDonationStore } from '@/store/donation-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isAuthenticated, getKYCStatus } = useAuthStore();
  const { donations, getDonationsByUser } = useDonationStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const userDonations = user ? getDonationsByUser(user.id) : [];
  const recentDonations = userDonations.slice(0, 3);
  const kycStatus = getKYCStatus();
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleRegister = () => {
    router.push('/register');
  };
  
  const handleViewAllDonations = () => {
    // Navigate to donation history screen
    // This would be implemented in a real app
    alert('View all donations');
  };
  
  const handleStartKYC = () => {
    router.push('/kyc-verification');
  };
  
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        
        <View style={styles.notLoggedInContainer}>
          <View style={styles.avatarPlaceholder}>
            <UserIcon size={64} color={colors.grayLight} />
          </View>
          
          <Text style={styles.notLoggedInTitle}>Not Logged In</Text>
          <Text style={styles.notLoggedInMessage}>
            Sign in to track your donations and manage your profile
          </Text>
          
          <View style={styles.authButtonsContainer}>
            <Button 
              title="Sign In" 
              onPress={handleLogin}
              variant="primary"
              style={styles.authButton}
              fullWidth
            />
            
            <Button 
              title="Create Account" 
              onPress={handleRegister}
              variant="outline"
              style={styles.authButton}
              textStyle={{ color: colors.primary }}
              fullWidth
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <Settings size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image 
                  source={{ uri: user.avatar }} 
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'guest@example.com'}</Text>
              
              <View style={styles.badgesContainer}>
                <View style={styles.bloodGroupBadge}>
                  <Droplet size={14} color={colors.white} />
                  <Text style={styles.bloodGroupText}>{user?.bloodGroup || 'Unknown'}</Text>
                </View>
                
                <KYCStatusBadge status={kycStatus} size="small" />
              </View>
            </View>
          </View>
          
          <View style={styles.profileDetails}>
            {user?.phone && (
              <View style={styles.detailItem}>
                <Phone size={16} color={colors.textLight} />
                <Text style={styles.detailText}>{user.phone}</Text>
              </View>
            )}
            
            {user?.address && (
              <View style={styles.detailItem}>
                <MapPin size={16} color={colors.textLight} />
                <Text style={styles.detailText}>{user.address}</Text>
              </View>
            )}
          </View>
          
          {kycStatus !== 'verified' && (
            <View style={styles.kycPromptContainer}>
              <View style={styles.kycPromptContent}>
                <Shield size={20} color={kycStatus === 'pending' ? colors.warning : colors.primary} />
                <View style={styles.kycPromptTextContainer}>
                  <Text style={styles.kycPromptTitle}>
                    {kycStatus === 'pending' ? 'KYC Verification Pending' : 'Complete KYC Verification'}
                  </Text>
                  <Text style={styles.kycPromptDescription}>
                    {kycStatus === 'pending' 
                      ? 'Your verification is being processed' 
                      : 'Verify your identity to create charities'}
                  </Text>
                </View>
              </View>
              
              {kycStatus !== 'pending' && (
                <Button 
                  title="Start" 
                  onPress={handleStartKYC}
                  size="small"
                  style={styles.kycStartButton}
                />
              )}
            </View>
          )}
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Heart size={20} color={colors.primary} />
              <Text style={styles.statValue}>{userDonations.length}</Text>
              <Text style={styles.statLabel}>Donations</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Clock size={20} color={colors.primary} />
              <Text style={styles.statValue}>
                {userDonations.filter(d => d.status === 'pending').length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <UserIcon size={20} color={colors.primary} />
              <Text style={styles.statValue}>
                {userDonations.filter(d => d.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Donations</Text>
            
            {userDonations.length > 3 && (
              <TouchableOpacity onPress={handleViewAllDonations}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentDonations.length > 0 ? (
            recentDonations.map((donation) => (
              <DonationHistoryCard key={donation.id} donation={donation} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven&apos;t made any donations yet</Text>
              <Button 
                title="Start Donating" 
                onPress={() => router.push('/(tabs)')}
                variant="primary"
                style={styles.startDonatingButton}
              />
            </View>
          )}
        </View>
        
        <Button 
          title="Log Out" 
          onPress={handleLogout}
          loading={isLoggingOut}
          variant="outline"
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
          fullWidth
        />
      </ScrollView>
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
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodGroupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  bloodGroupText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
    marginLeft: 4,
  },
  profileDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  kycPromptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  kycPromptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  kycPromptTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  kycPromptTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  kycPromptDescription: {
    fontSize: 12,
    color: colors.textLight,
  },
  kycStartButton: {
    minWidth: 80,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.grayLight,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyContainer: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  startDonatingButton: {
    minWidth: 150,
  },
  logoutButton: {
    marginHorizontal: 24,
    marginTop: 24,
    borderColor: colors.secondary,
  },
  logoutButtonText: {
    color: colors.secondary,
  },
  notLoggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  notLoggedInTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  notLoggedInMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
  authButtonsContainer: {
    width: '100%',
  },
  authButton: {
    marginBottom: 16,
  },
});