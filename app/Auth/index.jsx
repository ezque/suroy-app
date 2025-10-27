import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Login from "./Login";
import Register from "./Register";

export default function Index() {
  const [showLogin, setShowLogin] = useState(false);
  const [activeForm, setActiveForm] = useState("login");

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const switchForm = (form) => {
    setActiveForm(form);
  };

  return (
    <LinearGradient
      colors={["#6ABBE4", "#EEF8F9"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Bottom logo — stays behind everything */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.bottomLogo}
      />

      <View style={styles.content}>
        {/* Welcome text */}
        <Text style={styles.welcomeText}>WELCOME!</Text>
        <Text style={styles.subText}>Ali na sa Surigao!</Text>

        {/* Show login/register form when button clicked */}
        {showLogin ? (
          <View style={styles.formContainer}>
            {activeForm === "login" ? (
              <Login onSwitchForm={switchForm} />
            ) : (
              <Register onSwitchForm={switchForm} />
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={toggleLogin}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.startBtn} onPress={toggleLogin}>
            <Text style={styles.startBtnText}>Your journey starts here</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 2, // content above logo
  },
  welcomeText: {
    fontSize: 50,
    color: "#fff",
    fontFamily: "Liu Jian Mao Cao",
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Liu Jian Mao Cao",
    marginBottom: 40,
  },
  startBtn: {
    backgroundColor: "#0C6E7E",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  startBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#ffffffd2",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  closeBtn: {
    marginTop: 15,
    alignItems: "center",
  },
  closeBtnText: {
    color: "#0C6E7E",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomLogo: {
    position: "absolute",
    bottom: 10,
    width: "90%",
    height: 300,
    resizeMode: "contain",
    opacity: 20, // subtle background
    zIndex: 0, // stay behind
    pointerEvents: "none", // allow clicks through logo
    alignSelf: "center",
  },
});
