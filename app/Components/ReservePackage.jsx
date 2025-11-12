import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ReservePackage = ({ visible, onClose, package: selectedPackage, onReservationCompleted }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    numberOfPeople: 1,
    specialRequests: '',
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    agreeToTerms: false,
  });

  const steps = [
    { id: 1, label: 'Group Details' },
    { id: 2, label: 'Contact Info' },
    { id: 3, label: 'Confirmation' },
  ];

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setCurrentStep(1);
      setFormData({
        numberOfPeople: 1,
        specialRequests: '',
        contactInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
        },
        emergencyContact: {
          name: '',
          phone: '',
          relationship: '',
        },
        agreeToTerms: false,
      });
    }
  }, [visible]);

  const totalAmount = (selectedPackage?.price || 0) * (formData.numberOfPeople || 0);
  
  const availableSlots = Array.from(
    { length: Math.min(selectedPackage?.available_slot || 0, selectedPackage?.capacity || 0) }, 
    (_, i) => i + 1
  );

  const canProceedToStep2 = formData.numberOfPeople > 0;
  
  const canProceedToStep3 = () => {
    const c = formData.contactInfo;
    const e = formData.emergencyContact;
    return c.firstName && c.lastName && c.email && c.phone && e.name && e.phone;
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateContactInfo = (key, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [key]: value }
    }));
  };

  const updateEmergencyContact = (key, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [key]: value }
    }));
  };

  const submitReservation = async () => {
    if (!formData.agreeToTerms) {
      Alert.alert('Error', 'Please agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reservationData = {
        reservationId: 'RES-' + Date.now(),
        package: selectedPackage.title,
        totalAmount: totalAmount,
        numberOfPeople: formData.numberOfPeople,
        contactName: `${formData.contactInfo.firstName} ${formData.contactInfo.lastName}`,
        email: formData.contactInfo.email,
        phone: formData.contactInfo.phone
      };

      console.log('✅ Reservation submitted:', reservationData);
      onReservationCompleted(reservationData);
      
    } catch (error) {
      console.error('Reservation error:', error);
      Alert.alert('Error', 'Failed to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedPackage) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Reserve {selectedPackage?.title}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                currentStep === step.id && styles.stepCircleActive,
                currentStep > step.id && styles.stepCircleCompleted
              ]}>
                <Text style={[
                  styles.stepNumber,
                  (currentStep === step.id || currentStep > step.id) && styles.stepNumberActive
                ]}>
                  {step.id}
                </Text>
              </View>
              <Text style={[
                styles.stepLabel,
                currentStep === step.id && styles.stepLabelActive
              ]}>
                {step.label}
              </Text>
              {index < steps.length - 1 && (
                <View style={[
                  styles.stepConnector,
                  currentStep > step.id && styles.stepConnectorCompleted
                ]} />
              )}
            </View>
          ))}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Step 1: Group Details */}
          {currentStep === 1 && (
            <View style={styles.stepContent}>
              {/* Package Summary */}
              <View style={styles.packageSummary}>
                <Image
                  source={{ uri: selectedPackage?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828' }}
                  style={styles.packageImage}
                />
                <View style={styles.packageInfo}>
                  <Text style={styles.packageTitle}>{selectedPackage?.title}</Text>
                  <Text style={styles.packageDescription}>{selectedPackage?.shortDesc}</Text>
                  <View style={styles.packageMeta}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>💰</Text>
                      <Text style={styles.metaText}>₱{selectedPackage?.price?.toLocaleString()} / person</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>👥</Text>
                      <Text style={styles.metaText}>Capacity: {selectedPackage?.capacity} people</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Group Size */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Number of People *</Text>
                <View style={styles.peopleButtons}>
                  {availableSlots.map((num) => (
                    <TouchableOpacity
                      key={num}
                      onPress={() => updateFormData('numberOfPeople', num)}
                      style={[
                        styles.peopleButton,
                        formData.numberOfPeople === num && styles.peopleButtonActive
                      ]}
                    >
                      <Text style={[
                        styles.peopleButtonText,
                        formData.numberOfPeople === num && styles.peopleButtonTextActive
                      ]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.slotsText}>
                  <Text style={styles.slotsAvailable}>{selectedPackage?.available_slot} slots available</Text>
                </Text>
              </View>

              {/* Special Requests */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Special Requests</Text>
                <TextInput
                  value={formData.specialRequests}
                  onChangeText={(text) => updateFormData('specialRequests', text)}
                  placeholder="Any dietary restrictions, accessibility needs, or special requirements..."
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                />
              </View>

              {/* Total Amount */}
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalAmount}>₱{totalAmount.toLocaleString()}</Text>
              </View>
            </View>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Contact Information</Text>
              
              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>First Name *</Text>
                  <TextInput
                    value={formData.contactInfo.firstName}
                    onChangeText={(text) => updateContactInfo('firstName', text)}
                    placeholder="Enter your first name"
                    style={styles.input}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Last Name *</Text>
                  <TextInput
                    value={formData.contactInfo.lastName}
                    onChangeText={(text) => updateContactInfo('lastName', text)}
                    placeholder="Enter your last name"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email Address *</Text>
                  <TextInput
                    value={formData.contactInfo.email}
                    onChangeText={(text) => updateContactInfo('email', text)}
                    placeholder="your.email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Phone Number *</Text>
                  <TextInput
                    value={formData.contactInfo.phone}
                    onChangeText={(text) => updateContactInfo('phone', text)}
                    placeholder="0912 345 6789"
                    keyboardType="phone-pad"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  value={formData.contactInfo.address}
                  onChangeText={(text) => updateContactInfo('address', text)}
                  placeholder="Your complete address"
                  style={styles.input}
                />
              </View>

              {/* Emergency Contact */}
              <View style={styles.emergencySection}>
                <Text style={styles.emergencyTitle}>Emergency Contact</Text>
                
                <View style={styles.formRow}>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Contact Name *</Text>
                    <TextInput
                      value={formData.emergencyContact.name}
                      onChangeText={(text) => updateEmergencyContact('name', text)}
                      placeholder="Full name of emergency contact"
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Phone Number *</Text>
                    <TextInput
                      value={formData.emergencyContact.phone}
                      onChangeText={(text) => updateEmergencyContact('phone', text)}
                      placeholder="0912 345 6789"
                      keyboardType="phone-pad"
                      style={styles.input}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Relationship</Text>
                  <TextInput
                    value={formData.emergencyContact.relationship}
                    onChangeText={(text) => updateEmergencyContact('relationship', text)}
                    placeholder="e.g., Spouse, Parent, Friend"
                    style={styles.input}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <View style={styles.stepContent}>
              <View style={styles.confirmationHeader}>
                <Text style={styles.confirmationIcon}>✅</Text>
                <Text style={styles.confirmationTitle}>Confirm Your Reservation</Text>
                <Text style={styles.confirmationSubtitle}>Please review your reservation details before confirming</Text>
              </View>

              <View style={styles.confirmationDetails}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Package Details</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Package:</Text>
                    <Text style={styles.detailValue}>{selectedPackage?.title}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailValue}>{selectedPackage?.shortDesc}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Group Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Number of People:</Text>
                    <Text style={styles.detailValue}>{formData.numberOfPeople} persons</Text>
                  </View>
                  {formData.specialRequests && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Special Requests:</Text>
                      <Text style={styles.detailValue}>{formData.specialRequests}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Contact Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{formData.contactInfo.firstName} {formData.contactInfo.lastName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{formData.contactInfo.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{formData.contactInfo.phone}</Text>
                  </View>
                  {formData.contactInfo.address && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Address:</Text>
                      <Text style={styles.detailValue}>{formData.contactInfo.address}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Emergency Contact</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{formData.emergencyContact.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{formData.emergencyContact.phone}</Text>
                  </View>
                  {formData.emergencyContact.relationship && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Relationship:</Text>
                      <Text style={styles.detailValue}>{formData.emergencyContact.relationship}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.totalConfirmation}>
                  <Text style={styles.totalConfirmationLabel}>Total Amount:</Text>
                  <Text style={styles.totalConfirmationAmount}>₱{totalAmount.toLocaleString()}</Text>
                </View>
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsSection}>
                <TouchableOpacity
                  onPress={() => updateFormData('agreeToTerms', !formData.agreeToTerms)}
                  style={styles.termsCheckbox}
                >
                  <View style={[
                    styles.checkbox,
                    formData.agreeToTerms && styles.checkboxChecked
                  ]}>
                    {formData.agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
                    <Text style={styles.termsLink}>Cancellation Policy</Text> *
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          {currentStep === 1 ? (
            <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={prevStep} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>← Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={currentStep === 3 ? submitReservation : nextStep}
            disabled={
              (currentStep === 1 && !canProceedToStep2) ||
              (currentStep === 2 && !canProceedToStep3()) ||
              (currentStep === 3 && (!formData.agreeToTerms || isSubmitting))
            }
            style={[
              styles.primaryButton,
              ((currentStep === 1 && !canProceedToStep2) ||
               (currentStep === 2 && !canProceedToStep3()) ||
               (currentStep === 3 && (!formData.agreeToTerms || isSubmitting))) && 
              styles.primaryButtonDisabled
            ]}
          >
            {isSubmitting && (
              <ActivityIndicator size="small" color="white" style={styles.loader} />
            )}
            <Text style={styles.primaryButtonText}>
              {currentStep === 3 
                ? (isSubmitting ? 'Processing...' : 'Confirm Reservation')
                : `Continue to ${steps[currentStep]?.label} →`
              }
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#6366f1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  stepCircleActive: {
    backgroundColor: '#3b82f6',
  },
  stepCircleCompleted: {
    backgroundColor: '#10b981',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    color: '#64748b',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  stepConnector: {
    position: 'absolute',
    top: 16,
    left: '60%',
    right: '-40%',
    height: 2,
    backgroundColor: '#d1d5db',
    zIndex: 0,
  },
  stepConnectorCompleted: {
    backgroundColor: '#10b981',
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  packageSummary: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  packageImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  packageInfo: {
    flex: 1,
    marginLeft: 16,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  packageMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  peopleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  peopleButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    minWidth: 50,
  },
  peopleButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f6',
  },
  peopleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#374151',
  },
  peopleButtonTextActive: {
    color: 'white',
  },
  slotsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  slotsAvailable: {
    color: '#059669',
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  totalSection: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 24,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  formGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    backgroundColor: 'white',
  },
  emergencySection: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  confirmationIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  confirmationDetails: {
    gap: 24,
  },
  detailSection: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  totalConfirmation: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalConfirmationLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  totalConfirmationAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  termsSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  termsText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    minWidth: 80,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  primaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 160,
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  loader: {
    marginRight: 8,
  },
});

export default ReservePackage;