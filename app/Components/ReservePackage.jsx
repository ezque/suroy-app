import { StyleSheet, Modal, Text, TouchableOpacity, View, ScrollView, Alert, TextInput, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BASE_URL from "../../apiConfig";
const api_config = `${BASE_URL}/add-reservation`;

export default function ReservePackage({ visible, onClose, package: selectedPackage, onReservationCompleted }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        number_of_people: 1,
        full_name: '',
        email: '',
        phone_number: '',
        complete_address: '',
        special_req: '',
        e_full_name: '',
        e_contact: '',
        e_relationship: '',
        agreeToTerms: false
    });

    const steps = [
        { id: 1, label: 'Group Details' },
        { id: 2, label: 'Contact Info' },
        { id: 3, label: 'Confirmation' },
    ];

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.number_of_people || !formData.full_name || !formData.email || !formData.phone_number) {
            Alert.alert("Missing Info", "Please fill all required fields.");
            return;
        }

        if (!formData.agreeToTerms) {
            Alert.alert("Terms & Conditions", "You must agree to the terms and conditions before proceeding.");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                Alert.alert("Authentication Error", "You must be logged in to make a reservation.");
                setIsSubmitting(false);
                return;
            }

            const response = await fetch(api_config, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    package_id: selectedPackage.id,
                    number_of_people: formData.number_of_people,
                    total_amount: totalAmount,
                    full_name: formData.full_name,
                    email: formData.email,
                    phone_number: formData.phone_number,
                    complete_address: formData.complete_address,
                    special_req: formData.special_req,
                    e_full_name: formData.e_full_name,
                    e_contact: formData.e_contact,
                    e_relationship: formData.e_relationship,
                    status: 'pending',
                }),

            });


            const result = await response.json();
            console.log("Response data:", result);
            if (response.ok) {
                Alert.alert("Success", "Your reservation has been submitted!");
                onReservationCompleted();
                onClose();
            } else {
                Alert.alert("Error", result.message || "Something went wrong.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Unable to submit reservation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!selectedPackage) return null;

    const maxSlots = Math.min(selectedPackage.available_slot || 0, 50);
    const availableSlots = Array.from({ length: maxSlots }, (_, i) => i + 1);
    const totalAmount = selectedPackage.price * formData.number_of_people;

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
                        Reserve {selectedPackage.package_name}
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
                                ]}>{step.id}</Text>
                            </View>
                            <Text style={[
                                styles.stepLabel,
                                currentStep === step.id && styles.stepLabelActive
                            ]}>{step.label}</Text>
                            {index < steps.length - 1 && (
                                <View style={[
                                    styles.stepConnector,
                                    currentStep > step.id && styles.stepConnectorCompleted
                                ]} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Content */}
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Step 1: Group Details */}
                    {currentStep === 1 && (
                        <View style={styles.stepContent}>
                            <View style={styles.packageSummary}>
                                <View style={styles.packageInfo}>
                                    <Text style={styles.packageTitle}>{selectedPackage.package_name}</Text>
                                    <Text style={styles.packageDescription}>{selectedPackage.description}</Text>
                                    <View style={styles.packageMeta}>
                                        <View style={styles.metaItem}>
                                            <Text style={styles.metaIcon}>💰</Text>
                                            <Text style={styles.metaText}>₱{selectedPackage.price?.toLocaleString()} / person</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <Text style={styles.metaIcon}>👥</Text>
                                            <Text style={styles.metaText}>Capacity: {selectedPackage.capacity} people</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Number of People *</Text>
                                <View style={styles.peopleButtons}>
                                    {availableSlots.map((num) => (
                                        <TouchableOpacity
                                            key={num}
                                            onPress={() => updateFormData('number_of_people', num)}
                                            style={[
                                                styles.peopleButton,
                                                formData.number_of_people === num && styles.peopleButtonActive
                                            ]}
                                        >
                                            <Text style={[
                                                styles.peopleButtonText,
                                                formData.number_of_people === num && styles.peopleButtonTextActive
                                            ]}>{num}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Text style={styles.slotsText}>
                                    <Text style={styles.slotsAvailable}>{selectedPackage?.available_slot} slots available</Text>
                                </Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Special Requests</Text>
                                <TextInput
                                    value={formData.special_req}
                                    onChangeText={(text) => updateFormData('special_req', text)}
                                    placeholder="Any dietary restrictions, accessibility needs, or special requirements..."
                                    multiline
                                    numberOfLines={4}
                                    style={styles.textArea}
                                />
                            </View>

                            <View style={styles.totalSection}>
                                <Text style={styles.totalLabel}>Total Amount:</Text>
                                <Text style={styles.totalAmount}>₱{totalAmount.toLocaleString()}</Text>
                            </View>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#3b82f6',
                                    paddingVertical: 12,
                                    paddingHorizontal: 24,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    marginTop: 16,
                                }}
                                onPress={() => setCurrentStep(currentStep + 1)}
                            >
                                <Text style={{ color: 'white', fontWeight: '600' }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 2: Contact Info */}
                    {currentStep === 2 && (
                        <View style={styles.stepContent}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#e5e7eb',
                                    paddingVertical: 12,
                                    paddingHorizontal: 24,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    marginBottom: 16,
                                }}
                                onPress={() => setCurrentStep(currentStep - 1)}
                            >
                                <Text style={{ color: '#374151', fontWeight: '600' }}>Previous</Text>
                            </TouchableOpacity>

                            <Text style={styles.stepTitle}>Contact Information</Text>
                            <View style={styles.formRow}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Full Name *</Text>
                                    <TextInput
                                        value={formData.full_name}
                                        onChangeText={(text) => updateFormData('full_name', text)}
                                        placeholder="Full Name"
                                        style={styles.input}
                                    />
                                </View>
                            </View>
                            <View style={styles.formRow}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Email Address *</Text>
                                    <TextInput
                                        value={formData.email}
                                        onChangeText={(text) => updateFormData('email', text)}
                                        placeholder="Email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Phone Number *</Text>
                                    <TextInput
                                        value={formData.phone_number}
                                        onChangeText={(text) => updateFormData('phone_number', text)}
                                        placeholder="Contact Number"
                                        keyboardType="phone-pad"
                                        style={styles.input}
                                    />
                                </View>
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Address</Text>
                                <TextInput
                                    value={formData.complete_address}
                                    onChangeText={(text) => updateFormData('complete_address', text)}
                                    placeholder="Complete address"
                                    style={styles.input}
                                />
                            </View>

                            <View style={styles.emergencySection}>
                                <Text style={styles.emergencyTitle}>Emergency Contact</Text>
                                <View style={styles.formRow}>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Contact Name</Text>
                                        <TextInput
                                            value={formData.e_full_name}
                                            onChangeText={(text) => updateFormData('e_full_name', text)}
                                            placeholder="Full Name"
                                            style={styles.input}
                                        />
                                    </View>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.label}>Phone Number</Text>
                                        <TextInput
                                            value={formData.e_contact}
                                            onChangeText={(text) => updateFormData('e_contact', text)}
                                            placeholder="Phone Number"
                                            keyboardType="phone-pad"
                                            style={styles.input}
                                        />
                                    </View>
                                </View>
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Relationship</Text>
                                    <TextInput
                                        value={formData.e_relationship}
                                        onChangeText={(text) => updateFormData('e_relationship', text)}
                                        placeholder="Relationship"
                                        style={styles.input}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#3b82f6',
                                    paddingVertical: 12,
                                    paddingHorizontal: 24,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    marginTop: 24,
                                }}
                                onPress={() => setCurrentStep(currentStep + 1)}
                            >
                                <Text style={{ color: 'white', fontWeight: '600' }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 3: Confirmation */}
                    {currentStep === 3 && (
                        <View style={styles.stepContent}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#e5e7eb',
                                    paddingVertical: 12,
                                    paddingHorizontal: 24,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    marginBottom: 16,
                                }}
                                onPress={() => setCurrentStep(currentStep - 1)}
                            >
                                <Text style={{ color: '#374151', fontWeight: '600' }}>Previous</Text>
                            </TouchableOpacity>
                            <View style={styles.confirmationHeader}>
                                <Text style={styles.confirmationIcon}>✅</Text>
                                <Text style={styles.confirmationTitle}>Confirm Your Reservation</Text>
                                <Text style={styles.confirmationSubtitle}>Please review your reservation details before confirming</Text>
                            </View>

                            <View style={styles.confirmationDetails}>
                                {/* Package Details */}
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailSectionTitle}>Package Details</Text>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Package:</Text>
                                        <Text style={styles.detailValue}>{selectedPackage.package_name}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Description:</Text>
                                        <Text style={styles.detailValue}>{selectedPackage.description}</Text>
                                    </View>
                                </View>

                                {/* Group Info */}
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailSectionTitle}>Group Information</Text>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Number of People:</Text>
                                        <Text style={styles.detailValue}>{formData.number_of_people} persons</Text>
                                    </View>
                                    {formData.special_req ? (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Special Requests:</Text>
                                            <Text style={styles.detailValue}>{formData.special_req}</Text>
                                        </View>
                                    ) : null}
                                </View>

                                {/* Contact Info */}
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailSectionTitle}>Contact Information</Text>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Name:</Text>
                                        <Text style={styles.detailValue}>{formData.full_name}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Email:</Text>
                                        <Text style={styles.detailValue}>{formData.email}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Phone:</Text>
                                        <Text style={styles.detailValue}>{formData.phone_number}</Text>
                                    </View>
                                    {formData.complete_address ? (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Address:</Text>
                                            <Text style={styles.detailValue}>{formData.complete_address}</Text>
                                        </View>
                                    ) : null}
                                </View>

                                {/* Emergency Contact */}
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailSectionTitle}>Emergency Contact</Text>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Name:</Text>
                                        <Text style={styles.detailValue}>{formData.e_full_name}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Phone:</Text>
                                        <Text style={styles.detailValue}>{formData.e_contact}</Text>
                                    </View>
                                    {formData.e_relationship ? (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Relationship:</Text>
                                            <Text style={styles.detailValue}>{formData.e_relationship}</Text>
                                        </View>
                                    ) : null}
                                </View>

                                {/* Total Amount */}
                                <View style={styles.totalConfirmation}>
                                    <Text style={styles.totalConfirmationLabel}>Total Amount:</Text>
                                    <Text style={styles.totalConfirmationAmount}>₱{totalAmount.toLocaleString()}</Text>
                                </View>
                            </View>

                            {/* Terms */}
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

                            <TouchableOpacity
                                style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
                                <Text style={styles.primaryButtonText}>Confirm Reservation</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#6366f1' },
    headerTitle: { fontSize: 20, fontWeight: '600', color: 'white' },
    closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    progressContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    stepItem: { alignItems: 'center', flex: 1, position: 'relative' },
    stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#d1d5db', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    stepCircleActive: { backgroundColor: '#3b82f6' },
    stepCircleCompleted: { backgroundColor: '#10b981' },
    stepNumber: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    stepNumberActive: { color: 'white' },
    stepLabel: { fontSize: 12, fontWeight: '500', marginTop: 8, color: '#64748b', textAlign: 'center' },
    stepLabelActive: { color: '#3b82f6', fontWeight: '600' },
    stepConnector: { position: 'absolute', top: 16, left: '60%', right: '-40%', height: 2, backgroundColor: '#d1d5db', zIndex: 0 },
    stepConnectorCompleted: { backgroundColor: '#10b981' },
    content: { flex: 1 },
    stepContent: { padding: 20 },
    packageSummary: { flexDirection: 'row', backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 24 },
    packageInfo: { flex: 1, marginLeft: 0 },
    packageTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
    packageDescription: { fontSize: 14, color: '#6b7280', marginBottom: 12, lineHeight: 20 },
    packageMeta: { gap: 8 },
    metaItem: { flexDirection: 'row', alignItems: 'center' },
    metaIcon: { marginRight: 8 },
    metaText: { fontSize: 14, color: '#6b7280' },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
    peopleButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    peopleButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, borderWidth: 2, borderColor: '#d1d5db', backgroundColor: 'white', minWidth: 50 },
    peopleButtonActive: { borderColor: '#3b82f6', backgroundColor: '#3b82f6' },
    peopleButtonText: { fontSize: 14, fontWeight: '600', textAlign: 'center', color: '#374151' },
    peopleButtonTextActive: { color: 'white' },
    slotsText: { fontSize: 12, color: '#6b7280' },
    slotsAvailable: { color: '#059669', fontWeight: '600' },
    textArea: { borderWidth: 2, borderColor: '#d1d5db', borderRadius: 8, padding: 16, fontSize: 14, textAlignVertical: 'top', minHeight: 100 },
    totalSection: { backgroundColor: '#f9fafb', padding: 20, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 16, fontWeight: '600', color: '#374151' },
    totalAmount: { fontSize: 24, fontWeight: 'bold', color: '#059669' },
    stepTitle: { fontSize: 20, fontWeight: '600', color: '#1f2937', marginBottom: 24 },
    formRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
    formGroup: { flex: 1 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    input: { borderWidth: 2, borderColor: '#d1d5db', borderRadius: 8, padding: 16, fontSize: 14, backgroundColor: 'white' },
    emergencySection: { backgroundColor: '#f9fafb', padding: 20, borderRadius: 8, marginTop: 8 },
    emergencyTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 16 },
    confirmationHeader: { alignItems: 'center', marginBottom: 32 },
    confirmationIcon: { fontSize: 48, marginBottom: 16 },
    confirmationTitle: { fontSize: 24, fontWeight: '600', color: '#1f2937', marginBottom: 8 },
    confirmationSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
    confirmationDetails: { gap: 24 },
    detailSection: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    detailSectionTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 12 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    detailLabel: { fontSize: 14, fontWeight: '500', color: '#6b7280' },
    detailValue: { fontSize: 14, fontWeight: '600', color: '#1f2937', textAlign: 'right', flex: 1, marginLeft: 16 },
    totalConfirmation: { backgroundColor: '#f9fafb', padding: 20, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalConfirmationLabel: { fontSize: 18, fontWeight: '600', color: '#374151' },
    totalConfirmationAmount: { fontSize: 24, fontWeight: 'bold', color: '#059669' },
    termsSection: { marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
    termsCheckbox: { flexDirection: 'row', alignItems: 'flex-start' },
    checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#d1d5db', borderRadius: 4, marginRight: 12, marginTop: 2 },
    checkboxChecked: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
    checkmark: { color: 'white', fontSize: 12, textAlign: 'center', lineHeight: 16 },
    termsText: { fontSize: 14, color: '#374151', flex: 1, lineHeight: 20 },
    termsLink: { color: '#3b82f6', fontWeight: '600' },
    primaryButton: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#3b82f6', borderRadius: 8, flexDirection: 'row', alignItems: 'center', minWidth: 160, justifyContent: 'center', marginTop: 24 },
    primaryButtonDisabled: { backgroundColor: '#9ca3af' },
    primaryButtonText: { fontSize: 14, fontWeight: '600', color: 'white' },
    loader: { marginRight: 8 },
});
