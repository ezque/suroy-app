// app/User/index.jsx
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import Home from "../Tabs/Home";
import Favorites from "../Tabs/Favorites";
import Explore from "../Tabs/Explore";
import Profile from "../Tabs/Profile";
import ExploreTourAgencies from "../Tabs/ExploreTourAgencies";
import FooterNav from "../Components/FooterNav";
import HeaderNav from "../Components/HeaderNav";
import ReservePackage from "../Components/ReservePackage";

// Mock data for spots
const mockSpots = [
  {
    spot_id: 1,
    spot_name: "Siargao Cloud 9",
    location: "General Luna, Siargao",
    image_url: "https://images.unsplash.com/photo-1597149877677-0c31650b80e9",
    description: "World-renowned surfing spot with perfect waves",
    rating: 4.8,
    reviewCount: 156,
    images: [
      { spot_image: "https://images.unsplash.com/photo-1597149877677-0c31650b80e9" },
      { spot_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4" }
    ],
    reviews_count: 156
  },
  {
    spot_id: 2,
    spot_name: "Enchanted River",
    location: "Hinatuan, Surigao del Sur",
    image_url: "https://images.unsplash.com/photo-1588666309999-953b3a1d6e6a",
    description: "Mysterious deep blue river with crystal clear waters",
    rating: 4.9,
    reviewCount: 203,
    images: [
      { spot_image: "https://images.unsplash.com/photo-1588666309999-953b3a1d6e6a" }
    ],
    reviews_count: 203
  }
];

// Mock saved spots for favorites
const mockSavedSpots = mockSpots.filter(spot => [1, 2].includes(spot.spot_id));

// Mock blog URLs
const mockBlogsURL = [
  'https://travel-surigao-blog.vercel.app/',
  'https://surigao-travel-guide.example.com/latest-posts'
];

export default function Index() {
  const [activePage, setActivePage] = useState("userDashboard");
  const [allSpots] = useState(mockSpots);
  const [savedSpots] = useState(mockSavedSpots);
  const [blogsURL] = useState(mockBlogsURL);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showReservePackage, setShowReservePackage] = useState(false);
  const router = useRouter();

  const renderPage = () => {
    switch (activePage) {
      case "favorites":
        return <Favorites saveSpots={savedSpots} />;
      case "explore":
        if (selectedAgency) {
          return (
            <ExploreTourAgencies 
              agency={selectedAgency}
              onReservePackage={handleReservePackage}
            />
          );
        }
        return (
          <Explore 
            blogsURL={blogsURL}
            onReservePackage={handleReservePackage}
          />
        );
      case "profile":
        return <Profile />;
      case "tourAgencies":
        return <ExploreTourAgencies onReservePackage={handleReservePackage} />;
      case "userDashboard":
      default:
        return (
          <Home 
            allSpots={allSpots}
            onNavigate={handleNavigation}
          />
        );
    }
  };

  const userInformation = {
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  };

  const handleSelectPage = (page) => {
    setActivePage(page);
  };

  const handleSpotPress = (spot) => {
    router.push({
      pathname: "/Tabs/Explore",
      params: { 
        spot: JSON.stringify(spot),
        spotId: spot.spot_id,
        spotName: spot.spot_name,
        agencies: JSON.stringify([]),
        reviews: JSON.stringify([]),
        activePackages: JSON.stringify([])
      }
    });
  };

  const handleAgencyPress = (agency) => {
    console.log("Agency selected:", agency);
    setSelectedAgency(agency);
    setActivePage("explore");
  };

  const handleReservePackage = (pkg) => {
    console.log("🟢 RESERVE PACKAGE CALLED with:", pkg?.title);
    setSelectedPackage(pkg);
    setShowReservePackage(true);
  };

  const handleCloseReservePackage = () => {
    console.log("🔴 Closing reservation modal");
    setShowReservePackage(false);
    setSelectedPackage(null);
  };

  const handleReservationCompleted = (reservationData) => {
    console.log("🟡 Reservation completed:", reservationData);
    setShowReservePackage(false);
    setSelectedPackage(null);
    
    Alert.alert(
      "Reservation Confirmed!",
      `Your reservation for ${reservationData.package} has been submitted successfully!\n\nTotal Amount: ₱${reservationData.totalAmount?.toLocaleString()}\nNumber of People: ${reservationData.numberOfPeople}\nReservation ID: ${reservationData.reservationId}`
    );
  };

  const handleNavigation = (page, data) => {
    console.log("Navigating to:", page, "with data:", data);
    
    switch (page) {
      case "exploreSpots":
        handleSpotPress(data);
        break;
      case "tourAgencies":
        if (data) {
          handleAgencyPress(data);
        } else {
          setSelectedAgency(null);
          setActivePage("explore");
        }
        break;
      case "notifications":
        console.log("Navigate to notifications");
        break;
      case "profile":
        setActivePage("profile");
        break;
      case "favorites":
        setActivePage("favorites");
        break;
      case "explore":
        setSelectedAgency(null);
        setActivePage("explore");
        break;
      default:
        setActivePage(page);
    }
  };

  const handleBackFromAgency = () => {
    setSelectedAgency(null);
    setActivePage("explore");
  };

  return (
    <View style={styles.container}>
      <HeaderNav 
        userInformation={userInformation}
        onSelectPage={handleNavigation}
        showBackButton={selectedAgency !== null}
        onBackPress={handleBackFromAgency}
      />
      
      <View style={styles.pagesContainer}>
        {renderPage()}
      </View>

      <FooterNav
        userRole="user"
        currentPage={activePage}
        onSelectPage={handleSelectPage}
        userInformation={{ user_info: { firstName: "Juan", lastName: "Dela Cruz" } }}
      />

      {/* Reserve Package Modal */}
      <ReservePackage
        visible={showReservePackage}
        onClose={handleCloseReservePackage}
        package={selectedPackage}
        onReservationCompleted={handleReservationCompleted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pagesContainer: {
    flex: 1,
  },
});