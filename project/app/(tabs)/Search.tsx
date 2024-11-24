// Search.tsx
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
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getUserProfile, // Function to fetch user profile by userId
  getAllUsernames,    // Newly implemented function
} from "@/serviceFiles/usersDatabaseService";

interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
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
        const userIds = await getAllUsernames(); // Includes firstName and lastName
        console.log(`Fetched user IDs count: ${userIds.length}`); // Debugging
  
        const userProfiles: User[] = [];
  
        const profilePromises = userIds.map(async (userBasic) => {
          const profile = await getUserProfile(userBasic.userId);
          if (profile) {
            userProfiles.push({
              userId: profile.userId || userBasic.userId, 
              username: profile.username || "Unknown",
              firstName: userBasic.firstName || "",
              lastName: userBasic.lastName || "",
              profilePic: profile.profilePic || "",
            } as User);
          }
        });
  
        await Promise.all(profilePromises);
  
        console.log(`Fetched user profiles count: ${userProfiles.length}`); // Debugging
        setUsers(userProfiles);
        setFilteredData(userProfiles.slice(0, 10));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredData(users.slice(0, 10));
    } else {
      const lowercasedText = text.toLowerCase();
      const filtered = users.filter((user) =>
        (user.username?.toLowerCase() || "").includes(lowercasedText) ||
        (user.firstName?.toLowerCase() || "").includes(lowercasedText) ||
        (user.lastName?.toLowerCase() || "").includes(lowercasedText) ||
        (user.userId?.toLowerCase() || "").includes(lowercasedText)
      );
      setFilteredData(filtered.slice(0, 10));
    }
  };

const renderItem = ({ item }: { item: User }) => (
  <TouchableOpacity style={styles.itemContainer}>
    <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
    <View style={styles.textContainer}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.fullName}>
        {item.firstName} {item.lastName}
      </Text>
    </View>
  </TouchableOpacity>
);


  return (
    <View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder="Search"
      value={searchQuery}
      onChangeText={handleSearch}
    />
    <FlatList
      data={filteredData}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.userId ? item.userId : `unknown-${index}`}
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
    height: 40, // Fixed height
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderRadius: 4,
    textAlignVertical: 'center',
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
  userId: {
    fontSize: 12,
    color: "#888",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
    fontSize: 16,
  },
});

export default Search;