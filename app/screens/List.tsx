import {View, Text, Button} from 'react-native';
import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';





/* interface RouterProps {
    navigation: NavigationProp<any, any>;
    route: NavigationProp<any,any>;
} */
const List = ( {route, navigation} /* : RouterProps */) => {
    
    const { email, password } = route.params;

    return (
        <View style = {{flex :1, justifyContent: 'center', alignItems: 'center'}}>
            <Text> {email}</Text>
            <Button onPress={()=> navigation.navigate('details')} title="Open Details"/>
            <Button onPress= {() => FIREBASE_AUTH.signOut()} title = "Logout"/>
        </View>

    );
};
export default List;