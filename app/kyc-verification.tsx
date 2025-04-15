import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Calendar, FileText, User, Shield, Upload, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { KYCData } from '@/types';

export default function KYCVerificationScreen() {
  const router = useRouter();
  const { submitKYC, isLoading, user } = useAuthStore();
  
  const [fullName, setFullName] = useState(user?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [idType, setIdType] = useState<KYCData['idType']>('aadhar');
  const [idNumber, setIdNumber] = useState('');
  const [idDocumentUri, setIdDocumentUri] = useState('');
  const [selfieUri, setSelfieUri] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    dateOfBirth: '',
    idNumber: '',
    idDocumentUri: '',
    selfieUri: '',
    address: '',
  });
  
  const idTypes = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'voter_id', label: 'Voter ID' },
    { value: 'driving_license', label: 'Driving License' },
  ];
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      fullName: '',
      dateOfBirth: '',
      idNumber: '',
      idDocumentUri: '',
      selfieUri: '',
      address: '',
    };
    
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }
    
    if (!dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    }
    
    if (!idNumber.trim()) {
      errors.idNumber = 'ID number is required';
      isValid = false;
    } else {
      // Validate ID number format based on type
      if (idType === 'aadhar' && !/^\d{12}$/.test(idNumber.replace(/\s/g, ''))) {
        errors.idNumber = 'Aadhar number must be 12 digits';
        isValid = false;
      } else if (idType === 'pan' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(idNumber.replace(/\s/g, ''))) {
        errors.idNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
        isValid = false;
      }
    }
    
    if (!idDocumentUri) {
      errors.idDocumentUri = 'Please upload your ID document';
      isValid = false;
    }
    
    if (!selfieUri) {
      errors.selfieUri = 'Please upload your selfie';
      isValid = false;
    }
    
    if (!address.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handlePickIdDocument = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access your photos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setIdDocumentUri(result.assets[0].uri);
      setFormErrors(prev => ({ ...prev, idDocumentUri: '' }));
    }
  };
  
  const handleTakeSelfie = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to use your camera');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setSelfieUri(result.assets[0].uri);
      setFormErrors(prev => ({ ...prev, selfieUri: '' }));
    }
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      setDateOfBirth(formattedDate);
      setFormErrors(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await submitKYC({
          fullName,
          dateOfBirth,
          idType,
          idNumber,
          idDocumentUri,
          selfieUri,
          address,
        });
        
        Alert.alert(
          'KYC Submitted',
          'Your KYC verification has been submitted and is pending review.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } catch (error) {
        console.error('KYC submission error:', error);
        Alert.alert('Error', 'Failed to submit KYC verification. Please try again.');
      }
    }
  };
  
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
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
            <View style={styles.iconContainer}>
              <Shield size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>KYC Verification</Text>
            <Text style={styles.subtitle}>
              Complete your identity verification to create a charity
            </Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <Input
                label="Full Name (as per ID)"
                placeholder="Enter your full legal name"
                value={fullName}
                onChangeText={setFullName}
                error={formErrors.fullName}
                leftIcon={<User size={20} color={colors.textLight} />}
              />
              
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color={colors.textLight} />
                <Text style={[
                  styles.datePickerText,
                  !dateOfBirth ? styles.datePickerPlaceholder : null
                ]}>
                  {dateOfBirth ? formatDateForDisplay(dateOfBirth) : 'Select your date of birth'}
                </Text>
              </TouchableOpacity>
              
              {formErrors.dateOfBirth ? (
                <Text style={styles.errorText}>{formErrors.dateOfBirth}</Text>
              ) : null}
              
              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)} // 18 years ago
                />
              )}
              
              <Text style={styles.label}>Government ID Type</Text>
              <View style={styles.idTypeContainer}>
                {idTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.idTypeButton,
                      idType === type.value ? styles.idTypeButtonSelected : null
                    ]}
                    onPress={() => setIdType(type.value as KYCData['idType'])}
                  >
                    <Text style={[
                      styles.idTypeText,
                      idType === type.value ? styles.idTypeTextSelected : null
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Input
                label={`${idTypes.find(t => t.value === idType)?.label} Number`}
                placeholder={`Enter your ${idTypes.find(t => t.value === idType)?.label} number`}
                value={idNumber}
                onChangeText={setIdNumber}
                error={formErrors.idNumber}
                leftIcon={<FileText size={20} color={colors.textLight} />}
              />
              
              <Input
                label="Address (as per ID)"
                placeholder="Enter your full address"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={styles.addressInput}
                error={formErrors.address}
              />
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Document Upload</Text>
              
              <Text style={styles.label}>Upload ID Document</Text>
              <Text style={styles.uploadDescription}>
                Please upload a clear photo of your {idTypes.find(t => t.value === idType)?.label}
              </Text>
              
              {idDocumentUri ? (
                <View style={styles.documentPreviewContainer}>
                  <Image 
                    source={{ uri: idDocumentUri }} 
                    style={styles.documentPreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.removeDocumentButton}
                    onPress={() => setIdDocumentUri('')}
                  >
                    <X size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handlePickIdDocument}
                >
                  <Upload size={24} color={colors.textLight} />
                  <Text style={styles.uploadButtonText}>Upload ID Document</Text>
                </TouchableOpacity>
              )}
              
              {formErrors.idDocumentUri ? (
                <Text style={styles.errorText}>{formErrors.idDocumentUri}</Text>
              ) : null}
              
              <Text style={styles.label}>Take Selfie</Text>
              <Text style={styles.uploadDescription}>
                Please take a clear selfie of your face for verification
              </Text>
              
              {selfieUri ? (
                <View style={styles.selfiePreviewContainer}>
                  <Image 
                    source={{ uri: selfieUri }} 
                    style={styles.selfiePreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.removeSelfieButton}
                    onPress={() => setSelfieUri('')}
                  >
                    <X size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handleTakeSelfie}
                >
                  <Camera size={24} color={colors.textLight} />
                  <Text style={styles.uploadButtonText}>Take Selfie</Text>
                </TouchableOpacity>
              )}
              
              {formErrors.selfieUri ? (
                <Text style={styles.errorText}>{formErrors.selfieUri}</Text>
              ) : null}
            </View>
            
            <View style={styles.privacySection}>
              <Text style={styles.privacyTitle}>Privacy & Security</Text>
              <Text style={styles.privacyText}>
                Your personal information and documents are encrypted and securely stored. 
                We follow strict data protection guidelines and will only use this information 
                for verification purposes.
              </Text>
            </View>
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
            title="Submit Verification" 
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  datePickerText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  datePickerPlaceholder: {
    color: colors.textLighter,
  },
  idTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  idTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 8,
    marginBottom: 8,
  },
  idTypeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  idTypeText: {
    fontSize: 14,
    color: colors.text,
  },
  idTypeTextSelected: {
    color: colors.white,
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  uploadDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  uploadButton: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.gray,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 8,
  },
  documentPreviewContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  documentPreview: {
    width: '100%',
    height: '100%',
  },
  removeDocumentButton: {
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
  selfiePreviewContainer: {
    height: 200,
    width: 200,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 16,
    alignSelf: 'center',
    position: 'relative',
  },
  selfiePreview: {
    width: '100%',
    height: '100%',
  },
  removeSelfieButton: {
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
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  privacySection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
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
});