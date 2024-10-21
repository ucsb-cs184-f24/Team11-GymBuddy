import {  useRouter, useSegments, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

const Layout = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChange = (user: FirebaseAuthTypes.User | null) => {
    console.log("onAuthStateChange", user);
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChange);
    return subscriber;
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    console.log("user: ", user);
    console.log("inAuthGroup: ", inAuthGroup);

    if (user && inAuthGroup) {
      console.log("first");
      router.replace("/(app)/Home");
    } else if (!user && !inAuthGroup) {
      router.replace("/");
    }
  }, [user, initializing]);

  return (
    <Tabs>
        <Tabs.Screen name="Home" options={{ headerShown: false }} />
        <Tabs.Screen name="Profile" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default Layout;
