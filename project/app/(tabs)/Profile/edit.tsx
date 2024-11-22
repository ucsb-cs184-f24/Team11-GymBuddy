import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfile() {
   return (
      <SafeAreaView edges={["top", "left", "right"]}>
         <View style={styles.header}>
            <Ionicons style={styles.backButton}
               name="arrow-back"
               size={50}
               color="black"
               onPress={() => router.push('/(tabs)/Profile')} />
            <Text style={styles.editText}>Edit Profile</Text>
         </View>
         <Image source={require('../../../assets/logo.png')} style={styles.profileImage}/>
         <Button title="Edit Picture" />  
         <View style={styles.container}>
            <View style={styles.row}>
               <Text style={styles.label}>Name</Text>
               <Text style={styles.name}>John Smith</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Username</Text>
               <Text style={styles.username}>john.smith</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Bio</Text>
               <Text style={styles.bio}>Hi my name is John Smith. I go to UCSB and love to work out.</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Height</Text>
               <Text style={styles.height}>6'1"</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Weight</Text>
               <Text style={styles.weight}>185lbs</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Email</Text>
               <Text style={styles.email}>john.smith@gmail.com</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Private</Text>
               <Text style={styles.private}>Yes</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Gender</Text>
               <Text style={styles.gender}>Male</Text>
            </View>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center', 
      fontSize: 20,
      fontWeight: '600',
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
      paddingHorizontal: 10, 
   },
   backButton: {
      flex: 1, 
      alignItems: 'flex-start', 
      justifyContent: 'center', 
   },
   editText: {
      position: 'absolute',  
      left: '40%', 
      fontSize: 20,
      fontWeight: '600',
   },
   profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: 'black',
      alignSelf: 'center',
      marginTop: 20,
   },
   nameBox: {
      flexDirection: 'row',
   },
   leftText: {
      flex: 1,
      justifyContent: 'flex-start'
   },
   container: {
      paddingLeft: 14,
      paddingTop: 4,
      paddingBottom: 4,
      borderColor: '#D3D3D3',
      borderWidth: 0.25
   },
   row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      marginBottom: 4
   },
   label: {
      fontSize: 18,
      paddingRight: 20,
   },
   name: {
      flex: 1,
      fontSize: 18,
      left: 40,
      marginRight: 40,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   username: {
      flex: 1,
      fontSize: 18,
      left: 4,
      marginRight: 4,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   bio: {
      flex: 1,
      fontSize: 18,
      alignSelf: 'flex-end',
      left: 65,
      marginRight: 65,
      maxWidth: 600,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   height: {
      flex: 1,
      fontSize: 18,
      left: 34,
      marginRight: 34,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   weight: {
      flex: 1,
      fontSize: 18,
      left: 32,
      marginRight: 32,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   email: {
      flex: 1,
      fontSize: 18,
      left: 45,
      marginRight: 45,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   private: {
      flex: 1,
      fontSize: 18,
      alignSelf: 'flex-start',
      left: 31,
      marginRight: 31,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   gender: {
      flex: 1,
      fontSize: 18,
      alignSelf: 'flex-start',
      left: 28,
      marginRight: 28,
      paddingBottom: 4,
   },
});