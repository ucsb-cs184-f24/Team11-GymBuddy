import React from "react";
import { Button, View, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";

const Home = () => {
  const user = auth().currentUser;
  const router = useRouter();

  const logout = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      router.replace("/");
    } catch (e: any) {
      console.log("Logout failed: ", e);
    }
  };
  return (
    <View>
      <Text style={{ paddingTop: 100 }}>Welcome back {user?.email}</Text>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
};

export default Home;
