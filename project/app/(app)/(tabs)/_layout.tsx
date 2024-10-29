import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="Home/Home" options={{ title: 'Home' }} />
      <Tabs.Screen name="Search/Search" options={{ title: 'Search' }} />
      <Tabs.Screen name="Workout/Workout" options={{ title: 'Workout' }} />
      <Tabs.Screen name="Stats/Stats" options={{ title: 'Stats' }} />
      <Tabs.Screen name="Profile/Profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}