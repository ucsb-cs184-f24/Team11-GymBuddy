import React from "react";
import { View, Text, StyleSheet } from "react-native";
import UserInfoEditor from "@/components/Profile/ProfileData";
import AnalyticCharts from "@/components/Profile/AnalyticCharts";

const Stats = () => {
  return (
    <View style={styles.container}>
      <AnalyticCharts />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b5998",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Stats;
