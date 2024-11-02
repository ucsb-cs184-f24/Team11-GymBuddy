import { getUserId, saveWorkout } from "@/databaseService";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, ScrollView } from "react-native";

const Workout = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const [userData, setUserData] = useState(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const categories = ["Chest", "Back", "Biceps", "Triceps", "Legs", "Shoulders", "Abs"];
  const workoutsByCategory: { [key: string]: string[] } = {
    Chest: ["Bench Press", "Chest Fly", "Push-Ups"],
    Back: ["Pull-Ups", "Rows", "Lat Pulldown"],
    Biceps: ["Curls", "Hammer Curls", "Preacher Curl"],
    Triceps: ["Tricep Extension", "Dips", "Skull Crushers"],
    Legs: ["Squats", "Lunges", "Leg Press"],
    Shoulders: ["Shoulder Press", "Lateral Raises", "Front Raises"],
    Abs: ["Crunches", "Planks", "Leg Raises"],
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserId();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const handleAddWorkout = () => {
    setModalVisible(true);
    setIsButtonPressed(true);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSelectWorkout = (workout: string) => {
    if (selectedWorkouts.includes(workout)) {
      setSelectedWorkouts(selectedWorkouts.filter((w) => w !== workout));
    } else {
      setSelectedWorkouts([...selectedWorkouts, workout]);
    }
  };

  const handleCloseDropdown = () => {
    setModalVisible(false);
    setIsButtonPressed(false);
  };

  const handleSaveWorkout = () => {
    const workoutLog = {
      date: Date.now(),
      workouts: selectedWorkouts,
      name: selectedCategory || "Unknown",
    };

    if (userData) {
      saveWorkout(workoutLog, userData);
    } else {
      console.error("User data is null. Cannot save workout.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Add Workout" onPress={handleAddWorkout} />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Category</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <View key={category}>
                <TouchableOpacity onPress={() => handleSelectCategory(category)} style={styles.categoryButton}>
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
                {selectedCategory === category && (
                  <View>
                    {workoutsByCategory[category].map((workout) => (
                      <TouchableOpacity
                        key={workout}
                        onPress={() => handleSelectWorkout(workout)}
                        style={[
                          styles.workoutButton,
                          selectedWorkouts.includes(workout) && styles.selectedWorkoutButton,
                        ]}
                      >
                        <Text
                          style={[
                            styles.workoutText,
                            selectedWorkouts.includes(workout) && styles.selectedWorkoutText,
                          ]}
                        >
                          {workout}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          {selectedCategory && <Button title="Save Workout" onPress={handleSaveWorkout} />}
          <Button title="Close" onPress={handleCloseDropdown} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    margin: 20,
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  categoryButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#0095f6',
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  workoutButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginLeft: 20,
  },
  workoutText: {
    fontSize: 18,
  },
  selectedWorkoutButton: {
    backgroundColor: "#d3d3d3",
  },
  selectedWorkoutText: {
    color: "blue",
  },
});

export default Workout;