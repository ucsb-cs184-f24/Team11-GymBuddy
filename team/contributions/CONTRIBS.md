**Aavash Adhikari**

My main contributions to this application were the stats page, the initial framework for the workout page, and the basic user experience and bug fixes. I recently implemented the stats page that shows your workout analytics including the number of workouts throughout the week, month, and year as well as what body parts you worked out on any given day. I also did the initial framework for the workout page which allows you to create new workouts and choose what workout you want to do filtered by body part(i.e. "Biceps" -> "curls", "hammer curls", etc.). You then chose how many sets of each workout you completed and how many reps in each set. Aaron eventually reworked this page, but the filter and workout functionality remain unchanged. The main changes were an overhauled UI and integration to the home page where a new workout from the workout page would also be displayed on the home page. I also did a few bug fixes with the keyboard where you could not tap out of the keyboard without pressing "return". However, I think that someone else's pull request that also fixed this got merged before mine did. I also added haptic feedback, which enhanced the user experience by offering basic user feedback whenever a button is pressed.

**Aaron Rosales** 

Over the course of the project I made many contributions to the front end and UI of the app. I made the original home page, however we never ended up using my iteration. I also made a visual to be paired with the home page, but due to the use of a different home page, it never got fully implemented. I also made a massive overhaul to the workout page, doing a UI change so that the user can add weight, sets, and reps. It also would show when someone actually had a workout selected, and the workouts were listed out. I also made the original search bar, so that the user can find other people's accounts via username or first or last name.

**Chris Woolson**

My main contribution towards the project has been the database. At first the database was a Firebase Realtime Database. I created the database, structure and functions to use towards the frontend for this. Later, we descided to switch to Firebase Firestore. I set this database up as well as well as making most of the service file functions.

These aspects may be underrepresented in the github commits.

I also worked fixing bugs:
- Blank Screen
- Duplicate Key error

I added a loading animation for the home screen

I created the frontend (and backend) for adding friends through the search page.

I added a refresh function for the home page by swiping down on the list.


**Sawyer Rice**

Over the course of the project, my main contributions have been focused in on the profile page. I created the original draft of the page, and the first functionality with the page simply displaying name, email, and showing a profile picture. I gradually added pieces to this page, such as the ability to select a profile picture from your camera roll.

More recently, I worked on friend adding functionality to the profile page. This includes the ability to accept and deny friend requests, and the ability to see your current list of followers and following users. This further involved getting an accurate number of following and follower requests from the database.

Further, leading up to the MVP deadlilne, I spent a significant amount of time modifying our UI to be more intuitive and cohesive.

During the week of November 24, I had significantly less commits as I was assigned evaluation for HW 4, and my work for HW 4 did not involve coding, but rather focused on in person data collection and interviews.

**Tyler Canepa**

I spent a lot of my time working on different sections of the app but a majority of it was dealing with the overall UI and working on the authentication pages like the Registration as well as working on trying to set up the framework of the original Home page.

I set up the Registration pages in the early stages to take in a name, email, and password, which would then call our database and update each individual user with corresponding information. Currently, I am working on furthering the information that gets passed in for each user, creating a new page that ties to the registration that also gets a user's gender, height, weight, and bio, which will be displayed on their profile.

I also set up the framework for how the home page originally looked. Since then, there have been many changes, but originally I implemented a design that mimicked Instagram in the sense that you could see the username, an image, and then the workout they did. It was very barebones at the time for the MVP considering we didn’t have a lot of other workout information implemented at the time, which is now displayed.

For the MVP, I worked a lot on the UI and making sure we had a consistent theme across all of our pages as well as any last-minute minor error-catching that could easily and quickly be fixed before presenting. I worked on recording the MVP video with Sawyer and Aaron and edited the video myself. I also ran the first retro and worked on getting everything situated for the MVP, including the tagging and putting any finishing touches.
