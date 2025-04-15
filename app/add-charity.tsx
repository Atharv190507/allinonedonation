import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, X, Shield, AlertTriangle, Clock, QrCode, CreditCard, Landmark } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { colors } from '@/constants/colors';
import { useCharityStore } from '@/store/charity-store';
import { useAuthStore } from '@/store/auth-store';
import { DonationType, BankDetails } from '@/types';

export default function AddCharityScreen() {
  const router = useRouter();
  const { addCharity, isLoading } = useCharityStore();
  const { user, getKYCStatus } = useAuthStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<DonationType[]>([]);
  const [kycStatus, setKycStatus] = useState(getKYCStatus());
  
  // Payment information states
  const [acceptsFunds, setAcceptsFunds] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    location: '',
    image: '',
    categories: '',
    upiId: '',
    qrCodeImage: '',
    bankDetails: '',
  });
  
  useEffect(() => {
    // Check KYC status when component mounts
    setKycStatus(getKYCStatus());
  }, [user]);
  
  // Update acceptsFunds when categories change
  useEffect(() => {
    if (selectedCategories.includes('funds')) {
      setAcceptsFunds(true);
    } else {
      setAcceptsFunds(false);
      // Clear payment info if funds category is deselected
      setUpiId('');
      setQrCodeImage('');
      setHasBankDetails(false);
      setBankDetails({
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: ''
      });
    }
  }, [selectedCategories]);
  
  const categories: { type: DonationType; label: string; emoji: string }[] = [
    { type: 'food', label: 'Food', emoji: '🍲' },
    { type: 'funds', label: 'Funds', emoji: '💰' },
    { type: 'clothes', label: 'Clothes', emoji: '👕' },
    { type: 'blood', label: 'Blood', emoji: '🩸' },
  ];
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      description: '',
      location: '',
      image: '',
      categories: '',
      upiId: '',
      qrCodeImage: '',
      bankDetails: '',
    };
    
    if (!name.trim()) {
      errors.name = 'Charity name is required';
      isValid = false;
    }
    
    if (!description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    } else if (description.length < 20) {
      errors.description = 'Description should be at least 20 characters';
      isValid = false;
    }
    
    if (!location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }
    
    if (!image) {
      errors.image = 'Please upload an image';
      isValid = false;
    }
    
    if (selectedCategories.length === 0) {
      errors.categories = 'Please select at least one category';
      isValid = false;
    }
    
    // Validate payment information if funds category is selected
    if (selectedCategories.includes('funds')) {
      if (!upiId.trim() && !qrCodeImage && !hasBankDetails) {
        errors.upiId = 'Please provide at least one payment method (UPI, QR code, or bank details)';
        isValid = false;
      }
      
      if (hasBankDetails) {
        if (!bankDetails.accountName.trim() || 
            !bankDetails.accountNumber.trim() || 
            !bankDetails.ifscCode.trim() || 
            !bankDetails.bankName.trim()) {
          errors.bankDetails = 'Please fill in all bank details';
          isValid = false;
        }
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handlePickImage = async (imageType: 'charity' | 'qrCode') => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access your photos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: imageType === 'charity' ? [16, 9] : [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      if (imageType === 'charity') {
        setImage(result.assets[0].uri);
        setFormErrors(prev => ({ ...prev, image: '' }));
      } else {
        setQrCodeImage(result.assets[0].uri);
        setFormErrors(prev => ({ ...prev, qrCodeImage: '' }));
      }
    }
  };
  
  const handleCategoryToggle = (type: DonationType) => {
    if (selectedCategories.includes(type)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== type));
    } else {
      setSelectedCategories([...selectedCategories, type]);
    }
    setFormErrors(prev => ({ ...prev, categories: '' }));
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Prepare payment info object
        const paymentInfo = selectedCategories.includes('funds') ? {
          upiId: upiId.trim() || undefined,
          qrCodeImage: qrCodeImage || undefined,
          bankDetails: hasBankDetails ? bankDetails : undefined
        } : undefined;
        
        await addCharity({
          name,
          description,
          location,
          image,
          categories: selectedCategories,
          paymentInfo
        });
        
        Alert.alert(
          'Success',
          'Your charity has been added successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } catch (error) {
        console.error('Error adding charity:', error);
        Alert.alert('Error', 'Failed to add charity. Please try again.');
      }
    }
  };
  
  const handleStartKYC = () => {
    router.push('/kyc-verification');
  };
  
  // If KYC is not verified, show verification required screen
  if (kycStatus !== 'verified') {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar style="dark" />
        
        <View style={styles.kycRequiredContainer}>
          <View style={[styles.kycIconContainer, 
            kycStatus === 'pending' ? styles.kycPendingIcon : styles.kycRequiredIcon
          ]}>
            {kycStatus === 'pending' ? (
              <Clock size={40} color={colors.warning} />
            ) : (
              <AlertTriangle size={40} color={colors.error} />
            )}
          </View>
          
          <Text style={styles.kycRequiredTitle}>
            {kycStatus === 'pending' ? 'KYC Verification Pending' : 'KYC Verification Required'}
          </Text>
          
          <Text style={styles.kycRequiredText}>
            {kycStatus === 'pending' 
              ? 'Your KYC verification is currently being processed. This usually takes 24-48 hours. You will be able to add a charity once your verification is complete.'
              : 'To add a charity, you need to complete the KYC (Know Your Customer) verification process. This helps us ensure the legitimacy of charities on our platform.'}
          </Text>
          
          {kycStatus === 'pending' ? (
            <View style={styles.kycStatusContainer}>
              <View style={styles.kycStatusItem}>
                <View style={[styles.kycStatusDot, styles.kycStatusCompleted]} />
                <Text style={styles.kycStatusText}>Submitted</Text>
              </View>
              <View style={[styles.kycStatusLine, styles.kycStatusActive]} />
              <View style={styles.kycStatusItem}>
                <View style={[styles.kycStatusDot, styles.kycStatusActive]} />
                <Text style={styles.kycStatusText}>Under Review</Text>
              </View>
              <View style={styles.kycStatusLine} />
              <View style={styles.kycStatusItem}>
                <View style={styles.kycStatusDot} />
                <Text style={styles.kycStatusText}>Verified</Text>
              </View>
            </View>
          ) : (
            <Button 
              title="Start Verification" 
              onPress={handleStartKYC}
              style={styles.startVerificationButton}
            />
          )}
          
          <Button 
            title="Go Back" 
            onPress={() => router.back()}
            variant="outline"
            style={styles.goBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Add Your Charity</Text>
            <Text style={styles.subtitle}>
              Fill in the details to add your charity to our platform
            </Text>
            
            <View style={styles.verifiedBadge}>
              <Shield size={16} color={colors.white} />
              <Text style={styles.verifiedText}>KYC Verified</Text>
            </View>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Charity Name"
              placeholder="Enter charity name"
              value={name}
              onChangeText={setName}
              error={formErrors.name}
            />
            
            <Input
              label="Description"
              placeholder="Describe your charity's mission, goals, impact, and how donations will be used. Provide details about the communities you serve and the problems you're addressing."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              style={styles.textArea}
              error={formErrors.description}
            />
            
            <Input
              label="Location"
              placeholder="City, Country or 'Global'"
              value={location}
              onChangeText={setLocation}
              error={formErrors.location}
            />
            
            <Text style={styles.label}>Charity Image</Text>
            
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: image }} 
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImage('')}
                >
                  <X size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.imageUploadButton}
                onPress={() => handlePickImage('charity')}
              >
                <Camera size={24} color={colors.textLight} />
                <Text style={styles.imageUploadText}>Upload Image</Text>
              </TouchableOpacity>
            )}
            
            {formErrors.image ? (
              <Text style={styles.errorText}>{formErrors.image}</Text>
            ) : null}
            
            <Text style={styles.label}>Categories</Text>
            <Text style={styles.categorySubtitle}>
              Select the types of donations your charity accepts
            </Text>
            
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.type}
                  style={[
                    styles.categoryItem,
                    selectedCategories.includes(category.type) ? styles.categoryItemSelected : null
                  ]}
                  onPress={() => handleCategoryToggle(category.type)}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text 
                    style={[
                      styles.categoryText,
                      selectedCategories.includes(category.type) ? styles.categoryTextSelected : null
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {formErrors.categories ? (
              <Text style={styles.errorText}>{formErrors.categories}</Text>
            ) : null}
            
            {/* Payment Information Section - Only show if Funds category is selected */}
            {acceptsFunds && (
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment Information</Text>
                <Text style={styles.sectionSubtitle}>
                  Provide details for how donors can send funds to your charity
                </Text>
                
                <View style={styles.paymentMethodContainer}>
                  <View style={styles.paymentMethodHeader}>
                    <View style={styles.paymentMethodIcon}>
                      <CreditCard size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.paymentMethodTitle}>UPI ID</Text>
                  </View>
                  
                  <Input
                    placeholder="Enter your UPI ID (e.g., name@upi)"
                    value={upiId}
                    onChangeText={(text) => {
                      setUpiId(text);
                      if (text.trim()) {
                        setFormErrors(prev => ({ ...prev, upiId: '' }));
                      }
                    }}
                  />
                </View>
                
                <View style={styles.paymentMethodContainer}>
                  <View style={styles.paymentMethodHeader}>
                    <View style={styles.paymentMethodIcon}>
                      <QrCode size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.paymentMethodTitle}>QR Code</Text>
                  </View>
                  
                  {qrCodeImage ? (
                    <View style={styles.qrCodePreviewContainer}>
                      <Image 
                        source={{ uri: qrCodeImage }} 
                        style={styles.qrCodePreview}
                        resizeMode="contain"
                      />
                      <TouchableOpacity 
                        style={styles.removeQrCodeButton}
                        onPress={() => setQrCodeImage('')}
                      >
                        <X size={16} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.qrCodeUploadButton}
                      onPress={() => handlePickImage('qrCode')}
                    >
                      <Camera size={20} color={colors.textLight} />
                      <Text style={styles.qrCodeUploadText}>Upload QR Code</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.paymentMethodContainer}>
                  <View style={styles.paymentMethodHeader}>
                    <View style={styles.paymentMethodIcon}>
                      <Landmark size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.paymentMethodTitle}>Bank Details</Text>
                    <Switch
                      value={hasBankDetails}
                      onValueChange={setHasBankDetails}
                      trackColor={{ false: colors.gray, true: colors.primaryLight }}
                      thumbColor={hasBankDetails ? colors.primary : colors.white}
                      style={styles.bankDetailsSwitch}
                    />
                  </View>
                  
                  {hasBankDetails && (
                    <View style={styles.bankDetailsContainer}>
                      <Input
                        label="Account Holder Name"
                        placeholder="Enter account holder name"
                        value={bankDetails.accountName}
                        onChangeText={(text) => setBankDetails({...bankDetails, accountName: text})}
                      />
                      
                      <Input
                        label="Account Number"
                        placeholder="Enter account number"
                        value={bankDetails.accountNumber}
                        onChangeText={(text) => setBankDetails({...bankDetails, accountNumber: text})}
                        keyboardType="numeric"
                      />
                      
                      <Input
                        label="IFSC Code"
                        placeholder="Enter IFSC code"
                        value={bankDetails.ifscCode}
                        onChangeText={(text) => setBankDetails({...bankDetails, ifscCode: text})}
                      />
                      
                      <Input
                        label="Bank Name"
                        placeholder="Enter bank name"
                        value={bankDetails.bankName}
                        onChangeText={(text) => setBankDetails({...bankDetails, bankName: text})}
                      />
                    </View>
                  )}
                </View>
                
                {formErrors.upiId || formErrors.bankDetails ? (
                  <Text style={styles.errorText}>
                    {formErrors.upiId || formErrors.bankDetails}
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button 
            title="Cancel" 
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
          
          <Button 
            title="Add Charity" 
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
    position: 'relative',
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
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 4,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  textArea: {
    height: 220, // Increased height for description box
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  imageUploadButton: {
    height: 160,
    borderWidth: 1,
    borderColor: colors.gray,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  imageUploadText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 8,
  },
  imagePreviewContainer: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 12,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  categoryItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  categoryTextSelected: {
    color: colors.white,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  cancelButton: {
    flex: 1,
    marginRight: 12,
  },
  cancelButtonText: {
    color: colors.text,
  },
  submitButton: {
    flex: 1,
  },
  // KYC Required Styles
  kycRequiredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  kycIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  kycRequiredIcon: {
    backgroundColor: colors.secondaryLight,
  },
  kycPendingIcon: {
    backgroundColor: '#FFF8E1', // Light yellow
  },
  kycRequiredTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  kycRequiredText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  startVerificationButton: {
    width: '100%',
    marginBottom: 16,
  },
  goBackButton: {
    width: '100%',
  },
  kycStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  kycStatusItem: {
    alignItems: 'center',
  },
  kycStatusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.grayLight,
    marginBottom: 8,
  },
  kycStatusActive: {
    backgroundColor: colors.warning,
  },
  kycStatusCompleted: {
    backgroundColor: colors.success,
  },
  kycStatusLine: {
    height: 2,
    flex: 1,
    backgroundColor: colors.grayLight,
  },
  kycStatusText: {
    fontSize: 12,
    color: colors.textLight,
  },
  // Payment Information Styles
  paymentSection: {
    marginTop: 24,
    marginBottom: 16,
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
  paymentMethodContainer: {
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
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentMethodIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  qrCodeUploadButton: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.gray,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  qrCodeUploadText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
  },
  qrCodePreviewContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayLight,
  },
  qrCodePreview: {
    width: 180,
    height: 180,
  },
  removeQrCodeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankDetailsSwitch: {
    marginLeft: 'auto',
  },
  bankDetailsContainer: {
    marginTop: 8,
  },
});