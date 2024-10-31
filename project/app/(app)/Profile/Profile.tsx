<<<<<<< HEAD

import React, { useState, useEffect } from 'react';
=======
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
>>>>>>> 08e1e84 (merge main again)
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProfileData {
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
<<<<<<< HEAD
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();
<<<<<<< HEAD
=======

  const logout = async() => {
    try {
      await auth.signOut()
      await AsyncStorage.removeItem("@user");
      router.replace("/(auth)/page");
      Alert.alert('Logged Out');
    } catch (error) {
      Alert.alert('Error logging out');
    }
  };
>>>>>>> b2640b8 (my bad I accidentaly made sawyer merge)

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.replace("/(auth)/page");
=======
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
>>>>>>> 08e1e84 (merge main again)
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
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
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{profileData.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profileData.email}</Text>
          </View>
        </View>
<<<<<<< HEAD
<<<<<<< HEAD
=======
        <View style={styles.container}>
            <Button title="Logout" onPress={logout} color="#4a90e2" />
        </View>
>>>>>>> b2640b8 (my bad I accidentaly made sawyer merge)
      </ScrollView>
=======
      </View>
>>>>>>> 08e1e84 (merge main again)
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6C8',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  placeholderImage: {
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: 'transparent',
  },
  uploadButtonText: {
    color: '#007AFF',
    fontSize: 17,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#C6C6C8',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6C8',
  },
  infoLabel: {
    fontSize: 17,
    color: '#3C3C43',
  },
  infoValue: {
    fontSize: 17,
    color: '#000000',
  },
});
