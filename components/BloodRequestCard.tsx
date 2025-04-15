import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Clock, AlertCircle } from 'lucide-react-native';
import { BloodRequest } from '@/types';
import { colors } from '@/constants/colors';

interface BloodRequestCardProps {
  request: BloodRequest;
  onPress: (request: BloodRequest) => void;
}

export const BloodRequestCard: React.FC<BloodRequestCardProps> = ({ request, onPress }) => {
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
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(request)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.bloodGroupBadge, { backgroundColor: getUrgencyColor() }]}>
          <Text style={styles.bloodGroupText}>{request.bloodGroup}</Text>
        </View>
        
        <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor() }]}>
          <AlertCircle size={14} color={colors.white} />
          <Text style={styles.urgencyText}>
            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Urgency
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.hospital}>{request.hospital}</Text>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.textLight} />
          <Text style={styles.infoText}>{request.location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Clock size={16} color={colors.textLight} />
          <Text style={styles.infoText}>Posted on {formatDate(request.date)}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.contactLabel}>Contact:</Text>
        <Text style={styles.contactNumber}>{request.contactNumber}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bloodGroupBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bloodGroupText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgencyText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 4,
  },
  content: {
    marginBottom: 12,
  },
  hospital: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textLight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  contactNumber: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
});