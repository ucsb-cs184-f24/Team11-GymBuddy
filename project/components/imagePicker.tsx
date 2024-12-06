import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Modal, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerProps {
  isVisible: boolean;
  onClose: () => void;
  image: string; 
  onImageChange: (newImage: string) => void;
}

const ImagePickerModal: React.FC<ImagePickerProps> = ({ isVisible, onClose, image, onImageChange }) => {
  const pickImage = async () => {
    // Request permissions (necessary for expo-image-picker)
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageChange(result.assets[0].uri);  // Set the selected image URI
      }
    } else {
      alert('Permission to access media library is required!');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Pick an Image</Text>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.noImageText}>No image selected</Text>
          )}
          <Button title="Pick an image from gallery" onPress={pickImage} />
          <View style={styles.closeButton}>
            <Button title="Close" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  noImageText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
  },
});

export default ImagePickerModal;