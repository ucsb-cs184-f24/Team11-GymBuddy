## Future Implementation Suggestions/User Stories

### Profile Pic Needs to Store in Database
- **Benefits**: All users who want to store a profile picture and see what other users look like.
- **Requirements**: Set up the database correctly to store images, possibly fixing the Firebase setup.
- **Acceptance Criteria**:
  - Images can be stored in the database.
  - The profile picture persists on the profile page even after logging in and out.
  - Users can set this picture from their camera roll.

### Fixing Live Updates in Posts
- **Benefits**: All users who want real-time updates without needing to refresh the page.
- **Requirements**: Refactor or improve the current real-time database setup to sync changes instantly.
- **Acceptance Criteria**:
  - Post updates are visible to users in real-time.
  - Changes to posts reflect on all users' feeds without delay or page refresh.

### Fix Post Workouts and Add Workouts Button
- **Benefits**: Users who want a seamless experience posting and tracking their workouts.
- **Requirements**: Resolve issues with the workout posting feature and ensure add button functionality.
- **Acceptance Criteria**:
  - Users can add and save new workouts without errors.
  - The “Add Workout” button works correctly, and new workouts appear in the user’s workout list.

### Uploading Pictures to Posts
- **Benefits**: Users who want to share visual progress or images alongside their posts.
- **Requirements**: Configure the database to handle image uploads for posts and adjust UI for picture display.
- **Acceptance Criteria**:
  - Users can upload images to accompany their posts.
  - Images are stored in the database and displayed with posts on the feed.

### Stop Email Jittering
- **Benefits**: Provides a smoother user experience, especially during email input.
- **Requirements**: Identify the cause of jittering during email entry and fix it for a stable input field.
- **Acceptance Criteria**:
  - The email field no longer jitters while typing.
  - The input is smooth, responsive, and works consistently across different devices.

### Ability to Dismiss Email Input
- **Benefits**: Improves usability by allowing users to exit the email input field when needed.
- **Requirements**: Add functionality to close or exit the email input screen or field when the user taps outside it.
- **Acceptance Criteria**:
  - Users can dismiss the email input by tapping outside the field.
  - Email input closes smoothly and returns to the previous screen if applicable.

### Resolve Installation and Running Issues
- **Benefits**: Makes the app accessible to all users without setup issues.
- **Requirements**: Troubleshoot and document installation issues to provide clear steps or fixes.
- **Acceptance Criteria**:
  - Users can install and run the app without encountering errors.
  - Setup instructions are clear and lead to a successful installation on the first attempt.

### Fix Analytics Functionality
- **Benefits**: Allows the app owner to track user engagement and activity accurately.
- **Requirements**: Review and adjust the analytics setup to ensure it captures all necessary events.
- **Acceptance Criteria**:
  - Analytics logs user actions correctly and provides accurate usage data.
  - Key events such as workout posts, login, and navigation are tracked reliably.

### Implement Friends Feature
- **Benefits**: Enables users to connect with friends for mutual support and motivation.
- **Requirements**: Design and build the feature to allow users to add friends, view friends' profiles, and see their workout activities.
- **Acceptance Criteria**:
  - Users can search for and add friends.
  - Friends' activities are viewable, and updates are shown on the user’s feed.
