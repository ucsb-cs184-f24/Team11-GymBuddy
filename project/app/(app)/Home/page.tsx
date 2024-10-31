import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, FlatList, Image } from "react-native";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Body, { ExtendedBodyPart, Slug } from "react-native-body-highlighter";
import testUserData from './testUsers.json'; // Import initial feed data
import testPersonalData from './testPersonal.json'; // Import new post data
import exerciseList from './exerciseList.json'; // Import exercise list
const Home = () => {
  // State to hold the posts for the feed
  const [posts, setPosts] = useState<{ id: string; uName: string; area: string; exercise: string; sets: number; reps: number; date: string; time: string; }[]>([]);
  const [personalPosts, setPersonalPosts] = useState<{ id: string; uName: string; area: string; exercise: string; sets: number; reps: number; date: string; time: string; }[]>([]);
  
  useEffect(() => {
    // Clear AsyncStorage
    const clearStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log("AsyncStorage cleared");
      } catch (e) {
        console.error("Failed to clear AsyncStorage", e);
      }
    };

    clearStorage();
    // Load the initial feed data when the component mounts
    const loadPosts = async () => {
      try {
        const savedPosts = await AsyncStorage.getItem('posts');
        const savedPersonalPosts = await AsyncStorage.getItem('personalPosts');
        if (savedPosts !== null) {
          setPosts(JSON.parse(savedPosts));
        } else {
          setPosts(testUserData);
        }
        if (savedPersonalPosts !== null) {
          setPersonalPosts(JSON.parse(savedPersonalPosts));
        } else {
          setPersonalPosts(testPersonalData);
        }
      } catch (error) {
        console.error("Failed to load posts from AsyncStorage", error);
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
  const renderItem = ({ item }: { item: { uName: string; area: string; exercise: string; sets: number; reps: number; date: string; time: string; id: string } }) => {
   
    // Find the exercise in the exerciseList
    const matchedExercise = exerciseList.exercises.find(ex => ex.name.toLowerCase() === item.exercise.toLowerCase());
  
    // Create the ExtendedBodyPart array based on the matched exercise
    const bodyData: ExtendedBodyPart[] = matchedExercise
      ? matchedExercise.muscles.map((muscle: string) => ({ slug: muscle.toLowerCase() as Slug, intensity: 2 }))
      : [];
  
    const side = matchedExercise && (matchedExercise.position === 'front' || matchedExercise.position === 'back') ? matchedExercise.position : undefined;

    return (
      <View style={styles.post}>
        <Text style={styles.name}>{item.uName}</Text>
        <Text>{item.area}</Text>
        <Text>{item.exercise}</Text>
        <Text>{`Sets: ${item.sets}, Reps: ${item.reps}`}</Text>
        <Text>{`Date: ${item.date}, Time: ${item.time}`}</Text>
  
        {/* Body diagram for this specific post */}
        <Body data={bodyData} side={side} />
        </View>
    );
  };
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <Image
          style={styles.profilePic}
          source={{ uri: 'https://example.com/profile-pic.jpg' }}
        />
      </View>

      {/* Feed of Posts */}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.feed}
      />

      {/* New Post Button */}
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
    paddingBottom: 80,
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default Home;
