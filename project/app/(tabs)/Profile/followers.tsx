import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllFollowers, getUserId, getUserProfile } from '@/serviceFiles/usersDatabaseService';

interface Follower {
  id: string;
  username: string;
  profilePicture: string;
}

export default function FollowersList() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const currentUserId = await getUserId();
      const followersList = await getAllFollowers(currentUserId);
      
      const fullFollowers = await Promise.all(followersList.map(async (followers) => {
        const profile = await getUserProfile(followers.id);
        return {
          id: followers.id,
          username: profile?.username || 'Unknown',
          profilePicture: profile?.profilePicture || 'https://via.placeholder.com/150',
        };
      }));
      setFollowers(fullFollowers);

    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFollower = ({ item }: { item: Follower }) => (
    <View style={styles.followerItem}>
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
          data={followers}
          renderItem={renderFollower}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No followers yet</Text>}
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
  followerItem: {
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