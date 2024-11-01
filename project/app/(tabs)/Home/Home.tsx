import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";
import testUserData from './testUsers.json'; // Import initial feed data
import testPersonalData from './testPersonal.json'; // Import new post data
import { getAllUsersRecentWorkouts } from "@/databaseService";

const Home = () => {
    // State to hold the posts for the feed
  const [posts, setPosts] = useState<{ id: string; uName: string; area: string; exercise: string; sets: number; reps: number; date: string; time: string }[]>([]);
   // State to hold the personal posts that can be added
  const [personalPosts, setPersonalPosts] = useState<{ id: string; uName: string; area: string; exercise: string; sets: number; reps: number; date: string; time: string }[]>([]);
  useEffect(() => {
    // Load the initial feed data when the component mounts
    const loadPosts = async () => {
      try {
        const recentWorkouts = await getAllUsersRecentWorkouts(1);
        console.log('Recent workouts:', recentWorkouts);
        const posts = Object.entries(recentWorkouts).map(([id, workout]) => ({
          id,
          uName: recentWorkouts[id].name || 'null',
          area: 'N/A',
          exercise: recentWorkouts[id].workouts.toString(),
          sets: 0,
          reps: 0,
          date: new Date(recentWorkouts[id].date * 1000)?.toLocaleDateString() || 'N/A',
          time: 'N/A',
        }));
        setPosts(posts);
      } catch (error) {
        console.error("Failed to load posts", error);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    // Save the posts to AsyncStorage whenever they are updated
    const savePosts = async () => {
      try {
        await AsyncStorage.setItem('posts', JSON.stringify(posts));
        await AsyncStorage.setItem('personalPosts', JSON.stringify(personalPosts));
      } catch (error) {
        console.error("Failed to save posts to AsyncStorage", error);
      }
    };
    savePosts();
  }, [posts, personalPosts]);

    // Function to add a new post from personalPosts to the top of the feed

  const addNewPost = () => {
    if (personalPosts.length > 0) {
      const newPost = personalPosts[0];
      setPosts(prevPosts => [newPost, ...prevPosts]); // Add new post to the top
      setPersonalPosts(prevPersonalPosts => prevPersonalPosts.slice(1)); // Remove the added post from personalPosts
    } else {
      Alert.alert('No more personal posts available');
    }
  };
  // Function to render each item in the FlatList

  const renderItem = ({ item }: { item: { id: string; uName: string; area: string; exercise: string; sets: number; reps: number; date: string; time: string } }) => (
    <View style={styles.post}>
      <Text style={styles.name}>{item.uName}</Text>
      <Text>{item.area}</Text>
      <Text>{item.exercise}</Text>
      <Text>{`Sets: ${item.sets}, Reps: ${item.reps}`}</Text>
      <Text>{`Date: ${item.date}, Time: ${item.time}`}</Text>
    </View>
  );
  //Header section with title and profile picture
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <Image
          style={styles.profilePic}
          source={{ uri: 'https://example.com/profile-pic.jpg' }}
        />
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.feed} // Adjust the content container style
      />
      <View style={styles.buttonContainer}>
        <Button title="New Post" onPress={addNewPost} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  feed: {
    paddingBottom: 80, // Add padding to the bottom to account for the nav bar
  },
  post: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  name: {
    fontWeight: "bold",
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 50,
    padding: 10,
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default Home;