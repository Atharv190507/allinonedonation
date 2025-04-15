import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, Clock, X, Utensils, Heart, Shirt, Droplet } from 'lucide-react-native';
import { Donation } from '@/types';
import { colors } from '@/constants/colors';

interface DonationHistoryCardProps {
  donation: Donation;
}

export const DonationHistoryCard: React.FC<DonationHistoryCardProps> = ({ donation }) => {
  const getStatusIcon = () => {
    switch (donation.status) {
      case 'completed':
        return <Check size={16} color={colors.success} />;
      case 'pending':
        return <Clock size={16} color={colors.warning} />;
      case 'cancelled':
        return <X size={16} color={colors.error} />;
    }
  };
  
  const getTypeIcon = () => {
    switch (donation.type) {
      case 'food':
        return <Utensils size={20} color={colors.white} />;
      case 'funds':
        return <Heart size={20} color={colors.white} />;
      case 'clothes':
        return <Shirt size={20} color={colors.white} />;
      case 'blood':
        return <Droplet size={20} color={colors.white} />;
    }
  };
  
  const getTypeColor = () => {
    switch (donation.type) {
      case 'food':
        return '#FF9F43';
      case 'funds':
        return '#4E54C8';
      case 'clothes':
        return '#11998e';
      case 'blood':
        return '#FF6B6B';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getStatusText = () => {
    switch (donation.status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
    }
  };
  
  const getTypeText = () => {
    switch (donation.type) {
      case 'food':
        return 'Food';
      case 'funds':
        return 'Funds';
      case 'clothes':
        return 'Clothes';
      case 'blood':
        return 'Blood';
    }
  };
  
  const getAmountText = () => {
    if (donation.type === 'funds' && donation.amount) {
      return `₹${donation.amount.toFixed(2)}`;
    } else if (donation.type === 'food' || donation.type === 'clothes') {
      return donation.items?.length ? `${donation.items.length} items` : '';
    } else if (donation.type === 'blood' && donation.quantity) {
      return `${donation.quantity} units`;
    }
    return '';
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: getTypeColor() }]}>
        {getTypeIcon()}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.type}>{getTypeText()} Donation</Text>
          <View style={styles.statusContainer}>
            {getStatusIcon()}
            <Text style={[
              styles.status, 
              { 
                color: donation.status === 'completed' ? colors.success : 
                       donation.status === 'pending' ? colors.warning : 
                       colors.error 
              }
            ]}>
              {getStatusText()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.date}>{formatDate(donation.date)}</Text>
        
        {getAmountText() ? (
          <Text style={styles.amount}>{getAmountText()}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
});