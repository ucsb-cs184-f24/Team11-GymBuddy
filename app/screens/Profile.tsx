import { getAuth } from 'firebase/auth';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const Profile: React.FC = () => {
   return (
      <View style={styles.container}>
         <Text style={styles.title}>Profile Page</Text>
         <Text style={styles.subtitle}>Welcome to your profile {getAuth().currentUser?.email}!</Text>
         <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
   },
   subtitle: {
      fontSize: 18,
      color: '#666',
   },
});

export default Profile;