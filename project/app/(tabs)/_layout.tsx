import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: '#ffd33d',
      headerStyle: {
        backgroundColor: '#25292e',
      },
      headerShadowVisible: false,
      headerTintColor: '#fff',
      tabBarStyle: {
      backgroundColor: '#25292e',
      },
    }}
    >
      <Tabs.Screen 
        name="Home/Home" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="Search/Search" 
        options={{ 
          title: 'Search', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} color={color} size={24} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="Workout/Workout" 
        options={{ 
          title: 'Workout', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'barbell' : 'barbell-outline'} color={color} size={24} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="Stats/Stats" 
        options={{ 
          title: 'Stats', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} size={24} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="Profile/Profile" 
        options={{ 
          title: 'Profile', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ), 
        }} 
      />
    </Tabs>
  );
}