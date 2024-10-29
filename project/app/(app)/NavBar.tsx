import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const NavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(app)/Profile/Profile")}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(app)/Search/Search")}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(app)/Stats/Stats")}>
        <Text style={styles.buttonText}>Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(app)/Workout/Workout")}>
        <Text style={styles.buttonText}>Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(app)/Home/Home")}>
        <Text style={styles.buttonText}>Page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center", 
    padding: 10,
    backgroundColor: "#eee",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000", 
  },
  buttonText: {
    fontSize: 16,
  },
});

export default NavBar;