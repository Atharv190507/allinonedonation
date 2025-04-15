import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Utensils, Heart, Shirt, Droplet, Plus, Minus, Check } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { CharityCard } from '@/components/CharityCard';
import { colors } from '@/constants/colors';
import { useCharityStore } from '@/store/charity-store';
import { useAuthStore } from '@/store/auth-store';
import { DonationType, Charity } from '@/types';

export default function DonateScreen() {
  const { type, charityId } = useLocalSearchParams<{ type: DonationType, charityId?: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getCharitiesByCategory, getCharityById } = useCharityStore();
  
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [amount, setAmount] = useState('10');
  const [foodItems, setFoodItems] = useState<string[]>(['Canned Goods', 'Rice']);
  const [clothesItems, setClothesItems] = useState<string[]>(['T-shirts', 'Pants']);
  const [bloodUnits, setBloodUnits] = useState(1);
  const [newItem, setNewItem] = useState('');
  const [useDirectPayment, setUseDirectPayment] = useState(false);
  
  // Get charities that accept this donation type
  const charities = getCharitiesByCategory(type);
  
  useEffect(() => {
    // If charityId is provided, set it as selected
    if (charityId) {
      const charity = getCharityById(charityId);
      if (charity) {
        setSelectedCharity(charity);
      }
    }
  }, [charityId]);
  
  const getTypeIcon = () => {
    switch (type) {
      case 'food':
        return <Utensils size={24} color={colors.white} />;
      case 'funds':
        return <Heart size={24} color={colors.white} />;
      case 'clothes':
        return <Shirt size={24} color={colors.white} />;
      case 'blood':
        return <Droplet size={24} color={colors.white} />;
      default:
        return null;
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'food':
        return '#FF9F43';
      case 'funds':
        return '#4E54C8';
      case 'clothes':
        return '#11998e';
      case 'blood':
        return '#FF6B6B';
      default:
        return colors.primary;
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
      case 'blood':
        return 'Blood Donation';
      default:
        return 'Donation';
    }
  };
  
  const handleCharitySelect = (charity: Charity) => {
    setSelectedCharity(charity);
    // Reset direct payment option when changing charity
    setUseDirectPayment(false);
  };
  
  const handleAddItem = () => {
    if (newItem.trim()) {
      if (type === 'food') {
        setFoodItems([...foodItems, newItem.trim()]);
      } else if (type === 'clothes') {
        setClothesItems([...clothesItems, newItem.trim()]);
      }
      setNewItem('');
    }
  };
  
  const handleRemoveItem = (index: number) => {
    if (type === 'food') {
      setFoodItems(foodItems.filter((_, i) => i !== index));
    } else if (type === 'clothes') {
      setClothesItems(clothesItems.filter((_, i) => i !== index));
    }
  };
  
  const handleIncreaseBloodUnits = () => {
    if (bloodUnits < 5) {
      setBloodUnits(bloodUnits + 1);
    }
  };
  
  const handleDecreaseBloodUnits = () => {
    if (bloodUnits > 1) {
      setBloodUnits(bloodUnits - 1);
    }
  };
  
  const handleContinue = () => {
    if (!selectedCharity) {
      alert('Please select a charity');
      return;
    }
    
    // If using direct payment for funds, go to charity details
    if (type === 'funds' && useDirectPayment) {
      router.push({
        pathname: `/charity/${selectedCharity.id}`,
      });
      return;
    }
    
    if (type === 'funds') {
      router.push({
        pathname: '/payment',
        params: {
          type,
          charityId: selectedCharity.id,
          amount,
        }
      });
    } else if (type === 'food') {
      router.push({
        pathname: '/payment',
        params: {
          type,
          charityId: selectedCharity.id,
          items: JSON.stringify(foodItems),
        }
      });
    } else if (type === 'clothes') {
      router.push({
        pathname: '/payment',
        params: {
          type,
          charityId: selectedCharity.id,
          items: JSON.stringify(clothesItems),
        }
      });
    } else if (type === 'blood') {
      // For blood donation, we might skip payment and go straight to success
      router.push({
        pathname: '/donation-success',
        params: {
          type,
          charityId: selectedCharity.id,
          units: bloodUnits.toString(),
        }
      });
    }
  };
  
  // Check if selected charity has direct payment options
  const hasDirectPaymentOptions = selectedCharity?.paymentInfo && 
    (selectedCharity.paymentInfo.upiId || 
     selectedCharity.paymentInfo.qrCodeImage || 
     selectedCharity.paymentInfo.bankDetails);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { backgroundColor: getTypeColor() }]}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              {getTypeIcon()}
            </View>
            <Text style={styles.headerTitle}>{getTypeTitle()}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          {type === 'funds' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Donation Amount</Text>
              
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              
              <View style={styles.quickAmounts}>
                {['5', '10', '25', '50', '100'].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.quickAmountButton,
                      amount === value ? styles.quickAmountButtonSelected : null
                    ]}
                    onPress={() => setAmount(value)}
                  >
                    <Text 
                      style={[
                        styles.quickAmountText,
                        amount === value ? styles.quickAmountTextSelected : null
                      ]}
                    >
                      ₹{value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          {type === 'food' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Food Items</Text>
              <Text style={styles.sectionSubtitle}>
                Add the food items you would like to donate
              </Text>
              
              <View style={styles.itemsContainer}>
                {foodItems.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemText}>{item}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemoveItem(index)}
                    >
                      <Minus size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.addItemInput}
                  value={newItem}
                  onChangeText={setNewItem}
                  placeholder="Add food item"
                  placeholderTextColor={colors.textLighter}
                />
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleAddItem}
                >
                  <Plus size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {type === 'clothes' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Clothing Items</Text>
              <Text style={styles.sectionSubtitle}>
                Add the clothing items you would like to donate
              </Text>
              
              <View style={styles.itemsContainer}>
                {clothesItems.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemText}>{item}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemoveItem(index)}
                    >
                      <Minus size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.addItemInput}
                  value={newItem}
                  onChangeText={setNewItem}
                  placeholder="Add clothing item"
                  placeholderTextColor={colors.textLighter}
                />
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleAddItem}
                >
                  <Plus size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {type === 'blood' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Blood Donation</Text>
              
              <View style={styles.bloodInfoContainer}>
                <View style={styles.bloodInfoItem}>
                  <Text style={styles.bloodInfoLabel}>Your Blood Type</Text>
                  <Text style={styles.bloodInfoValue}>{user?.bloodGroup || 'Not set'}</Text>
                </View>
                
                <View style={styles.bloodInfoDivider} />
                
                <View style={styles.bloodInfoItem}>
                  <Text style={styles.bloodInfoLabel}>Units to Donate</Text>
                  <View style={styles.bloodUnitsContainer}>
                    <TouchableOpacity 
                      style={styles.bloodUnitButton}
                      onPress={handleDecreaseBloodUnits}
                      disabled={bloodUnits <= 1}
                    >
                      <Minus 
                        size={16} 
                        color={bloodUnits <= 1 ? colors.textLighter : colors.text} 
                      />
                    </TouchableOpacity>
                    
                    <Text style={styles.bloodUnitsText}>{bloodUnits}</Text>
                    
                    <TouchableOpacity 
                      style={styles.bloodUnitButton}
                      onPress={handleIncreaseBloodUnits}
                      disabled={bloodUnits >= 5}
                    >
                      <Plus 
                        size={16} 
                        color={bloodUnits >= 5 ? colors.textLighter : colors.text} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <Text style={styles.bloodNote}>
                Note: One unit is approximately 450-500 ml of blood. Most healthy adults can donate up to 2 units safely.
              </Text>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Charity</Text>
            
            {charities.length > 0 ? (
              charities.map((charity) => (
                <TouchableOpacity 
                  key={charity.id}
                  onPress={() => handleCharitySelect(charity)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.charitySelectContainer,
                    selectedCharity?.id === charity.id ? styles.charitySelectContainerSelected : null
                  ]}>
                    {selectedCharity?.id === charity.id && (
                      <View style={styles.selectedCheckmark}>
                        <Check size={16} color={colors.white} />
                      </View>
                    )}
                    <CharityCard charity={charity} onPress={handleCharitySelect} />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No charities found for {type} donations
                </Text>
              </View>
            )}
          </View>
          
          {/* Direct Payment Option for Funds */}
          {type === 'funds' && selectedCharity && hasDirectPaymentOptions && (
            <View style={styles.section}>
              <View style={styles.directPaymentContainer}>
                <TouchableOpacity 
                  style={styles.directPaymentOption}
                  onPress={() => setUseDirectPayment(!useDirectPayment)}
                >
                  <View style={[
                    styles.directPaymentCheckbox,
                    useDirectPayment ? styles.directPaymentCheckboxSelected : {}
                  ]}>
                    {useDirectPayment && <Check size={16} color={colors.white} />}
                  </View>
                  <View style={styles.directPaymentContent}>
                    <Text style={styles.directPaymentTitle}>Use Direct Payment</Text>
                    <Text style={styles.directPaymentDescription}>
                      Pay directly to the charity using UPI, QR code, or bank transfer
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title={type === 'funds' && useDirectPayment ? "View Payment Options" : "Continue"} 
          onPress={handleContinue}
          disabled={!selectedCharity}
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
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  quickAmountButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  quickAmountTextSelected: {
    color: colors.white,
  },
  itemsContainer: {
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bloodInfoContainer: {
    flexDirection: 'row',
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
  bloodInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  bloodInfoLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  bloodInfoValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
  },
  bloodInfoDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.grayLight,
    marginHorizontal: 16,
  },
  bloodUnitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloodUnitButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodUnitsText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 16,
  },
  bloodNote: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  charitySelectContainer: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  charitySelectContainerSelected: {
    borderColor: colors.primary,
  },
  selectedCheckmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  emptyContainer: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  // Direct Payment Styles
  directPaymentContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  directPaymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directPaymentCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directPaymentCheckboxSelected: {
    backgroundColor: colors.primary,
  },
  directPaymentContent: {
    flex: 1,
  },
  directPaymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  directPaymentDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
});