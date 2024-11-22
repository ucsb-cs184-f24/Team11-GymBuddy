// SignInNoFire.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from './SignInNoFire';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));


describe('Login Component', () => {
  beforeAll(() => {
    global.alert = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password inputs and sign in button', () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('signs in successfully with correct credentials', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', 'dummy-auth-token');
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('shows alert with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});