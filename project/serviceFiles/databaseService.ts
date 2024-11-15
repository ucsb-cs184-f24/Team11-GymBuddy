import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { app } from './firebaseConfig'
interface WorkoutLog {
  date: number;
  workouts: string[];
  name?: string;
}

export const database = getFirestore(app);

export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@user");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error retrieving user data", e);
  }
};

export const getAllUsersRecentWorkouts = async (k: number) => {
  try {
    const collectionRef = collection(database, "users");
    const snapshot = await getDocs(collectionRef);
    const recentWorkouts: any = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.workouts) {
        const workouts = Object.entries(data.workouts);
        const sortedWorkouts = workouts.sort((a, b) => (b[1] as WorkoutLog).date - (a[1] as WorkoutLog).date);
        for (let i = 0; i < k && i < sortedWorkouts.length; i++) {
          const [id, workout] = sortedWorkouts[i];
          recentWorkouts[id] = workout;
        }
        const profile = data.profile;
        if (profile) {
          recentWorkouts[doc.id] = { name: profile.Name, ...recentWorkouts[doc.id] };
        }
      }
    });
    return recentWorkouts;
  } catch (e) {
    console.error("Error getting recent workouts", e);
  }
  return {};
};

export const getUserId = async () => {
  const user = await getUserData();
  return user ? user.uid : "";
};
//Saves new workout to the database
export const saveWorkout = async (workout: WorkoutLog, user: string) => {
  try {
    const collectionRef = collection(database, `users/${user}/workouts`);
    await addDoc(collectionRef, workout);
  } catch (e) {
    console.error("Error saving workout", e);
  }
};

export const getWorkouts = async (user: string) => {
  try {
    const collectionRef = collection(database, `users/${user}/workouts`);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map((doc) => doc.data());
  } catch (e) {
    console.error("Error getting workouts", e);
  }
};

export const getProfile = async (user: string) => {
  try {
    const docRef = doc(database, `users/${user}/profile/profile`)
    const snapshot = await getDoc(docRef)
    return snapshot.data();
  } catch (e) {
    console.error("Error getting profile", e);
  }
};

export const updateProfile = async (user: string, profile: any) => {
  try {
    const docRef = doc(database, `users/${user}/profile/profile`)
    await setDoc(docRef, profile);
  } catch (e) {
    console.error("Error updating profile", e);
  }
};

export const createProfile = async (
  userId: string,
  email: string,
  name: string
) => {
  try {
    const account = {
      profile: {
        email: email,
        joined: Math.floor(Date.now()),
        Name: name,
        LastName: "",
      },
    };

    const docRef = doc(database, `users/${userId}/profile/profile`);
    await setDoc(docRef, account.profile);
  } catch (e) {
    console.error("Error creating profile", e);
  }
};
