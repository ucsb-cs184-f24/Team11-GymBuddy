# Main Contributions

1. NavBar and file restruturing
2. Profile Page
3. Edit Profile Page
4. Connecting attributes to the database such that they update in real time.
5. Item picker component
6. Height, weight, and gender Picker components
7. Set up BLOB storage in firebase
8. Set up profile pictures in our app

# In depth Summary

In the first couple of weeks of the quarter I was more focused on getting an understanding of Javascript and React Native as I had not worked with these technologies in depth before. After this for the MVP I spent most of my time changing the file structure in order to implement a Navigation Bar using Expo Router.

After this I got a lot of work done during HW04. Cory made a great design document that allowed me to implement a functional Instagram like profile page as a placeholder before putting in more GymBuddy specific UI changes. This involved frontend implementation for the profile and edit profile pages as wellas linking to the database in order to update Profile attributes in the edit page. 

In this edit page I created components for choosing height, weight, gender, and images. These components rely on a react-native/picker library.

In the later weeks I realized that profile pictures would not work as we were currently only storing URIs to local files. After realizing this I looked into firebase Storage in order to upload images to firebase. Ultimately this was implemented, but there are still issues with reloading profile pictures in a timely manner as I did not have the time to look into and implement caching/more efficient loading precedures. 
