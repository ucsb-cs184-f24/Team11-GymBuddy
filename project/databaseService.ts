import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from './firebaseConfig';

export const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };
  