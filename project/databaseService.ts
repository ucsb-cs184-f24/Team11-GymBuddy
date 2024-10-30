import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from './firebaseConfig';
import { ref, push, get, set } from 'firebase/database';

interface WorkoutLog {
  date: number;
  workouts: string[];
}

export const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  export const getAllUsersRecentWorkouts = async (k: number) => {
    try {
      const usersRef = ref(database, 'users');
      const usersSnapshot = await get(usersRef);
      const users = usersSnapshot.val();
      if (users) {
        const recentWorkouts: { [key: string]: WorkoutLog } = {};
        for (const userId in users) {
          const userWorkoutsRef = ref(database, `users/${userId}/workouts`);
          const snapshot = await get(userWorkoutsRef);
          const workouts = snapshot.val();
          if (workouts) {
            const workoutArray = Object.values(workouts) as WorkoutLog[];
            workoutArray.sort((a, b) => b.date - a.date);
            if (workoutArray.length > 0) {
              recentWorkouts[userId] = workoutArray[0];
            }
          }
        }
        return recentWorkouts;
      }
    } catch (e) {
      console.error('Error getting recent workouts', e);
    }
    return {};
  }

  export const getUserId = async () => {
    const user = await getUserData();
    return user ? user.uid : '';
  }
  //Saves new workout to the database
  export const saveWorkout = async (workout:WorkoutLog, user: string) => {
    try {
      const userWorkoutsRef = ref(database, `users/${user}/workouts`);
      await push(userWorkoutsRef, workout);
    } catch (e) {
      console.error('Error saving workout', e);
    }
  }

//Gets all workouts from the database
export const getWorkouts = async (user: string) => {
  try {
    const userWorkoutsRef = ref(database, `users/${user}/workouts`);
    const snapshot = await get(userWorkoutsRef);
    return snapshot.val();
  } catch (e) {
    console.error('Error getting workouts', e);
  }
}

export const checkUserExists = async () => {
  try {
    const user = await getUserData();
    
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        await push (userRef,
          {
            'profile': {
              'email': user.email,
              //Unix time
              'joined': user.createdAt? user.createdAt : '',
              'Name': 'First',
              'LastName': 'Last',

            },
          });
      }
    }
    return false;
  } catch (e) {
    console.error('Error checking if user exists', e);
  }
}
