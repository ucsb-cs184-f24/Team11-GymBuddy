import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllFollowing, getUserId,getUserProfile } from '@/serviceFiles/usersDatabaseService';

interface Following {
  id: string;
  username: string;
  profilePicture: string;
}

export default function FollowingList() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      const currentUserId = await getUserId();
      const followingList = await getAllFollowing(currentUserId);


      const fullFollowing = await Promise.all(followingList.map(async (following) => {
        const profile = await getUserProfile(following.id);
        return {
          id: following.id,
          username: profile?.username || 'Unknown',
          profilePicture: profile?.profilePicture || 'https://via.placeholder.com/150',
        };
      }));
      setFollowing(fullFollowing);

    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFollowing = ({ item }: { item: Following }) => (
    <View style={styles.followingItem}>
      <Image source={{ uri: item.profilePicture || 'https://via.placeholder.com/50' }} style={styles.profileImage} />
      <Text style={styles.username}>{item.username}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={following}
          renderItem={renderFollowing}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Not following anyone yet</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  followingItem: {
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
    fontSize: 16,
    fontWeight: '500',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});