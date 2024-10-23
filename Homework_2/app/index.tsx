import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SignInScreen } from './SignInScreen';
import { HomeScreen } from './HomeScreen';
import { SecondScreen } from './SecondScreen';
import { Register } from './CreateAccountScreen';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import { ActivityIndicator, View } from 'react-native';

type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
  SecondScreen: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        console.log('user', user);
        setUser(user);
      });
  
      return unsubscribe; // Clean up subscription on unmount
    }, []);
  
    const name = user?.displayName || 'Guest';
    const email = user?.email || '';
  

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} name={name} email={email} />}
          </Stack.Screen>
          <Stack.Screen name="SecondScreen" component={SecondScreen} />
        </>
      ) : (
        <>
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={Register} options={{ title: "Create Account" }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
      <NavigationContainer independent={true}>
        <Navigation />
      </NavigationContainer>
  );
}