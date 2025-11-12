// app/Components/FooterNav.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FooterNav = ({ currentPage, onSelectPage }) => {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("authToken");
              await AsyncStorage.removeItem("access_token");
              router.replace("/Login");
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Navigation Buttons */}
      <View style={styles.navSection}>
        <TouchableOpacity
          onPress={() => onSelectPage("userDashboard")}
          style={styles.navItem}
        >
          <Ionicons 
            name={currentPage === "userDashboard" ? "home" : "home-outline"} 
            size={24} 
            color={currentPage === "userDashboard" ? "#00b4db" : "#ffffff"} 
          />
          <Text style={[
            styles.navText,
            currentPage === "userDashboard" && styles.navTextActive
          ]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectPage("explore")}
          style={styles.navItem}
        >
          <Ionicons 
            name={currentPage === "explore" ? "compass" : "compass-outline"} 
            size={24} 
            color={currentPage === "explore" ? "#00b4db" : "#ffffff"} 
          />
          <Text style={[
            styles.navText,
            currentPage === "explore" && styles.navTextActive
          ]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectPage("favorites")}
          style={styles.navItem}
        >
          <Ionicons 
            name={currentPage === "favorites" ? "heart" : "heart-outline"} 
            size={24} 
            color={currentPage === "favorites" ? "#00b4db" : "#ffffff"} 
          />
          <Text style={[
            styles.navText,
            currentPage === "favorites" && styles.navTextActive
          ]}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectPage("profile")}
          style={styles.navItem}
        >
          <Ionicons 
            name={currentPage === "profile" ? "person" : "person-outline"} 
            size={24} 
            color={currentPage === "profile" ? "#00b4db" : "#ffffff"} 
          />
          <Text style={[
            styles.navText,
            currentPage === "profile" && styles.navTextActive
          ]}>Profile</Text>
        </TouchableOpacity>

        {/* Logout Button - Same style as other buttons */}
        <TouchableOpacity onPress={handleLogout} style={styles.navItem}>
          <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
          <Text style={[styles.navText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#007A8C",
    borderTopWidth: 1,
    borderTopColor: "#005a6b",
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === "android" ? 20 : 12,
    marginBottom: Platform.OS === "android" ? 27 : 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    paddingHorizontal: 5,
    minWidth: 60,
  },
  navText: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 4,
    fontWeight: "500",
  },
  navTextActive: {
    color: "#00b4db",
    fontWeight: "600",
  },
  logoutText: {
    color: "#ff6b6b",
  },
});

export default FooterNav;