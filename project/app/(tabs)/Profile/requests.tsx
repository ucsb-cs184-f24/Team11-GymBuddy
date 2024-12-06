import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  getUserId, 
  getAllFollowerRequests, 
  addFollower, 
  addFollowing,
  removeFollowerRequest, 
  removeFollowingRequest,
  updateUserProfile,
  getUserProfile,
  getAllFollowers,
  getAllFollowing
} from '@/serviceFiles/usersDatabaseService';

interface FollowRequest {
  id: string;
  username: string;
  profilePicture: string;
}

export default function FollowRequests() {
  const router = useRouter();
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowRequests();
  }, []);

  const fetchFollowRequests = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      const requests = await getAllFollowerRequests(userId);
      
      const fullRequests = await Promise.all(requests.map(async (request) => {
        const profile = await getUserProfile(request.id);
        return {
          id: request.id,
          username: profile?.username || 'Unknown',
          profilePicture: profile?.profilePicture || 'https://via.placeholder.com/150',
        };
      }));
      
      setFollowRequests(fullRequests);
    } catch (error) {
      console.error('Error fetching follow requests:', error);
      Alert.alert('Error', 'Failed to fetch follow requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const userId = await getUserId();
      const receiverProfile = await getUserProfile(userId);
      
      await addFollower(userId, requestId);
      await addFollowing(requestId, userId);
      await removeFollowerRequest(userId, requestId);
      await removeFollowingRequest(requestId, userId);

      const followerList = await getAllFollowers(userId);
      const followingList = await getAllFollowing(requestId);

      if(receiverProfile){
        await updateUserProfile(userId, { followerCount: followerList.length});
      }
      const senderProfile = await getUserProfile(requestId);
      if (senderProfile) {
        await updateUserProfile(requestId, { followingCount: followingList.length });
      }

      
      fetchFollowRequests();
    } catch (error) {
      console.log('Error accepting follow request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const userId = await getUserId();
      
      await removeFollowerRequest(userId, requestId);
      await removeFollowingRequest(requestId, userId);

      Alert.alert('Success', 'Follow request rejected');
      fetchFollowRequests();
    } catch (error) {
      console.log('Error rejecting follow request:', error);
      
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView>
        {followRequests.map((request) => (
          <View key={request.id} style={styles.requestItem}>
            <Image source={{ uri: request.profilePicture }} style={styles.profileImage} />
            <Text style={styles.username}>{request.username}</Text>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.acceptButton} onPress={() => handleAccept(request.id)}>
                <Text style={styles.buttonText}>Accept</Text>
              </Pressable>
              <Pressable style={styles.rejectButton} onPress={() => handleReject(request.id)}>
                <Text style={styles.buttonText}>Reject</Text>
              </Pressable>
            </View>
          </View>
        ))}
        {followRequests.length === 0 && (
          <Text style={styles.noRequestsText}>No follow requests at the moment.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  noRequestsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});