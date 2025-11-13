import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import BASE_URL from "../../apiConfig";

const api_url = `${BASE_URL}/register`;

export default function Register({ onSwitchForm }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone_num, setPhoneNumber] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !firstName || !lastName) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(api_url, {
                email,
                password,
                firstName,
                lastName,
                phone_num,
                gender,
            });

            if (response.data.status === "success") {
                Alert.alert("Success", response.data.message);
                // Optionally switch to login form
                onSwitchForm("login");
            } else {
                Alert.alert("Error", response.data.message);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
            if (error.response?.data?.errors) {
                // Show validation errors
                const messages = Object.values(error.response.data.errors)
                  .flat()
                  .join("\n");
                  Alert.alert("Validation Error", messages);
            } else {
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
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

          <Text style={styles.title}>Register</Text>

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
                  value={phone_num}
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
                      <Picker.Item label="Male" value="male" />
                      <Picker.Item label="Female" value="female" />
                  </Picker>
              </View>
          </View>

          <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
          >
              {loading ? (
                  <ActivityIndicator color="#fff" />
              ) : (
                  <Text style={styles.registerButtonText}>Create Account</Text>
              )}
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
