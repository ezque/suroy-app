import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../apiConfig";
import { router } from "expo-router";

const api_url = `${BASE_URL}/login`;

export default function Login({ onSwitchForm, onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(api_url, { email, password });
            await AsyncStorage.setItem("access_token", response.data.access_token);

            Alert.alert("Success", "Login successful!");

            // ✅ Navigate to /user (this loads app/user/index.jsx)
            router.replace("/User");

        } catch (error) {
            console.log(error.response?.data);
            Alert.alert("Login Failed", error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/suroyjennylogo.png")}
                style={styles.logo}
            />
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.registerText}>
                Don’t have an account yet?{" "}
                <Text style={styles.registerLink} onPress={() => onSwitchForm("register")}>
                    Register for free
                </Text>
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        padding: 20,
        borderRadius: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0C6E7E",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        backgroundColor: "rgba(255,255,255,0.8)",
    },
    forgotText: {
        alignSelf: "flex-end",
        color: "#f24822",
        marginBottom: 15,
    },
    loginButton: {
        backgroundColor: "#0C6E7E",
        paddingVertical: 12,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    registerText: {
        fontSize: 14,
        color: "#333",
        marginTop: 15,
    },
    registerLink: {
        color: "#f24822",
        fontWeight: "600",
    },
})
