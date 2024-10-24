import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const NavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => router.push("/(app)/Profile/Profile")}>
        <Text>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(app)/Search/Search")}>
        <Text>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(app)/Stats/Stats")}>
        <Text>Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(app)/Workout/Workout")}>
        <Text>Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(app)/Home/page")}>
        <Text>Page</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#eee",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
export default NavBar;