import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function Register({ onSwitchForm }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");

  const handleRegister = () => {
    alert(`Registering ${firstName} ${lastName}`);
  };

  return (
    <View style={styles.container}>
      {/* Centered logo */}
      <Image
        source={require("../../assets/images/suroyjennylogo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Register</Text>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Personal Info */}
      <View style={styles.rowGroup}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
          placeholderTextColor="#666"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Last Name"
          placeholderTextColor="#666"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <View style={styles.rowGroup}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Phone Number"
          placeholderTextColor="#666"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <View style={[styles.input, styles.halfInput, styles.pickerWrapper]}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="1" />
            <Picker.Item label="Female" value="2" />
          </Picker>
        </View>
      </View>

      {/* Register button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text style={styles.loginLink} onPress={() => onSwitchForm("login")}>
          Sign in
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
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.8)",
    fontSize: 10,
  },
  rowGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerWrapper: {
    padding: 0,
  },
  picker: {
    height: 40,
    width: "100%",
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#0C6E7E",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#333",
    marginTop: 15,
  },
  loginLink: {
    color: "#f24822",
    fontWeight: "600",
  },
});
0