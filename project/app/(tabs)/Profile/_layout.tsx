import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Profile', headerShown: false, animation: 'ios_from_left' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit', headerShown: false }} />
    </Stack>
  );
}