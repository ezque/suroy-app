import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import Home from "./Auth/index";
export default function Index() {


    return (
        <View style={styles.container}>
           <Home />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});
