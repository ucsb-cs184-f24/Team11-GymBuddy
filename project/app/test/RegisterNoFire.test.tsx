// RegisterNoFire.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../(auth)/RegisterNoFire'; // Adjust the import path as necessary
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

// Mock useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('Register Component', () => {
  const mockPush = jest.fn();

  beforeAll(() => {
    // Mock useRouter to return a mock push function
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Mock Alert.alert using jest.spyOn
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders name, email, and password inputs and register button', () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('registers successfully with valid inputs', async () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'securepassword');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', 'dummy-auth-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'userProfile',
        JSON.stringify({ email: 'john@example.com', name: 'John Doe', token: 'dummy-auth-token' })
      );
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('shows alert when fields are missing', async () => {
    const { getByText } = render(<Register />);

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Please fill all fields');
    });
  });

  it('shows alert when only name and email are provided', async () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    // Password is missing
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Please fill all fields');
    });
  });

  it('shows alert when only email and password are provided', async () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    // Name is missing
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'securepassword');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Please fill all fields');
    });
  });

  it('shows alert when only name and password are provided', async () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    // Email is missing
    fireEvent.changeText(getByPlaceholderText('Password'), 'securepassword');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Please fill all fields');
    });
  });
});