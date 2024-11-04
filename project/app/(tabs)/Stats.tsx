import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Stats = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stats Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Stats;
