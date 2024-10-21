import React from "react";
import { View, Text } from "react-native";
import auth from "@react-native-firebase/auth";

const Page = () => {
  const user = auth().currentUser;

  return (
    <View>
      <Text style={{ paddingTop: 100 }}>Welcome back {user?.email}</Text>
    </View>
  );
};

export default Page;
