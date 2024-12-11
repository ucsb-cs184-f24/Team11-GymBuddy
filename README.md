# Team11 - GymBuddy (ELE)

## Govt. Names and GitHub IDs

| Name            | GitHub ID |
|-----------------|-----------|
| Aaron Rosales   | 49774761  |
| Aavash Adhikari | 115107368 |
| Chris Woolson   | 30053591  |
| Cory Zhao       | 91992519  |
| Sawyer Rice     | 129905805 |
| Tyler Canepa    | 130712814 |
| Liam Ronarch    | 82777456  |

## App Overview

Gym Buddy App is an interactive mobile application designed to enhance the gym-going experience by allowing users to track their workout progress, share updates, and engage in friendly competitions with friends. Inspired by fitness platforms like Strava, Gym Buddy focuses specifically on gym activities, providing a tailored environment for fitness enthusiasts to stay motivated and connected. Users can navigate through five main sections: Home, Search, Gym Updates, Comparison with Friends, and Profile, each offering unique functionalities to support their fitness journeys.

## Tech Stack

- **Framework**: React Native
- **Development Tool**: Expo Go
- **Backend Services**:
  - **Firebase**: For real-time database, authentication, and hosting.
  - **Google OAuth**: For secure user authentication and profile management.

## User Roles and Permissions

### 1. Regular Users

- **Capabilities**:
  - **Track Workouts**: Log and monitor personal workout sessions.
  - **Share Updates**: Post workout achievements and updates to the Gym Updates page.
  - **Search**: Find other gym members, gyms, or specific workouts.
  - **Compare with Friends**: View and compare workout statistics with friends.
  - **Manage Profile**: Update personal information, workout history, and app settings.
  
- **Goals**:
  - Stay motivated through progress tracking and friendly competition.
  - Connect with friends and the fitness community for support and accountability.
  - Discover new workouts and gyms to enhance their fitness regimen.

### 2. Admin Users

- **Capabilities**:
  - **Moderate Content**: Approve or remove user-generated content to maintain community standards.
  - **Manage Users**: Access and manage user accounts, including the ability to deactivate accounts if necessary.
  - **View Analytics**: Access app usage statistics and user engagement metrics.
  
- **Goals**:
  - Ensure a safe and positive environment for all users.
  - Maintain the integrity and quality of the app's content.
  - Monitor app performance and user engagement to inform future improvements.

## Roles and Permissions

To maintain a secure and user-friendly environment, Gym Buddy App defines specific roles with distinct permissions:

- **Regular Users**:
  - **Read Access**: Can view workout logs, updates, and friends' comparisons.
  - **Write Access**: Can create and edit their own workout logs and updates.
  
- **Admin Users**:
  - **Full Access**: Can read, write, and delete any content within the app.
  - **User Management**: Can manage user accounts and permissions.

Implementing these roles ensures that while regular users can fully engage with the app's features, admin users retain control over content and user management to prevent misuse and maintain community standards.

# Gym Buddy

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Expo Go Mobile App**: download Expo Go app from the app store on your mobile device
- **Node.js** (version 14.x or higher): [Download Node.js](https://nodejs.org/)
- **npm** (version 6.x or higher): Comes with Node.js
- **Expo CLI**: Install globally using:

  ```bash
  npm install -g expo-cli

### Dependencies

The project uses several libraries and add-ons:

- **@expo/vector-icons**: For using vector icons in the app.
- **@react-navigation/native**: Manages navigation within the app.
- **expo-image-picker**: Allows users to pick images from their device.
- **firebase**: Backend services for authentication and database.
- **react-native-gifted-charts**: Displays interactive charts.
- **react-native-reanimated**: Enables advanced animations.
- **expo-auth-session**: Handles authentication flows.
- **@react-native-async-storage/async-storage**: Handles storing local data.

*Refer to `package.json` for the complete list of dependencies*

### Installation Steps

Follow these steps to set up the project:

1. **Clone the repository**
   ```bash
   git clone git@github.com:ucsb-cs184-f24/Team11-GymBuddy.git
   
2. **Navigate to the project directory**
   ```bash
   cd Team11-GymBuddy
   cd project

4. **Install the dependencies**
   ```bash
   npm install

5. **Start the development server**
   ```bash
   npx expo start

6. **Switch to Expo Go**
   <br>
   <br>
    Press 's' when the option appears in terminal to switch to Expo Go.

5. **Run the app with Expo Go**
   <br>
   <br>
   Scan the QR code produced in terminal.

### Functionality

Follow these steps to use GymBuddy

- Create an account or sign in
- Click on the **Workout** tab to add workouts
- Click on the **Profile** tab to view your profile data
- Click on the **Home** tab to see workout logs of other users

### Known Problems
- **Stats** tab has nothing on it yet. We plan to move code there in the future
- Given the limitations of Expo Go, our authentication does not fully work as intended
- You are able to save a workout without it's workout name
- The profile image is stored locally

## Contributing

We welcome contributions from everyone. Please follow these steps:

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b my-new-feature
3. **Commit your changes**
   ```bash
   git commit -am 'Add some feature'
4. **Push to the branch**
   ```bash
   git push origin my-new-feature
5. **Submit a pull request**

### License
This project is licensed under the MIT License - see the LICENSE.md file for details
