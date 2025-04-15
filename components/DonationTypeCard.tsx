import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, Utensils, Shirt, Droplet } from 'lucide-react-native';
import { DonationType } from '@/types';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface DonationTypeCardProps {
  type: DonationType;
  onPress: (type: DonationType) => void;
}

export const DonationTypeCard: React.FC<DonationTypeCardProps> = ({ type, onPress }) => {
  const getIcon = () => {
    switch (type) {
      case 'food':
        return <Utensils size={32} color={colors.white} />;
      case 'funds':
        return <Heart size={32} color={colors.white} />;
      case 'clothes':
        return <Shirt size={32} color={colors.white} />;
      case 'blood':
        return <Droplet size={32} color={colors.white} />;
    }
  };
  
  const getTitle = () => {
    switch (type) {
      case 'food':
        return 'Food Donation';
      case 'funds':
        return 'Funds Donation';
      case 'clothes':
        return 'Clothes Donation';
      case 'blood':
        return 'Blood Donation';
    }
  };
  
  const getDescription = () => {
    switch (type) {
      case 'food':
        return 'Donate food to those in need';
      case 'funds':
        return 'Support causes with financial aid';
      case 'clothes':
        return 'Share clothes with the less fortunate';
      case 'blood':
        return 'Save lives with blood donation';
    }
  };
  
  const getGradientColors = () => {
    switch (type) {
      case 'food':
        return ['#FF9F43', '#FF7043'];
      case 'funds':
        return ['#4E54C8', '#8F94FB'];
      case 'clothes':
        return ['#11998e', '#38ef7d'];
      case 'blood':
        return ['#FF6B6B', '#FF8E8E'];
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(type)}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.description}>{getDescription()}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    height: 120,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
});