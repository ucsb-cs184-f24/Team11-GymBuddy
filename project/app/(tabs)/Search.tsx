import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserProfile, getUserId, uidToUsername, getAllUsersRecentWorkouts } from "@/serviceFiles/databaseService";

interface User {
  userId: string;
  username: string;
  fullName: string;
  profilePic: string;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  // Fetch all users from the database using databaseService
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const workouts = await getAllUsersRecentWorkouts(); // Retrieves recent workouts, including usernames
        const uniqueUsers = new Map<string, User>();

        // Extract user details from workout logs
        for (const workout of workouts) {
          if (!uniqueUsers.has(workout.userId)) {
            // Use uidToUsername and getUserProfile to fetch user details
            const username = await uidToUsername(workout.userId);
            const profile = await getUserProfile(workout.userId);
            if (profile) {
              uniqueUsers.set(workout.userId, {
                userId: workout.userId,
                username: username || "unknown user", // Fallback to "unknown user" if no username found
                fullName: `${profile.firstName} ${profile.lastName}`,
                profilePic: profile.profilePicture || "https://via.placeholder.com/50", // Fallback for profile pictures
              });
            }
          }
        }

        setUsers(Array.from(uniqueUsers.values())); // Convert map back to an array
        setFilteredData(Array.from(uniqueUsers.values())); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(lowerCaseQuery) ||
        user.fullName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(filtered);
  }, [searchQuery, users]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
      <View style={styles.textContainer}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.fullName}>{item.fullName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          style={styles.input}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId}
        ListEmptyComponent={
          searchQuery.length > 0 ? (
            <Text style={styles.noResultsText}>No users found.</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fullName: {
    fontSize: 14,
    color: "#555",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
    fontSize: 16,
  },
});

export default Search;
