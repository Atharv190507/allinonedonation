import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Droplet } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { colors } from '@/constants/colors';
import { useBloodRequestStore } from '@/store/blood-request-store';
import { BloodGroup } from '@/types';

export default function CreateBloodRequestScreen() {
  const router = useRouter();
  const { addRequest, isLoading } = useBloodRequestStore();
  
  const [hospital, setHospital] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  
  const [formErrors, setFormErrors] = useState({
    hospital: '',
    location: '',
    contactNumber: '',
    bloodGroup: '',
  });
  
  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      hospital: '',
      location: '',
      contactNumber: '',
      bloodGroup: '',
    };
    
    if (!hospital) {
      errors.hospital = 'Hospital name is required';
      isValid = false;
    }
    
    if (!location) {
      errors.location = 'Location is required';
      isValid = false;
    }
    
    if (!contactNumber) {
      errors.contactNumber = 'Contact number is required';
      isValid = false;
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(contactNumber)) {
      errors.contactNumber = 'Please use format: (555) 555-5555';
      isValid = false;
    }
    
    if (!bloodGroup) {
      errors.bloodGroup = 'Blood group is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await addRequest({
          bloodGroup: bloodGroup as BloodGroup,
          hospital,
          location,
          contactNumber,
          urgency,
        });
        
        router.replace('/(tabs)/blood');
      } catch (error) {
        console.error('Error creating blood request:', error);
      }
    }
  };
  
  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length <= 3) {
      return cleaned.length ? `(${cleaned}` : '';
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Blood Request</Text>
          <Text style={styles.subtitle}>
            Fill in the details to create a new blood donation request
          </Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label="Hospital Name"
            placeholder="Enter hospital name"
            value={hospital}
            onChangeText={setHospital}
            error={formErrors.hospital}
          />
          
          <Input
            label="Location"
            placeholder="Enter hospital location"
            value={location}
            onChangeText={setLocation}
            error={formErrors.location}
          />
          
          <Input
            label="Contact Number"
            placeholder="(555) 555-5555"
            value={contactNumber}
            onChangeText={(text) => setContactNumber(formatPhoneNumber(text))}
            keyboardType="phone-pad"
            error={formErrors.contactNumber}
          />
          
          <Text style={styles.label}>Blood Group Needed</Text>
          
          <View style={styles.bloodGroupContainer}>
            {bloodGroups.map((group) => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.bloodGroupItem,
                  bloodGroup === group ? styles.bloodGroupItemSelected : null
                ]}
                onPress={() => setBloodGroup(group)}
              >
                <Droplet 
                  size={16} 
                  color={bloodGroup === group ? colors.white : colors.textLight} 
                />
                <Text 
                  style={[
                    styles.bloodGroupText,
                    bloodGroup === group ? styles.bloodGroupTextSelected : null
                  ]}
                >
                  {group}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {formErrors.bloodGroup ? (
            <Text style={styles.errorText}>{formErrors.bloodGroup}</Text>
          ) : null}
          
          <Text style={styles.label}>Urgency Level</Text>
          
          <View style={styles.urgencyContainer}>
            <TouchableOpacity
              style={[
                styles.urgencyItem,
                urgency === 'low' ? styles.urgencyItemSelected : null,
                { backgroundColor: urgency === 'low' ? colors.success : colors.white }
              ]}
              onPress={() => setUrgency('low')}
            >
              <Text 
                style={[
                  styles.urgencyText,
                  urgency === 'low' ? styles.urgencyTextSelected : null
                ]}
              >
                Low
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.urgencyItem,
                urgency === 'medium' ? styles.urgencyItemSelected : null,
                { backgroundColor: urgency === 'medium' ? colors.warning : colors.white }
              ]}
              onPress={() => setUrgency('medium')}
            >
              <Text 
                style={[
                  styles.urgencyText,
                  urgency === 'medium' ? styles.urgencyTextSelected : null
                ]}
              >
                Medium
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.urgencyItem,
                urgency === 'high' ? styles.urgencyItemSelected : null,
                { backgroundColor: urgency === 'high' ? colors.error : colors.white }
              ]}
              onPress={() => setUrgency('high')}
            >
              <Text 
                style={[
                  styles.urgencyText,
                  urgency === 'high' ? styles.urgencyTextSelected : null
                ]}
              >
                High
              </Text>
            </TouchableOpacity>
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
          title="Create Request" 
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
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
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  bloodGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  bloodGroupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 8,
    marginBottom: 8,
  },
  bloodGroupItemSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  bloodGroupText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
  },
  bloodGroupTextSelected: {
    color: colors.white,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  urgencyContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  urgencyItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 8,
    alignItems: 'center',
  },
  urgencyItemSelected: {
    borderColor: 'transparent',
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  urgencyTextSelected: {
    color: colors.white,
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