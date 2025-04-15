import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, Clock, AlertTriangle, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface KYCStatusBadgeProps {
  status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  size?: 'small' | 'medium' | 'large';
}

export const KYCStatusBadge: React.FC<KYCStatusBadgeProps> = ({ 
  status, 
  size = 'medium' 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'rejected':
        return colors.error;
      case 'not_submitted':
      default:
        return colors.textLight;
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <Check size={getIconSize()} color={colors.white} />;
      case 'pending':
        return <Clock size={getIconSize()} color={colors.white} />;
      case 'rejected':
        return <AlertTriangle size={getIconSize()} color={colors.white} />;
      case 'not_submitted':
      default:
        return <Shield size={getIconSize()} color={colors.white} />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'verified':
        return 'KYC Verified';
      case 'pending':
        return 'KYC Pending';
      case 'rejected':
        return 'KYC Rejected';
      case 'not_submitted':
      default:
        return 'KYC Required';
    }
  };
  
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 20;
      case 'medium':
      default:
        return 16;
    }
  };
  
  const getContainerStyle = () => {
    switch (size) {
      case 'small':
        return styles.containerSmall;
      case 'large':
        return styles.containerLarge;
      case 'medium':
      default:
        return styles.containerMedium;
    }
  };
  
  const getTextStyle = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'large':
        return styles.textLarge;
      case 'medium':
      default:
        return styles.textMedium;
    }
  };
  
  return (
    <View style={[styles.container, getContainerStyle(), { backgroundColor: getStatusColor() }]}>
      {getStatusIcon()}
      <Text style={[styles.text, getTextStyle()]}>{getStatusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  containerSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  containerMedium: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  containerLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  text: {
    color: colors.white,
    fontWeight: '500',
    marginLeft: 4,
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 12,
  },
  textLarge: {
    fontSize: 14,
  },
});