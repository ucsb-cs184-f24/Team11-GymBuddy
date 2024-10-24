import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

interface LoginProps {
  navigation: NavigationProp<any>;
}

export const SignInScreen: React.FC<LoginProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
        await signInWithEmailAndPassword(firebase_auth, email, password);
        alert("Logged In");
    } catch (error: any) {
        console.log(error);
        alert("Login Failed: Invalid Email or Password ");
    }
    setLoading(false);
};


return (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
      placeholderTextColor="#888"
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      placeholderTextColor="#888"
    />
    <Button title="Sign In" onPress={signIn} color="#1E90FF" />
    <View style={styles.buttonSpacing}>
      <Button title="Create Account" onPress={() => {navigation.navigate('Create')}} color="#32CD32" />
    </View>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  padding: 16,
  backgroundColor: '#f0f8ff',
},
input: {
  height: 40,
  borderColor: '#1E90FF',
  borderWidth: 1,
  marginBottom: 12,
  paddingHorizontal: 8,
  borderRadius: 5,
},
buttonSpacing: {
  marginTop: 10,
},
});
