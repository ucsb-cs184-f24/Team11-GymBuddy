import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";
import testUserData from './testUsers.json'; // Import initial feed data
import testPersonalData from './testPersonal.json'; // Import new post data

const Home = () => {
  const [posts, setPosts] = useState<{ id: string; uName: string; area: string; exercise: string; sets: number; reps: number; date: string; time: string }[]>([]);
  const [personalPosts, setPersonalPosts] = useState<{ id: string; uName: string; area: string; exercise: string; sets: number; reps: number; date: string; time: string }[]>([]);

  useEffect(() => {
    // Load the initial feed data when the component mounts
    setPosts(testUserData);
    setPersonalPosts(testPersonalData);
  }, []);

  const addNewPost = () => {
    if (personalPosts.length > 0) {
      const newPost = personalPosts[0];
      setPosts(prevPosts => [newPost, ...prevPosts]); // Add new post to the top
      setPersonalPosts(prevPersonalPosts => prevPersonalPosts.slice(1)); // Remove the added post from personalPosts
    } else {
      Alert.alert('No more personal posts available');
    }
  };

  const renderItem = ({ item }: { item: { id: string; uName: string; area: string; exercise: string; sets: number; reps: number; date: string; time: string } }) => (
    <View style={styles.post}>
      <Text style={styles.name}>{item.uName}</Text>
      <Text>{item.area}</Text>
      <Text>{item.exercise}</Text>
      <Text>{`Sets: ${item.sets}, Reps: ${item.reps}`}</Text>
      <Text>{`Date: ${item.date}, Time: ${item.time}`}</Text>
    </View>
  );
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