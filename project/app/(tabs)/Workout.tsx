import { getUserId, saveWorkout } from "@/databaseService";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

const Workout = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [workoutOptionsVisible, setWorkoutOptionsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);

  const categories = [
    "Chest",
    "Back",
    "Biceps",
    "Triceps",
    "Legs",
    "Shoulders",
  ];
  const workoutsByCategory: { [key: string]: string[] } = {
    Chest: ["Bench Press", "Chest Fly", "Push-Ups"],
    Back: ["Pull-Ups", "Rows", "Lat Pulldown"],
    Biceps: ["Curls", "Hammer Curls", "Preacher Curl"],
    Triceps: ["Tricep Extension", "Dips", "Skull Crushers"],
    Legs: ["Squats", "Lunges", "Leg Press"],
    Shoulders: ["Shoulder Press", "Lateral Raises", "Front Raises"],
  };

  const handleAddWorkout = () => setModalVisible(true);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setWorkoutOptionsVisible(true);
  };

  const handleSelectWorkout = (workout: string) => {
    if (!selectedWorkouts.includes(workout)) {
      setSelectedWorkouts([...selectedWorkouts, workout]);
    }
  };

  const handleSaveWorkout = async () => {
    const userData = await getUserId();
    const workoutLog = {
      date: Math.floor(Date.now() / 1000),
      workouts: selectedWorkouts,
    };
    saveWorkout(workoutLog, userData);

    setSelectedWorkouts([]);
    setModalVisible(false);
    setWorkoutOptionsVisible(false);
    setSelectedCategory(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Workout</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddWorkout}>
        <Text style={styles.buttonText}>Add Workout</Text>
      </TouchableOpacity>

      {/* Category Selection Modal */}
      <Modal
        visible={modalVisible && !workoutOptionsVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Category</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => handleSelectCategory(category)}
              style={styles.optionButton}
            >
              <Text style={styles.optionText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* Workout Options Modal */}
      <Modal visible={workoutOptionsVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Select Workouts for {selectedCategory}
          </Text>
          <FlatList
            data={workoutsByCategory[selectedCategory || ""] || []}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectWorkout(item)}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Save Workouts" onPress={handleSaveWorkout} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginVertical: 5,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Workout;
