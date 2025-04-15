import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CreditCard, Wallet, Building } from 'lucide-react-native';
import { PaymentMethod } from '@/types';
import { colors } from '@/constants/colors';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  selected: boolean;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  method, 
  selected, 
  onSelect 
}) => {
  const getIcon = () => {
    switch (method) {
      case 'credit_card':
        return <CreditCard size={24} color={selected ? colors.primary : colors.textLight} />;
      case 'paypal':
        return <Wallet size={24} color={selected ? colors.primary : colors.textLight} />;
      case 'bank_transfer':
        return <Building size={24} color={selected ? colors.primary : colors.textLight} />;
    }
  };
  
  const getTitle = () => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'paypal':
        return 'PayPal';
      case 'bank_transfer':
        return 'Bank Transfer';
    }
  };
  
  const getDescription = () => {
    switch (method) {
      case 'credit_card':
        return 'Pay securely with your credit card';
      case 'paypal':
        return 'Fast and secure payment with PayPal';
      case 'bank_transfer':
        return 'Direct transfer from your bank account';
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected ? styles.selectedContainer : null
      ]}
      onPress={() => onSelect(method)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={[
          styles.title,
          selected ? styles.selectedTitle : null
        ]}>
          {getTitle()}
        </Text>
        <Text style={styles.description}>{getDescription()}</Text>
      </View>
      
      <View style={[
        styles.radioButton,
        selected ? styles.radioButtonSelected : null
      ]}>
        {selected && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  selectedContainer: {
    borderColor: colors.primary,
    backgroundColor: colors.grayLight,
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectedTitle: {
    color: colors.primary,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});