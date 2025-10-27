import {LinearGradient} from "expo-linear-gradient";
import {Image, StyleSheet, Text, View} from "react-native";
import React, {useState} from "react";

import Login from "./Login";
import Register from "./Register";

export default function Index(){
    const [showLogin, setShowLogin] = useState(true);

    const changeTab = (showLoginTab) => {
        setShowLogin(showLoginTab);
    };
    return (
        <LinearGradient
            colors={["#6ABBE4", "#EEF8F9"]}
            style={styles.container}
            start={{ x: 0, y: 0 }}   // top
            end={{ x: 0, y: 1 }}     // bottom
        >
            <View style={styles.content}>
                <Image source={require("../../assets/images/logo2.1.png")} style={styles.topLogo}/>
                <Text>WELCOME</Text>
                <View style={styles.container}>
                    {showLogin ? (
                        <Login changeTab={changeTab} />
                    ) : (
                        <Register changeTab={changeTab} />
                    )}
                </View>
                <Image source={require("../../assets/images/logo.png")} style={styles.bottomLogo}/>
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
    },
    topLogo: {
        width: 80,
        height: 80,
        position: "absolute",
        top: 25,
        right: 10,
    },
    bottomLogo: {
        position: "absolute",
        bottom: 10,
        width: "60%",
        height: 170
    },
    text: {
        color: "#333",
        fontSize: 24,
        fontWeight: "bold",
    },
});
