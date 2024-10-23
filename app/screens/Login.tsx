import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { TextInput } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "react-native";
import { NavigationProp } from '@react-navigation/native';

interface LoginProps {
    navigation: NavigationProp<any>; 
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
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
                <>
                    <Button title="Login" onPress={signIn} />
                    <Button
                        title="Create Account"
                        onPress={() => navigation.navigate('Register')}
                    />
                </>
            )}
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: "center",
        marginBottom: "60%",
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
