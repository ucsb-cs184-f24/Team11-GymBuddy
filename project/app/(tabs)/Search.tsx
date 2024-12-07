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
  RefreshControl,
  Dimensions,
  SafeAreaView
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import {
  getUserProfile, // Function to fetch user profile by userId
  getAllUsernames,    // Newly implemented function
  addFollowerRequest,
  addFollowingRequest,
  getUserId,
  getAllFollowingRequests,
  getAllFollowing,
} from "@/serviceFiles/usersDatabaseService";
import { v4 as uuid } from "uuid";

interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  isFollowing?: boolean;
  isFollowingRequest?: boolean;
}
const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375; // 375 is a base width for scaling
  const newSize = size * scale * .5;
  return Math.round(newSize);
};
const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  // Fetch all users from the database using databaseService
  const fetchUsers = async () => {
    try {
      const userIds = await getAllUsernames();
      const currentUserId = await getUserId();
      const allFollowingRequests = await getAllFollowingRequests(currentUserId)
      const allFollowing = await getAllFollowing(currentUserId)
      const userProfiles: User[] = [];

      const profilePromises = userIds.map(async (userBasic) => {
        const profile = await getUserProfile(userBasic.userId);
        if (profile  && (userBasic.userId !== currentUserId)) {
          userProfiles.push({
            userId: userBasic.userId, 
            username: profile.username || "Unknown",
            firstName: userBasic.firstName || "",
            lastName: userBasic.lastName || "",
            profilePic: profile.profilePicture || "",
            isFollowingRequest: allFollowingRequests.some(request => request.id === userBasic.userId),
            isFollowing: allFollowing.some(following => following.id === userBasic.userId),
          } as User);
        }
      });

      await Promise.all(profilePromises);

      setUsers(userProfiles);
      setFilteredData(userProfiles.slice(0, 10));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleRefresh = async () => {
    setRefreshing(true); // Start the refreshing animation
    await fetchUsers()
    setRefreshing(false); // Stop the refreshing animation
  };
  
  const handleAddFriend = async (userId: string) => {
    const currentUserId = await getUserId()
    await addFollowerRequest(userId, currentUserId);
    await addFollowingRequest(currentUserId, userId);
    setFilteredData((prevData) =>
      prevData.map((user) =>
      user.userId === userId ? { ...user, isFollowingRequest: true } : user
      )
    );
  }

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
    {item.isFollowingRequest ? <Ionicons name="checkmark-outline" size={20} color="black" /> :
      item.isFollowing ? <Ionicons name="checkmark-done-outline" size={20} color="black" /> :
        <Ionicons name="add-circle-outline" size={20} color="black"
          onPress={() => handleAddFriend(item.userId)}
        />
    }
  </TouchableOpacity>
);


  return (
    <LinearGradient
    colors={["#4c669f", "#3b5998", "#192f6a"]}
    style={styles.container}
  >
    <SafeAreaView style={styles.safeArea}>
    <View >
    <Text style={styles.navbarTitle}>Search</Text>
    <TextInput
      style={styles.input}
      placeholder="Search"
      placeholderTextColor={"#000000"}
      value={searchQuery}
      onChangeText={handleSearch}
    />
    <FlatList 
      data={filteredData}
      renderItem={renderItem}
      contentContainerStyle={styles.contentContainer}
      keyExtractor={(item, index) => uuid()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#ffd33d"]} // Customize spinner color (Android)
          tintColor="#ffd33d" // Customize spinner color (iOS)
        />
      }
      />
  </View>
  </SafeAreaView>
  </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b5998", // Match Workout.tsx background color
    paddingHorizontal: 16,
    paddingTop: 24, // Adjust as needed
  },
  navbarTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 10,
  },
  searchBar: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#000000",
    marginVertical: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  safeArea: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  fullName: {
    fontSize: 14,
    color: "#D3D3D3",
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#000000",
    marginVertical: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    marginVertical: 5,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#2F44FF",
    borderRadius: 25,
    marginVertical: 5,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
    contentContainer: {
      paddingBottom: getResponsiveFontSize(300), // Adjust the value as needed
    },
    // ...other styles
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Search;