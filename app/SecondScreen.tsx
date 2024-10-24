import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the type for our stack navigator's parameter list
type RootStackParamList = {
  Home: undefined;
  SecondScreen: undefined;
};

// Define the type for our navigation prop
type SecondScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SecondScreen'>;

// Define props type for SecondScreen
type Props = {
  navigation: SecondScreenNavigationProp;
};

export const SecondScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the second screen</Text>
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
});