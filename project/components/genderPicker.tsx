import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface GenderPickerProps {
  isVisible: boolean;
  onClose: () => void;
  gender: string;
  onGenderChange: (gender: string) => void;
}

const GenderPickerModal: React.FC<GenderPickerProps> = ({ isVisible, onClose, gender, onGenderChange }) => {
   return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
            </View>
            <View style={styles.modalPickers}>
              <Picker
                selectedValue={gender} 
                onValueChange={(value) => {onGenderChange(value)}} 
                style={styles.picker}
              >
               <Picker.Item label="Male" value="male" />
               <Picker.Item label="Female" value="female" />
               <Picker.Item label="Non-Binary" value="nonBinary" />
               <Picker.Item label="Prefer not to say" value="unspecified" />
               <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
            <Pressable style={styles.modalButton} onPress={onClose}>
              <Text style={styles.buttonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 20,
      alignItems: 'center',
    },
    modalHeader: {
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    modalPickers: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%',
      marginBottom: 20,
    },
    picker: {
     width: '80%',
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#007BFF',
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });
  
export default GenderPickerModal;