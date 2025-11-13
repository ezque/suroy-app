import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


import BASE_URL from "../../apiConfig";

const api_User_Profile = `${BASE_URL}/user-profile`;
const api_Update_Profile = `${BASE_URL}/update-profile`;
const api_Update_Password = `${BASE_URL}/update-password`;

export default function Profile () {
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone_num: "",
        gender: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const TabButton = ({ tab, children }) => (
        <TouchableOpacity
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
        >
            <Text
                style={[
                    styles.tabButtonText,
                    activeTab === tab && styles.tabButtonTextActive,
                ]}
            >
                {children}
            </Text>
        </TouchableOpacity>
    );

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.get(api_User_Profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const info = response.data.user.user_info;
                setForm({
                    firstName: info?.firstName || "",
                    lastName: info?.lastName || "",
                    phone_num: info?.phone_num || "",
                    gender: info?.gender || "",
                });
            } else {
                Alert.alert("Error", "Failed to load profile data.");
            }
        } catch (error) {
            console.error("Profile fetch error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to fetch user profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const updateProfile = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("access_token");

            const response = await axios.put(api_Update_Profile, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                Alert.alert("Success", "✅ Profile updated successfully!");
                // Optionally update local state with the returned info
                setForm({
                    firstName: response.data.user_info.firstName || "",
                    lastName: response.data.user_info.lastName || "",
                    phone_num: response.data.user_info.phone_num || "",
                    gender: response.data.user_info.gender || "",
                });
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            Alert.alert("Error", "❌ Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async () => {
        if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
            Alert.alert("Error", "❌ New passwords do not match.");
            return;
        }

        setLoadingPassword(true);
        try {
            const token = await AsyncStorage.getItem("access_token");

            const response = await axios.put(api_Update_Password, {
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password,
                new_password_confirmation: passwordForm.new_password_confirmation,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.message) {
                Alert.alert("Success", "✅ Password updated successfully!");
                setPasswordForm({
                    current_password: "",
                    new_password: "",
                    new_password_confirmation: "",
                });
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            const message = error.response?.data?.message || "❌ Failed to update password.";
            Alert.alert("Error", message);
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <Text style={styles.title}>Account Settings</Text>

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    <TabButton tab="profile">Profile</TabButton>
                    <TabButton tab="password">Password</TabButton>
                </View>

                {/* Profile Tab Content */}
                {activeTab === "profile" && (
                    <View style={styles.tabContent}>
                        <View style={styles.formContainer}>
                            <View style={styles.formRow}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>First Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.firstName}
                                        onChangeText={(text) =>
                                            setForm({ ...form, firstName: text })
                                        }
                                        placeholder="Enter first name"
                                    />
                                </View>
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Last Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.lastName}
                                        onChangeText={(text) => setForm({ ...form, lastName: text })}
                                        placeholder="Enter last name"
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Phone Number</Text>
                                <TextInput
                                    style={styles.input}
                                    value={form.phone_num}
                                    onChangeText={(text) => setForm({ ...form, phone_num: text })}
                                    placeholder="Enter phone number"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Gender</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={form.gender}
                                        onValueChange={(value) => setForm({ ...form, gender: value })}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Select Gender" value="" />
                                        <Picker.Item label="Male" value="male" />
                                        <Picker.Item label="Female" value="female" />
                                        <Picker.Item label="Other" value="other" />
                                        <Picker.Item label="Prefer not to say" value="prefer-not-to-say" />
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.submitContainer}>
                                <TouchableOpacity
                                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                                    onPress={updateProfile}
                                    disabled={loading}
                                >
                                    {loading && (
                                        <ActivityIndicator
                                            size="small"
                                            color="#fff"
                                            style={styles.loadingSpinner}
                                        />
                                    )}
                                    <Text style={styles.submitButtonText}>
                                        {loading ? "Updating..." : "Update Profile"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Password Tab Content */}
                {activeTab === "password" && (
                    <View style={styles.tabContent}>
                        <View style={styles.passwordFormContainer}>
                            <Text style={styles.passwordTitle}>Change Password</Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Current Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={passwordForm.current_password}
                                    onChangeText={(text) =>
                                        setPasswordForm({ ...passwordForm, current_password: text })
                                    }
                                    placeholder="Enter current password"
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={passwordForm.new_password}
                                    onChangeText={(text) =>
                                        setPasswordForm({ ...passwordForm, new_password: text })
                                    }
                                    placeholder="Enter new password"
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Confirm New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={passwordForm.new_password_confirmation}
                                    onChangeText={(text) =>
                                        setPasswordForm({
                                            ...passwordForm,
                                            new_password_confirmation: text,
                                        })
                                    }
                                    placeholder="Confirm new password"
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.submitContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        loadingPassword && styles.submitButtonDisabled,
                                    ]}
                                    onPress={updatePassword}
                                    disabled={loadingPassword}
                                >
                                    {loadingPassword && (
                                        <ActivityIndicator
                                            size="small"
                                            color="#fff"
                                            style={styles.loadingSpinner}
                                        />
                                    )}
                                    <Text style={styles.submitButtonText}>
                                        {loadingPassword ? "Updating..." : "Update Password"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0f2f1',
    },
    content: {
        padding: 32,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 32,
        borderBottomWidth: 2,
        borderBottomColor: '#007A8C',
        paddingBottom: 8,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        marginBottom: 32,
    },
    tabButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabButtonActive: {
        borderBottomColor: '#007A8C',
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
    },
    tabButtonTextActive: {
        color: '#007A8C',
        fontWeight: '600',
    },
    tabContent: {
        gap: 24,
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        gap: 24,
    },
    passwordFormContainer: {
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        gap: 20,
    },
    formRow: {
        flexDirection: 'row',
        gap: 24,
    },
    formGroup: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    picker: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    passwordTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 24,
    },
    submitContainer: {
        paddingTop: 16,
        alignItems: 'flex-end',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007A8C',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    loadingSpinner: {
        width: 16,
        height: 16,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});