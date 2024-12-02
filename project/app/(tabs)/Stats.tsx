import React from "react";
import { StyleSheet, Text, SafeAreaView } from "react-native";
import AnalyticCharts from "@/components/Stats/AnalyticCharts";

const Stats = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AnalyticCharts />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECECEC",
  },
});

export default Stats;
