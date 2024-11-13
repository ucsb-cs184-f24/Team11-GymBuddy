import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  Dimensions,
  StatusBar,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { getUserId, saveWorkout, getWorkouts } from '@/serviceFiles/databaseService';
import { workoutsByCategory } from '@/utils/Workout/workoutCatagory';

const { width } = Dimensions.get('window');

interface WorkoutLog {
  date: number;
  workouts: string[];
  name?: string;
}

export default function WorkoutScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const [userData, setUserData] = useState<string | null>(null);
  const [previousWorkouts, setPreviousWorkouts] = useState<WorkoutLog[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const fadeAnim = new Animated.Value(0);

  const categories = ["Chest", "Back", "Biceps", "Triceps", "Legs", "Shoulders", "Abs"];

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserId();
      setUserData(data || null);
    };
    fetchUserData();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    const fetchPreviousWorkouts = async () => {
      if (userData) {
        const workouts = await getWorkouts(userData);
        if (workouts) {
          const workoutArray: WorkoutLog[] = Object.values(workouts as unknown as Record<string, WorkoutLog>).map(w => ({
            ...w,
            workouts: w.workouts || [],
          }));
          workoutArray.sort((a, b) => b.date - a.date);
          setPreviousWorkouts(workoutArray);
        } else {
          setPreviousWorkouts([]);
        }
      }
    };
    fetchPreviousWorkouts();
  }, [userData]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSelectWorkout = (workout: string) => {
    setSelectedWorkouts(prev => 
      prev.includes(workout) ? prev.filter(w => w !== workout) : [...prev, workout]
    );
  };

  const handleSaveWorkout = async () => {
    if (userData && selectedWorkouts.length > 0) {
      const workoutLog: WorkoutLog = {
        date: Date.now(),
        workouts: selectedWorkouts,
        name: workoutName || selectedCategory || "Custom Workout",
      };
      await saveWorkout(workoutLog, userData);
      const updatedWorkouts = await getWorkouts(userData);
      if (updatedWorkouts) {
        const workoutArray: WorkoutLog[] = Object.values(updatedWorkouts as unknown as Record<string, WorkoutLog>).map(w => ({
          ...w,
          workouts: w.workouts || [],
        }));
        workoutArray.sort((a, b) => b.date - a.date);
        setPreviousWorkouts(workoutArray);
      }
      setSelectedCategory(null);
      setSelectedWorkouts([]);
      setWorkoutName('');
      setModalVisible(false);
    }
  };

  const renderWorkoutItem = ({ item }: { item: WorkoutLog }) => (
    <BlurView intensity={80} tint="dark" style={styles.workoutLog}>
      <Text style={styles.workoutLogDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.workoutLogCategory}>{item.name}</Text>
      <Text style={styles.workoutLogExercises}>{item.workouts.join(", ")}</Text>
    </BlurView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[styles.content, { opacity: 100 }]}>
            <Text style={styles.title}>Workout Tracker</Text>
            
            <FlatList
              data={previousWorkouts}
              renderItem={renderWorkoutItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={<Text style={styles.noWorkoutsText}>No previous workouts found.</Text>}
              contentContainerStyle={styles.workoutList}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>Add Workout</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <BlurView intensity={100} tint="dark" style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Workout</Text>
            <TextInput
              style={styles.input}
              placeholder="Workout Name"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={workoutName}
              onChangeText={setWorkoutName}
            />
            <ScrollView style={styles.categoryList}>
              {categories.map((category) => (
                <View key={category}>
                  <TouchableOpacity
                    onPress={() => handleSelectCategory(category)}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.selectedCategoryButton
                    ]}
                  >
                    <Text style={styles.categoryText}>{category}</Text>
                  </TouchableOpacity>
                  {selectedCategory === category && (
                    <View style={styles.workoutList}>
                      {workoutsByCategory[category].map((workout) => (
                        <TouchableOpacity
                          key={workout}
                          onPress={() => handleSelectWorkout(workout)}
                          style={[
                            styles.workoutButton,
                            selectedWorkouts.includes(workout) && styles.selectedWorkoutButton,
                          ]}
                        >
                          <Text style={styles.workoutText}>{workout}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
                <Text style={styles.buttonText}>Save Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  workoutLog: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  workoutLogDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  workoutLogCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  workoutLogExercises: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#3b5998',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: '#FFFFFF',
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  selectedCategoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  workoutList: {
    marginLeft: 20,
    marginBottom: 16,
  },
  workoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  selectedWorkoutButton: {
    backgroundColor: 'rgba(0, 255, 255, 0.3)',
  },
  workoutText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    borderRadius: 25,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'rgba(52, 199, 89, 0.8)',
    borderRadius: 25,
    padding: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});