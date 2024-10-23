// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { AuthProvider, useAuth } from './app/AuthContext';
// import { SignInScreen } from './app/SignInScreen';
// import { HomeScreen } from './app/HomeScreen';
// import { SecondScreen } from './app/SecondScreen';
// import { ActivityIndicator, View } from 'react-native';

// type RootStackParamList = {
//   SignIn: undefined;
//   Home: undefined;
//   SecondScreen: undefined;
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const Navigation = () => {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <Stack.Navigator>
//       {user ? (
//         <>
//           <Stack.Screen name="Home" component={HomeScreen} />
//           <Stack.Screen name="SecondScreen" component={SecondScreen} />
//         </>
//       ) : (
//         <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
//       )}
//     </Stack.Navigator>
//   );
// };

// export default function App() {
//   return (
//     <AuthProvider>
//       <NavigationContainer>
//         <Navigation />
//       </NavigationContainer>
//     </AuthProvider>
//   );
// }