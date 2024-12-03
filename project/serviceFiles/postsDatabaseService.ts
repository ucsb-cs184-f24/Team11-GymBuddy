import {
  getFirestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  QuerySnapshot,
  deleteDoc,
} from "firebase/firestore";
import { app } from "./firebaseConfig";
import { uidToUsername } from "./usersDatabaseService";

export const database = getFirestore(app);

export interface WorkoutLog {
  caption: string;
  commentsCount: number;
  createdAt: number;
  image: string;
  likesCount: number;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
    category: string;
  }[]
  userId: string;
  username?: string;

}

export const getAllUsersRecentWorkouts = async (): Promise<WorkoutLog[]> => {
  try {
    const workoutsRef = collection(database, `posts`);
      const snapshot = await getDocs(workoutsRef);
      const workoutLogs: WorkoutLog[] = [];
      for (const doc of snapshot.docs) {
        const data = doc.data();
        let username = "";
          username = await uidToUsername(data.userId);
        if (username == null) {
            console.error("Error getting username - removing associated post");
            await deleteDoc(doc.ref);
        }
        workoutLogs.push({
          caption: data.caption,
          commentsCount: data.commentsCount,
          createdAt: data.createdAt,
          image: data.image,
          likesCount: data.likesCount,
          exercises: data.exercises,
          userId: data.userId,
          username: username
        } as WorkoutLog);
      }
      return workoutLogs;
    } catch (e) {
      console.error("Error getting workouts", e);
    }
  return [];
};
export const getWorkouts = async (userId: string): Promise<WorkoutLog[]> => {
  try {
    const workoutsRef = collection(database, `posts`);
    const snapshot = await getDocs(workoutsRef);
    const workouts = snapshot.docs    //delete later
    //return snapshot.docs  //uncomment later
      .filter(doc => doc.data().userId === userId)
      .map(doc => ({
      caption: doc.data().caption,
      commentsCount: doc.data().commentsCount,
      createdAt: doc.data().createdAt,
      image: doc.data().image,
      likesCount: doc.data().likesCount,
      exercises: (doc.data().exercises || []).map((exercise: any) => ({
        name: exercise.name || "Unnamed Exercise",
        sets: exercise.sets || 0,
        reps: exercise.reps || 0,
        weight: exercise.weight || 0,
        category: exercise.category || "Uncategorized",
      })), // Ensures exercises are mapped correctly
      userId: doc.data().userId,
      } as WorkoutLog));
    console.log("Fetched workouts:", JSON.stringify(workouts, null, 2)); // Debug log delete later
    return workouts; //delete later
  } catch (e) {
    console.error("Error getting workouts", e);
  }
  return [];
};

export const createPost = async (post: WorkoutLog) => {
  try {
    const postsRef = collection(database, "posts");
    await addDoc(postsRef, post);
  } catch (e) {
    console.error("Error creating post", e);
  }
};

export const getPost = async (postId: string) => {
  try {
    const docRef = doc(database, `posts/${postId}`);
    const snapshot = await getDoc(docRef);
    return snapshot.data();
  } catch (e) {
    console.error("Error getting post", e);
  }
};

export const updatePost = async (postId: string, post: any) => {
  try {
    const docRef = doc(database, `posts/${postId}`);
    await setDoc(docRef, post, { merge: true });
  } catch (e) {
    console.error("Error updating post", e);
  }
};
