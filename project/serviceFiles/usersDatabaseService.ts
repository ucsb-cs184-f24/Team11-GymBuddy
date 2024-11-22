import {
  getFirestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "./firebaseConfig";
import { getAuth } from "firebase/auth";

export const database = getFirestore(app);

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture: string;
  followerCount: number;
  followingCount: number;
  height: number | null;
  weight: number | null;
  gender: string;
  bio: string;
  createdAt: number;
  isPrivate: boolean;
}

interface UpdatedAttributes extends Partial<UserData> {}

// Setters

export const createUserProfile = async (userId: string) => {
  try {
    const defaultUserData = {
      firstName: "New",
      lastName: "User",
      username: `user_${userId.substring(0, 6)}`, // Generate a default username
      email: "",
      profilePicture: "",
      followerCount: 0,
      followingCount: 0,
      height: 0, // Default to 0 if height isn't provided
      weight: 0, // Default to 0 if weight isn't provided
      gender: "Not specified", // Default gender
      bio: "",
      createdAt: new Date().getTime(),
      isPrivate: false, // Default to public profile
    };

    // Merge provided data with default values
    const userRef = doc(database, "users", userId);

    // Add user to Firestore
    await setDoc(userRef, defaultUserData);

    // Add placeholder documents to nested collections
    const nestedCollections = [
      "followers",
      "following",
      "followerRequests",
      "followingRequests",
    ];
    for (const collectionName of nestedCollections) {
      const placeholderRef = doc(
        collection(database, `users/${userId}/${collectionName}`),
        "placeholder",
      );
      await setDoc(placeholderRef, { placeholder: true });
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

// Function to update user attributes
export const updateUserProfile = async (
  userId: string,
  updatedAttributes: UpdatedAttributes,
) => {
  try {
    const userRef = doc(database, "users", userId);

    // Check if user exists before updating
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      console.error("User does not exist!");
      return;
    }

    // Update user attributes
    await updateDoc(userRef, updatedAttributes);
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export const addFollower = async (userId: string, followerId: string) => {
  try {
    const followerDocRef = doc(
      database,
      `users/${userId}/followers/${followerId}`,
    );

    const followerProfileData = await getUserProfile(followerId);
    const followerData = {
      username: followerProfileData?.username,
      profilePicture: followerProfileData?.profilePicture,
    };

    await setDoc(followerDocRef, followerData);
  } catch (error) {
    console.error("Error adding follower: ", error);
  }
};

export const addFollowing = async (userId: string, followingId: string) => {
  try {
    const followingDocRef = doc(
      database,
      `users/${userId}/following/${followingId}`,
    );

    const followingProfileData = await getUserProfile(followingId);
    const followingData = {
      username: followingProfileData?.username,
      profilePicture: followingProfileData?.profilePicture,
    };

    await setDoc(followingDocRef, followingData);
  } catch (error) {
    console.error("Error adding following: ", error);
  }
};

export const addFollowerRequest = async (userId: string, requestId: string) => {
  try {
    const requestDocRef = doc(
      database,
      `users/${userId}/followerRequests/${requestId}`,
    );

    const requestProfileData = await getUserProfile(requestId);
    const requestData = {
      username: requestProfileData?.username,
      profilePicture: requestProfileData?.profilePicture,
    };

    await setDoc(requestDocRef, requestData);
  } catch (error) {
    console.error("Error adding follower request: ", error);
  }
};

export const addFollowingRequest = async (
  userId: string,
  requestId: string,
) => {
  try {
    const requestDocRef = doc(
      database,
      `users/${userId}/followingRequests/${requestId}`,
    );

    const requestProfileData = await getUserProfile(requestId);
    const requestData = {
      username: requestProfileData?.username,
      profilePicture: requestProfileData?.profilePicture,
    };

    await setDoc(requestDocRef, requestData);
  } catch (error) {
    console.error("Error adding following request: ", error);
  }
};

export const removeFollower = async (
  userId: string,
  followerUserId: string,
) => {
  try {
    const followerDocRef = doc(
      database,
      `users/${userId}/followers/${followerUserId}`,
    );
    await deleteDoc(followerDocRef);
  } catch (error) {
    console.error("Error removing follower: ", error);
  }
};

export const removeFollowing = async (
  userId: string,
  followingUserId: string,
) => {
  try {
    const followingDocRef = doc(
      database,
      `users/${userId}/following/${followingUserId}`,
    );
    await deleteDoc(followingDocRef);
  } catch (error) {
    console.error("Error removing following: ", error);
  }
};

export const removeFollowerRequest = async (
  userId: string,
  requestId: string,
) => {
  try {
    const requestDocRef = doc(
      database,
      `users/${userId}/followerRequests/${requestId}`,
    );
    await deleteDoc(requestDocRef);
  } catch (error) {
    console.error("Error removing follower request: ", error);
  }
};

export const removeFollowingRequest = async (
  userId: string,
  requestId: string,
) => {
  try {
    const requestDocRef = doc(
      database,
      `users/${userId}/followingRequests/${requestId}`,
    );
    await deleteDoc(requestDocRef);
  } catch (error) {
    console.error("Error removing following request: ", error);
  }
};

// Getters

export const getAllUsers = async () => {
  try {
    const usersRef = collection(database, "users");
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs.map((doc) => ({
      userId: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (e) {
    console.error("Error fetching all users:", e);
    return [];
  }
};

export const getUserId = async () => {
  try {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;

    if (!uid) {
      throw new Error("User not logged in");
    }

    return uid;
  } catch (e) {
    console.error("Error getting user ID:", e);
    throw e; // Re-throw the error so the caller knows something went wrong.
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(database, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.error("User does not exist");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

export const uidToUsername = async (userId: string) => {
  try {
    const userRef = doc(database, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().username;
    } else {
      console.error("User does not exist");
    }
  } catch (e) {
    console.error("Error getting user name", e);
  }
};

export const getAllFollowers = async (userId: string) => {
  try {
    const followersRef = collection(database, `users/${userId}/followers`);
    const snapshot = await getDocs(followersRef);

    const followers = snapshot.docs
      .filter((doc) => doc.id !== "placeholder") // Exclude the placeholder document
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    return followers;
  } catch (error) {
    console.error("Error fetching followers: ", error);
    return [];
  }
};

export const getAllFollowing = async (userId: string) => {
  try {
    const followingRef = collection(database, `users/${userId}/following`);
    const snapshot = await getDocs(followingRef);

    const following = snapshot.docs
      .filter((doc) => doc.id !== "placeholder") // Exclude the placeholder document
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    return following;
  } catch (error) {
    console.error("Error fetching following: ", error);
    return [];
  }
};

export const getAllFollowerRequests = async (userId: string) => {
  try {
    const followerRequestsRef = collection(
      database,
      `users/${userId}/followerRequests`,
    );
    const snapshot = await getDocs(followerRequestsRef);

    const followerRequests = snapshot.docs
      .filter((doc) => doc.id !== "placeholder") // Exclude the placeholder document
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    return followerRequests;
  } catch (error) {
    console.error("Error fetching follower requests: ", error);
    return [];
  }
};

export const getAllFollowingRequests = async (userId: string) => {
  try {
    const followingRequestsRef = collection(
      database,
      `users/${userId}/followingRequests`,
    );
    const snapshot = await getDocs(followingRequestsRef);

    const followingRequests = snapshot.docs
      .filter((doc) => doc.id !== "placeholder") // Exclude the placeholder document
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    return followingRequests;
  } catch (error) {
    console.error("Error fetching following requests: ", error);
    return [];
  }
};
