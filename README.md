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
