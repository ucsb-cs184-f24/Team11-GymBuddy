import { getUserId, saveWorkout } from "@/databaseService";
import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Dimensions } from "react-native";
//import * as Progress from "react-native-progress";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");
const vw = (percentage: number) => (width * percentage) / 100;
const vh = (percentage: number) => (height * percentage) / 100;

interface WorkoutLog {
  date: number;
  workouts: string[];
  name?: string;
}

const Workout = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [workoutOptionsVisible, setWorkoutOptionsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const confettiRef = useRef<ConfettiCannon | null>(null);

  const categories = ["Chest", "Back", "Biceps", "Triceps", "Legs", "Shoulders"];
  const workoutsByCategory: { [key: string]: string[] } = {
    Chest: ["Bench Press", "Chest Fly", "Push-Ups"],
    Back: ["Pull-Ups", "Rows", "Lat Pulldown"],
    Biceps: ["Curls", "Hammer Curls", "Preacher Curl"],
    Triceps: ["Tricep Extension", "Dips", "Skull Crushers"],
    Legs: ["Squats", "Lunges", "Leg Press"],
    Shoulders: ["Shoulder Press", "Lateral Raises", "Front Raises"],
  };

  const maxWorkouts = 10; // Max workouts allowed for selection, adjust as needed

  const handleAddWorkout = () => {
    setModalVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); //Haptic feedback for opening modal
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setWorkoutOptionsVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Light haptic feedback on category select
  };

  const handleSelectWorkout = (workout: string) => {
    if (!selectedWorkouts.includes(workout) && selectedWorkouts.length < maxWorkouts) {
      setSelectedWorkouts([...selectedWorkouts, workout]);
      Haptics.selectionAsync(); // Selection feedback on workout select
    }
  };

  const handleSaveWorkout = async () => {
    const userData = await getUserId();
    const workoutLog: WorkoutLog = {
      date: Date.now(),
      workouts: selectedWorkouts,
      name: userData.name, // Assuming userData has a name property
    };
    saveWorkout(workoutLog, userData);

    // Trigger confetti
    confettiRef.current?.start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Success feedback on save

    setSelectedWorkouts([]);
    setModalVisible(false);
    setWorkoutOptionsVisible(false);
    setSelectedCategory(null);
  };

  //const progress = selectedWorkouts.length / maxWorkouts;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Workout</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddWorkout}>
        <Text style={styles.buttonText}>Add Workout</Text>
      </TouchableOpacity>

      {/* Category Selection Modal */}
      <Modal visible={modalVisible && !workoutOptionsVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Category</Text>
          <View style={styles.optionListContainer}>
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
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Workout Options Modal */}
      <Modal visible={workoutOptionsVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Workouts for {selectedCategory}</Text>
            {/* <Progress.Bar
            progress={progress}
            width={vw(80)}
            color="#1e90ff"
            style={styles.progressBar}
            /> */}
            <FlatList
            data={workoutsByCategory[selectedCategory || ""] || []}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.optionListContainer}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectWorkout(item)} style={styles.optionButton}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
            <Text style={styles.saveButtonText}>Save Workouts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setWorkoutOptionsVisible(false)}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Confetti Animation */}
      <ConfettiCannon
        ref={confettiRef}
        count={100}
        origin={{ x: vw(50), y: 0 }}
        autoStart={false}
        fadeOut={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
    padding: vw(5),
  },
  text: {
    fontSize: vw(7),
    fontWeight: "bold",
    color: "#333",
    marginBottom: vh(2),
  },
  button: {
    paddingVertical: vh(1.5),
    paddingHorizontal: vw(6),
    backgroundColor: "#1e90ff",
    borderRadius: vw(6),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: vh(0.5) },
    shadowOpacity: 0.2,
    shadowRadius: vw(3),
    marginBottom: vh(2),
  },
  buttonText: {
    color: "#fff",
    fontSize: vw(4),
    fontWeight: "600",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(240, 244, 247, 0.9)",
    paddingHorizontal: vw(5),
    paddingVertical: vh(5),
  },
  modalTitle: {
    fontSize: vw(6.5),
    fontWeight: "bold",
    color: "#333",
    marginBottom: vh(1.5),
    textAlign: "center",
  },
  // progressBar: {
  //   marginVertical: vh(2),
  //   alignSelf: "center",
  // },
  optionListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  optionButton: {
    paddingVertical: vh(1.5),
    paddingHorizontal: vw(10),
    backgroundColor: "#1e90ff",
    borderRadius: vw(5),
    marginVertical: vh(1),
    width: "80%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: vh(0.3) },
    shadowOpacity: 0.2,
    shadowRadius: vw(3),
  },
  optionText: {
    color: "#fff",
    fontSize: vw(4),
    fontWeight: "500",
    textAlign: "center",
  },
  saveButton: {
    paddingVertical: vh(1.5),
    backgroundColor: "#28a745",
    borderRadius: vw(5),
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    alignSelf: "center",
    marginVertical: vh(1.5),
  },
  saveButtonText: {
    color: "#fff",
    fontSize: vw(4),
    fontWeight: "600",
  },
  closeButton: {
    paddingVertical: vh(1.5),
    backgroundColor: "#dc3545",
    borderRadius: vw(5),
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    alignSelf: "center",
    marginVertical: vh(1),
  },
  closeButtonText: {
    color: "#fff",
    fontSize: vw(4),
    fontWeight: "600",
  },
});

export default Workout;
