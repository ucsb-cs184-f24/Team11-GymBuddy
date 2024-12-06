import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TextInput,
  Pressable,
  Alert,
  Modal,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getUserProfile,
  getUserId,
  updateUserProfile,
} from "@/serviceFiles/usersDatabaseService";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeightPickerModal from "@/components/heightPicker";
import WeightPickerModal from "@/components/weightPicker";
import GenderPickerModal from "@/components/genderPicker";
import ImagePickerExample from "@/components/imagePicker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

interface UserData {
  bio: string;
  createdAt: number;
  email: string;
  firstName: string;
  followerCount: number;
  followingCount: number;
  gender: string;
  height: number | null;
  isPrivate: boolean;
  lastName: string;
  profilePicture: string;
  username: string;
  weight: number | null;
}

export default function EditProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [privacy, setPrivate] = useState(Boolean);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [gender, setGender] = useState("");
  const [image, setImage] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  const [isHeightModalVisible, setIsHeightModalVisible] = useState(false);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const storage = getStorage();
  const auth = getAuth();

  const handleHeightChange = async (newHeight: number) => {
    setHeight(newHeight);
    const userId = await getUserId();
    await updateUserProfile(userId, { height: newHeight });
  };

  const handleWeightChange = async (newWeight: number) => {
    setWeight(newWeight);
    const userId = await getUserId();
    await updateUserProfile(userId, { weight: newWeight });
  };

  const handleGenderChange = async (newGender: string) => {
    setGender(newGender);
    const userId = await getUserId();
    await updateUserProfile(userId, { gender: newGender });
  };

  const handleImageChange = async (newImage: string) => {
    setImage(newImage);
  
    try {
      const userId = await getUserId();
      const storageRef = ref(storage, `profilePictures/${userId}`);

      const response = await fetch(newImage);
      const blob = await response.blob();
  
      await uploadBytes(storageRef, blob);
  
      const downloadURL = await getDownloadURL(storageRef);
  
      await updateUserProfile(userId, { profilePicture: downloadURL });
      
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };  

  const toggleSwitch = async () => {
    setPrivate(!privacy);
    const userId = await getUserId();
    await updateUserProfile(userId, { isPrivate: privacy });
    setIsEnabled(privacy);
  };

  const capitalizeFirstLetter = (str: string) => {
    if (str.length === 0) return str; // Check if the string is empty
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const logout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem("@user");
      router.replace("/(auth)/SignIn");
      Alert.alert("Logged Out");
    } catch (error) {
      Alert.alert("Error logging out");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const profile = (await getUserProfile(await getUserId())) as UserData;
      if (profile) {
        setUserData(profile);
      } else {
        console.error("Profile data is undefined");
      }
      setFirstName(profile?.firstName);
      setLastName(profile?.lastName);
      setUsername(profile?.username);
      setBio(profile?.bio);
      setEmail(profile?.email);
      setPrivate(profile?.isPrivate);
      setHeight(profile?.height ?? 0);
      setWeight(profile?.weight ?? 0);
      setGender(profile?.gender);
      setIsEnabled(profile?.isPrivate);
      setImage(profile?.profilePicture);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Ionicons
          style={styles.backButton}
          name="arrow-back"
          size={35}
          color="black"
          onPress={() => router.push("/(tabs)/Profile")}
        />
        <Text style={styles.editText}>Edit Profile</Text>
      </View>
      <ScrollView>
        <Image source={{ uri: image || undefined }} style={styles.profileImage} />
        <Button
          title="Edit Picture"
          onPress={() => setIsImageModalVisible(true)}
        />
        <ImagePickerExample
          isVisible={isImageModalVisible}
          onClose={() => setIsImageModalVisible(false)}
          image={image}
          onImageChange={handleImageChange}
        />
        <View style={styles.formContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              placeholder={firstName}
              value={firstName}
              onChangeText={async (text) => {
                setFirstName(text);
                updateUserProfile(await getUserId(), { firstName: text });
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              placeholder={lastName}
              value={lastName}
              onChangeText={async (text) => {
                setLastName(text);
                updateUserProfile(await getUserId(), { lastName: text });
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              placeholder={username}
              value={username}
              onChangeText={async (text) => {
                setUsername(text);
                updateUserProfile(await getUserId(), { username: text });
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              autoCapitalize="none"
              multiline={true}
              style={styles.input}
              placeholder={bio}
              value={bio}
              onChangeText={async (text) => {
                setBio(text);
                updateUserProfile(await getUserId(), { bio: text });
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Height</Text>
            <Pressable
              style={styles.edit}
              onPress={() => setIsHeightModalVisible(true)}
            >
              <Text style={styles.input}>
                {Math.floor(height / 12)}' {height % 12}"
              </Text>
            </Pressable>
            <HeightPickerModal
              isVisible={isHeightModalVisible}
              onClose={() => setIsHeightModalVisible(false)}
              height={height}
              onHeightChange={handleHeightChange}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Weight</Text>
            <Pressable
              style={styles.edit}
              onPress={() => setIsWeightModalVisible(true)}
            >
              <Text style={styles.input}>{weight} Ibs</Text>
            </Pressable>
            <WeightPickerModal
              isVisible={isWeightModalVisible}
              onClose={() => setIsWeightModalVisible(false)}
              weight={weight}
              onWeightChange={handleWeightChange}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              placeholder={email}
              value={email}
              onChangeText={async (text) => {
                setEmail(text);
                updateUserProfile(await getUserId(), { email: text });
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender</Text>
            <Pressable
              style={styles.edit}
              onPress={() => setIsGenderModalVisible(true)}
            >
              <Text style={styles.input}>{capitalizeFirstLetter(gender)} </Text>
            </Pressable>
            <GenderPickerModal
              isVisible={isGenderModalVisible}
              onClose={() => setIsGenderModalVisible(false)}
              gender={gender}
              onGenderChange={handleGenderChange}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Private</Text>
            <Switch
              style={styles.input}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#007BFF" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <Pressable style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "600",
    borderBottomWidth: 0.25,
    borderBottomColor: "#D3D3D3",
  },
  backButton: {
    flex: 1,
    left: 12,
  },
  editText: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "600",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "black",
    alignSelf: "center",
    marginTop: 20,
  },
  formContainer: {
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    marginVertical: 6,
  },
  label: {
    fontSize: 18,
    paddingRight: 20,
    width: 110,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingBottom: 6,
    borderBottomWidth: 0.25,
    borderBottomColor: "#D3D3D3",
  },
  edit: {
    flex: 1,
  },
  logout: {
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 20,
    width: "50%",
    backgroundColor: "#e0e0e0",
  },
  logoutText: {
    alignSelf: "center",
    fontSize: 18,
    margin: 20,
  },
});
