# Design Flow

<img src="https://github.com/user-attachments/assets/dcf6827c-e83b-4bbf-85ab-2ba87da3b4ac" alt="Flow 1" width="600">
<img src="https://github.com/user-attachments/assets/7bad6719-0e85-4762-815e-f331976be203" alt="Flow 2" width="800">

# File Structure 

```python
app/
├── (auth)/                            # Authentication pages
│   ├── SignIn.tsx                     # User sign-in page
│   ├── Register.tsx                   # User register page 
│ 
├── (app)/                             # Main app pages
│   ├── (tabs)/                        # Tabs for navigation
│   │   ├── Home.tsx                   # Home page (e.g., feed)
│   │   ├── Search.tsx                 # Search users/posts
│   │   ├── Workout.tsx                # Add new workout page
│   │   ├── Stats.tsx                  # Stats and analytics page
│   │   ├── Profile/
│   │   │   ├── _layout.tsx            # Layout for profile pages
│   │   │   ├── index.tsx              # User's profile page
│   │   │   ├── edit.tsx      	      # User's edit profile page
│   ├── EditProfile.tsx                # Page to edit your own profile
│   ├── UserProfile.tsx                # Page to view another user's profile
│   ├── Post.tsx                       # Page to view an individual post 
```

# Design Images

Profile and Edit Profile

<img src="https://github.com/user-attachments/assets/f7098470-03a0-4651-8c96-f3430fcdc853" alt="Profile Page" width="200">
<img src="https://github.com/user-attachments/assets/93fdd51b-95e7-4cea-9d44-cb78a3953537" alt="Edit" width="200">

Search Bar and Follow Screen

<img src="https://github.com/user-attachments/assets/8c37384d-3fb6-460c-9430-e7f537af4c1e" alt="Search Bar" width="200">
<img src="https://github.com/user-attachments/assets/958134e2-1e79-4a59-8f25-89768f56bfdc" alt="Follow" width="200">

# Database Notes

Using NoSQL Firestore Database
Want to be able to store images
nodes: users, posts

# Database Design 

```python
users (collection)
	- userId: uid (document)
		- firstName: string
		- lastName: string
		- username: string
		- email: string
		- profilePicture: string
		- followerCount: number
		- followingCount: number
		- height: number
		- weight: number
		- gender: string
		- bio: string
		- createdAt: timestamp
		- isPrivate: bool
		- following (collection)
			- userId: uid (document)
				- username: string
				- profilePicture: string
		- followers (collection)
			- userId: uid (document)
				- username: string
				- profilePicture: string
		- followingRequests (collection)
			- userId: uid (document)
				- username: string
				- profilePicture: string
		- followerRequests (collection)
			- userId: uid (document)
				- username: string
				- profilePicture: string
```
