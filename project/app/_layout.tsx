import { Slot, useRouter, useSegments } from "expo-router";
import React, { useState, useEffect } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

const RootLayout = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChange = (user: FirebaseAuthTypes.User | null) => {
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

    if (user && inAuthGroup) {
      router.replace("/(app)/home/page");
    } else if (!user && !inAuthGroup) {
      router.replace("/");
    }
  }, [user, initializing]);

  return <Slot />;
}

export default RootLayout;