import React from "react";
import { View, Text, Button } from "react-native";
import auth from "@react-native-firebase/auth";

const Page = () => {
  return (
    <View>
      <Text style={{ paddingTop: 100 }}></Text>
      <Button title="Sign Out" onPress={() => auth().signOut()} />
    </View>
  );
};

export default Page;
