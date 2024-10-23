import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the type for our stack navigator's parameter list
type RootStackParamList = {
  Home: undefined;
  SecondScreen: undefined;
};

// Define the type for our navigation prop
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Define props type for HomeScreen
type Props = {
  navigation: HomeScreenNavigationProp;
  name: String
  email: String
};

export const HomeScreen: React.FC<Props> = ({ navigation, name, email }) => {

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <Text style={styles.userInfo}>User: {name}</Text>
      <Text style={styles.userInfo}>Email: {email}</Text>
      <Button title="Go to Second Screen" onPress={() => navigation.navigate('SecondScreen')} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 16,
  },
});