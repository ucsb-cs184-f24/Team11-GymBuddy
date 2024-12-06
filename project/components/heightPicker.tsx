import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface HeightPickerModalProps {
   isVisible: boolean;
   onClose: () => void;
   height: number; 
   onHeightChange: (newHeight: number) => void;
 }

const HeightPickerModal: React.FC< HeightPickerModalProps > = ({ isVisible, onClose, height, onHeightChange }) => {
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
            <Text style={styles.modalTitle}>Select Height</Text>
          </View>
          <View style={styles.modalPickers}>
            {/* Feet Picker */}
            <Picker
              selectedValue={Math.floor(height / 12)} // Feet part of height
              onValueChange={(value) => onHeightChange(Number(value) * 12 + (height % 12))} // Update height in inches
              style={styles.picker}
              itemStyle={{ fontSize: 18, color: 'black' }}

            >
              {Array.from({ length: 4 }, (_, i) => (
                <Picker.Item label={`${i + 4} feet`} value={i + 4} key={i} />
              ))}
            </Picker>

            {/* Inches Picker */}
            <Picker
              selectedValue={height % 12}
              onValueChange={(value) => onHeightChange(Math.floor(height / 12) * 12 + Number(value))} // Update height in inches
              style={styles.picker}
              itemStyle={{ fontSize: 18, color: 'black' }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Picker.Item label={`${i} inches`} value={i} key={i} />
              ))}
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
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  picker: {
    width: '50%',
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

export default HeightPickerModal;