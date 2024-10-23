import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../firebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
    name: string;
    email: string;
}

const List = ({navigation, name, email} : RouterProps) => {
    return (
        <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.boldLargeText}> Welcome {name}! </Text>
            <Text style={{marginBottom: 10}}> Email: {email} </Text>
        <Button onPress = {() => navigation.navigate('Details')} title = "Open details"/>
        <Button onPress = {() => FIREBASE_AUTH.signOut()} title = "Logout"/>
        </View>
    );
};
export default List;


const styles = StyleSheet.create({
    boldLargeText: {
        fontSize: 30, 
        fontWeight: 'bold',
        marginBottom: 30,
    },
});