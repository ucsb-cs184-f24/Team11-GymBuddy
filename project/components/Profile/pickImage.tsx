import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ImagePickerComponentProps {
  onImageSelected?: (uri: string) => void;
  initialImage?: string | null;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  onImageSelected,
  initialImage,
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadSavedImage();
  }, []);

  const loadSavedImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem("@profile_image");
      if (savedImage) {
        setProfileImage(savedImage);
      } else if (initialImage) {
        setProfileImage(initialImage);
      }
    } catch (error) {
      console.error("Error loading saved image:", error);
    }
  };

  const saveImage = async (uri: string) => {
    try {
      await AsyncStorage.setItem("@profile_image", uri);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      saveImage(imageUri);
      onImageSelected?.(imageUri);
    }
  };

  return (
    <View style={styles.profileImageContainer}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      ) : (
        <View style={[styles.profileImage, styles.placeholderImage]}>
          <Ionicons name="person" size={60} color="#C7C7CC" />
        </View>
      )}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Change Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  placeholderImage: {
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "transparent",
  },
  uploadButtonText: {
    color: "#007AFF",
    fontSize: 17,
  },
});

export default ImagePickerComponent;
