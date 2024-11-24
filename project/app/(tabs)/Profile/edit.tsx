import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, Button, TextInput, Pressable, Alert, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserProfile, getUserId, updateUserProfile } from "@/serviceFiles/usersDatabaseService";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeightPickerModal from '@/components/heightPicker';
import WeightPickerModal from '@/components/weightPicker'; 
import GenderPickerModal from '@/components/genderPicker';
import ImageSelector from '@/components/imagePicker';
import ImagePickerExample from '@/components/imagePicker';

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
   const [uid, setUid] = useState('');
   const [firstName, setFirstName] = useState(''); 
   const [lastName, setLastName] = useState(''); 
   const [username, setUsername] = useState(''); 
   const [email, setEmail] = useState('');
   const [bio, setBio] = useState('');
   const [privacy, setPrivate] = useState(Boolean);
   const [height, setHeight] = useState(0); 
   const [weight, setWeight] = useState(0);
   const [gender, setGender] = useState('');
   const [image, setImage] = useState('');
   const [isEnabled, setIsEnabled] = useState(false); // Switch state
   const auth = getAuth();

   const [isHeightModalVisible, setIsHeightModalVisible] = useState(false);
   const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
   const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
   const [isImageModalVisible, setIsImageModalVisible] = useState(false);

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
      const userId = await getUserId();
      await updateUserProfile(userId, { profilePicture: newImage });
   };

   const toggleSwitch = async () =>  {
      setPrivate(!privacy);
      const userId = await getUserId();
      await updateUserProfile(userId, { isPrivate: privacy });
      setIsEnabled(privacy);
   }

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
        const profile = await getUserProfile(await getUserId()) as UserData;
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
      <SafeAreaView edges={["top", "left", "right"]}>
         <View style={styles.header}>
            <Ionicons style={styles.backButton}
               name="arrow-back"
               size={50}
               color="black"
               onPress={() => router.push('/(tabs)/Profile')} />
            <Text style={styles.editText}>Edit Profile</Text>
         </View>
         <Image source={{ uri: image }} style={styles.profileImage}/>
         <Button title="Edit Picture" onPress={() => setIsImageModalVisible(true)}/>  
         <ImagePickerExample
            isVisible={isImageModalVisible}
            onClose={() => setIsImageModalVisible(false)}
            image={image}
            onImageChange={handleImageChange}
         />
         <View style={styles.container}>
            <View style={styles.row}>
               <Text style={styles.label}>First Name</Text>
               <TextInput
                  autoCapitalize='none'
                  style={styles.firstName}
                  placeholder={firstName}
                  value={firstName}
                  onChangeText={async (text) => {
                     setFirstName(text)
                     updateUserProfile(await getUserId(), {firstName: text})
                     }
                  }
               />
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Last Name</Text>
               <TextInput
                  autoCapitalize='none'
                  style={styles.lastName}
                  placeholder={lastName}
                  value={lastName}
                  onChangeText={async (text) => {
                     setLastName(text)
                     updateUserProfile(await getUserId(), {lastName: text})
                     }
                  }
               />
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Username</Text>
               <TextInput
                  autoCapitalize='none'
                  style={styles.username}
                  placeholder={username}
                  value={username}
                  onChangeText={async (text) => {
                     setUsername(text)
                     updateUserProfile(await getUserId(), {username: text})
                     }
                  }
               />
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Bio</Text>
               <TextInput
                  autoCapitalize='none'
                  multiline={true}
                  style={styles.bio}
                  placeholder={bio}
                  value={bio}
                  onChangeText={async (text) => {
                     setBio(text)
                     updateUserProfile(await getUserId(), {bio: text})
                     }
                  }
               />
            </View>
            {/* <View style={styles.row}>
               <Text style={styles.label}>Height</Text>
               <Pressable style={styles.editHeight}>
                  <Text style={styles.height}>{Math.floor((userData?.height ?? 0) / 12)}' {(userData?.height ?? 0) % 12}"</Text>
               </Pressable>
            </View> */}
            <View style={styles.row}>
               <Text style={styles.label}>Height</Text>
               <Pressable style={styles.editHeight} onPress={() => setIsHeightModalVisible(true)}>
               <Text style={styles.height}>
                  {Math.floor(height/12)}' {height% 12}"
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
               <Pressable style={styles.editWeight} onPress={() => setIsWeightModalVisible(true)}>
                  <Text style={styles.weight}>{weight} Ibs</Text>
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
                  autoCapitalize='none'
                  style={styles.email}
                  placeholder={email}
                  value={email}
                  onChangeText={async (text) => {
                     setEmail(text)
                     updateUserProfile(await getUserId(), {email: text})
                     }
                  }
               />
            </View>
            <View style={styles.row}>
               <Text style={styles.label}>Gender</Text>
               <Pressable style={styles.editGender} onPress={() => setIsGenderModalVisible(true)}>
                  <Text style={styles.gender}>{capitalizeFirstLetter(gender)} </Text>
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
               <Switch style={styles.private}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={privacy ? '#007BFF' : '#f4f3f4'}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
               />
            </View>
         </View>
         <Pressable style={styles.logout} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
         </Pressable>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center', 
      fontSize: 20,
      fontWeight: '600',
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
      paddingHorizontal: 10, 
   },
   backButton: {
      flex: 1, 
      alignItems: 'flex-start', 
      justifyContent: 'center', 
   },
   editText: {
      position: 'absolute',  
      left: '40%', 
      fontSize: 20,
      fontWeight: '600',
   },
   profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: 'black',
      alignSelf: 'center',
      marginTop: 20,
   },
   nameBox: {
      flexDirection: 'row',
   },
   leftText: {
      flex: 1,
      justifyContent: 'flex-start'
   },
   container: {
      paddingLeft: 14,
      paddingTop: 4,
      paddingBottom: 4,
      borderColor: '#D3D3D3',
      borderWidth: 0.25
   },
   row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      marginBottom: 4,
   },
   label: {
      fontSize: 18,
      paddingRight: 20,
   },
   firstName: {
      flex: 1,
      fontSize: 18,
      left: 0,
      marginRight: 0,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   lastName: {
      flex: 1,
      fontSize: 18,
      left: 0,
      marginRight: 0,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   username: {
      flex: 1,
      fontSize: 18,
      left: 4,
      marginRight: 4,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   bio: {
      flex: 1,
      fontSize: 18,
      alignSelf: 'flex-end',
      left: 59,
      marginRight: 59,
      maxWidth: 600,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   height: {
      fontSize: 18,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   weight: {
      flex: 1,
      fontSize: 18,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   email: {
      flex: 1,
      fontSize: 18,
      left: 45,
      marginRight: 45,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   private: {
      flex: 1,
      width: '20%',
      fontSize: 18,
      alignSelf: 'flex-start',
      left: 31,
      marginRight: 31,
      paddingBottom: 4,
   },
   gender: {
      fontSize: 18,
      paddingBottom: 4,
      borderBottomWidth: 0.25,
      borderBottomColor: '#D3D3D3',
   },
   editHeight: {
      flex: 1,
      fontSize: 18,
      left: 34,
      marginRight: 34,
   },
   editWeight: {
      flex: 1,
      fontSize: 18,
      left: 32,
      marginRight: 32,
   },
   editGender : {
      flex: 1,
      alignSelf: 'flex-start',
      left: 28,
      marginRight: 28,
   },
   logout: {
      marginTop: 10,
      alignSelf: 'center',
      borderRadius: 10,
      width: '50%',
      backgroundColor: "#e0e0e0",
   },
   logoutText: {
      alignSelf: 'center',
      fontSize: 18,
      margin: 20,
   },
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   modalContent: {
      width: '80%',
      height: '30%',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 20,
      alignItems: 'center',
   },
   modalHeader: {
      flex: 1,
   },
   modalPickers: {
      flex: 6,
      flexDirection: 'row',
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
   },
   picker: {
      width: '50%',
      height: 150,
   },
   modalButton: {
      marginTop: 20,
      backgroundColor: '#007BFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
   },
});