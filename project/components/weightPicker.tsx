import React, { useEffect } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface WeightPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  weight: number;
  onWeightChange: (newHeight: number) => void;
}

const WeightPickerModal: React.FC<WeightPickerModalProps> = ({
  isVisible,
  onClose,
  weight,
  onWeightChange,
}) => {
  useEffect(() => {
    if (isVisible) {
      onWeightChange(weight);
    }
  }, [isVisible]);
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
            <Text style={styles.modalTitle}>Select Weight</Text>
          </View>
          <View style={styles.modalPickers}>
            <Picker
              selectedValue={weight}
              onValueChange={(value) => {
                onWeightChange(Number(value));
              }}
              style={styles.picker}
            >
              {Array.from({ length: 400 }, (_, i) => (
                <Picker.Item label={`${i} Ibs`} value={i} key={i} />
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalPickers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    marginBottom: 20,
  },
  picker: {
    width: "80%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default WeightPickerModal;
