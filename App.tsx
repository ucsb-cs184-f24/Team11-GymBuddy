import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import List from './app/screens/List';
import Details from './app/screens/Details';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { FIREBASE_AUTH } from './firebaseConfig';
import Register from './app/screens/Register';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout({ name, email }: { name: string; email: string;}) {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name='Home'>
        {(props) => <List {...props} name={name} email={email}/>}
      </InsideStack.Screen>
      <InsideStack.Screen name='Details'>
                {(props) => <Details {...props} name={name} />} 
      </InsideStack.Screen>
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });

    return unsubscribe; // Clean up subscription on unmount
  }, []);

  const name = user?.displayName || 'Guest';
  const email = user?.email || '';


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name='Inside'>
            {(props) => <InsideLayout {...props} name={name} email={email}/>}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='Register' component={Register} options={{ title: "Create Account" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
