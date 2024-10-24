//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';
//import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import List from './app/screens/List';
import Details from './app/screens/Details';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {useState} from 'react';
import {useEffect} from 'react';
import {EmailAuthCredential, onAuthStateChanged, User} from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();


function InsideLayout ( {route, navigation} ) /* {email, password} : {email: string; password: string} */{

  const { email, password } = route.params;

  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name = "my todos"  component ={List} initialParams={{ email, password }}/>
      <InsideStack.Screen name = "details" component ={Details}/>
    </InsideStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() =>{
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });


  }, []);

  const email = user?.email;

  const password = user?.displayName

  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName ='Login'>
        {user ? (
         <Stack.Screen name = "Inside" component={InsideLayout}  initialParams={{ email, password }}/* component={(props) => <List {...props} email={email} password={password} />} options={{headerShown:false}}   initialParams={{ email, password }} *//>
        ) : (
        <Stack.Screen name = "Login" component={Login} options={{headerShown:false}}/>

        )}
      </Stack.Navigator>

    </NavigationContainer>
  );
}


