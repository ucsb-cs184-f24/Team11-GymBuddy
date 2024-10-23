import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateCurrentUser, updateProfile } from "firebase/auth";

export const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const signUp = async () => {
        setLoading(true);
        try {
          const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
          await updateProfile(userCredential.user, {
            displayName: name
            });
            Alert.alert("User Created: Check Your Email");
        } catch (error) {
            console.log(error);
            Alert.alert("Failed to Create User");
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={name}
                style={styles.input}
                placeholder="Name"
                autoCapitalize="none"
                onChangeText={(text) => setName(text)}
            />
            <TextInput
                value={email}
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                secureTextEntry={true}
                value={password}
                style={styles.input}
                placeholder="Password"
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Register" onPress={signUp} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: "center",
        marginBottom: "60%"
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
    },
});