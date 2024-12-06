import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AnalyticCharts from "@/components/Profile/AnalyticCharts";
import { getAllUsersRecentWorkouts } from "@/serviceFiles/postsDatabaseService";

// Define time periods for filtering
const TimePeriod = {
  Week: "Week",
  Month: "Month",
  Year: "Year",
};

const Stats = () => {
  interface LeaderboardItem {
    username: string;
    totalWorkouts: number;
  }

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
  const [timeFilter, setTimeFilter] = useState(TimePeriod.Week); // Default filter
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData(timeFilter);
  }, [timeFilter]);

  const fetchLeaderboardData = async (period: string) => {
    try {
      setLoading(true);
      const workouts = await getAllUsersRecentWorkouts();

      const now = new Date();
      let startDate: Date;

      // Set the start date based on the selected period
      if (period === TimePeriod.Week) {
        startDate = new Date(now.setDate(now.getDate() - 7));
      } else if (period === TimePeriod.Month) {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
      } else if (period === TimePeriod.Year) {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }

      // Filter workouts within the selected period
      const filteredWorkouts = workouts.filter(
        (workout) => workout.createdAt >= startDate.getTime()
      );

      // Process leaderboard data
      const leaderboard = processLeaderboardData(filteredWorkouts);
      setLeaderboardData(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processLeaderboardData = (workouts: any[]): LeaderboardItem[] => {
    const userStats: { [key: string]: LeaderboardItem } = {};

    workouts.forEach((workout) => {
      const { userId, username } = workout;

      // Initialize stats for the user if not already present
      if (!userStats[userId]) {
        userStats[userId] = {
          username: username || "Unknown User",
          totalWorkouts: 0,
        };
      }

      // Increment total workouts
      userStats[userId].totalWorkouts += 1;
    });

    // Convert stats object to an array and sort by totalWorkouts
    return Object.values(userStats).sort(
      (a, b) => b.totalWorkouts - a.totalWorkouts
    );
  };

  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardItem; index: number }) => (
    <View style={styles.leaderboardItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.stat}>Workouts: {item.totalWorkouts}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Include Analytics Chart */}
      <AnalyticCharts />

      {/* Add Spacer to Shift Leaderboard Down */}
      <View style={styles.spacer} />

      {/* Leaderboard Section */}
      <View style={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}>Leaderboard</Text>
        <View style={styles.filterContainer}>
          {Object.values(TimePeriod).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.filterButton,
                timeFilter === period && styles.activeFilterButton,
              ]}
              onPress={() => setTimeFilter(period)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  timeFilter === period && styles.activeFilterButtonText,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={leaderboardData}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures content fills the ScrollView
    backgroundColor: "#fff",
    paddingBottom: 20, // Adds space at the bottom of the ScrollView
  },
  spacer: {
    height: 40, // Increased spacer height to shift the leaderboard further down
  },
  leaderboardContainer: {
    padding: 20,
    marginTop: 20, // Adds extra spacing above the leaderboard
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  activeFilterButton: {
    backgroundColor: "#007BFF",
    borderColor: "#0056b3",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#000",
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  leaderboardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  rank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  username: {
    fontSize: 16,
    color: "#555",
  },
  stat: {
    fontSize: 14,
    color: "#777",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});

export default Stats;
