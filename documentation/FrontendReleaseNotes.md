# Frontend 1.0 Release Notes

This document provides the necessary resources to get the frontend installed and running, as well as configuring the project to interface with the server backend.

## Overview
1. [Prerequisites](#prerequisites) 
2. [Installation](#installation)
3. [Features and Release Notes](#features-and-release-notes)

## Prerequisites
The following are assumed to be installed/available. Instructions to install each can be found at the corresponding link.
* [Node.js](https://nodejs.org/en) - Version 23.1.0+
* [Git](https://git-scm.com/downloads) - Version 2.39+
* Access to a terminal or command prompt

## Installation

Begin by opening the terminal, and navigating to the directory where the project will be saved. Run

    git clone https://github.com/ishaan-shetty/Yum-Fm.git

Navigate into the newly created folder, and into the client subfolder with

    cd Yum-FM/client

Install the required Node packages by running

    npm install

To put things into perspective, the 'client' folder refers to the mobile app itself. It has the code for everything the user will interact with when using the app.

One final step - you can run the app with the following command:-

    npx expo start
    
You're all set to enjoy a complete and robust experience with Yum.FM. Enjoy!

## Features and Release Notes

For the 1.0 release, the client application has various improved UI changes and functionalities implemented. 

### New/Modified in Beta Release
The following have been added following the beta release:

#### **1\. OpenAI Menu Scanner**
Our most exciting update for the 1.0 release of Yum.FM is the OpenAI menu scanner. This can be accessed by clicking on the camera icon to the left of the search bar on the search page. Clicking on the camera icon will prompt the user for access to their camera. If allowed, the app will now display the visuals of the user's camera. Simply point the camera at a menu and take a clear picture of it by clicking on the camera icon. You can then view the image by clicking on the popup on the bottom left to ensure the image is elligible. if you don't like the image you've taken, simply return to the camera by clicking on the back button and click on the trash can icon to delete the image. Then reclick a new one. Once you are satisfied with your image, click on the check mark icon on the bottom right. This will lead you to a page that says "Loading...". It might take a few seconds for the menu scanner to illustrate its results, due to it making calls to the OpenAI API. But with a little bit of patience, Voila! You are now looking at a list of all the menu items you took a picture of, where each menu item has a list of all the filters (restrictions and preferences) that it satisifies. Now you can easily pick an item curated to your wants and needs. Bon Appétit!
The OpenAI menu scanner is also a feature accessible through the "Upload Menu" button which can be accessed in the menu tab of each restaraunt that does not already have a webscrapped menu.

#### **2\. Login Page + Create Account Page**
There is now an improved login page for the application. Here a user will be prompted to enter their email and password to login, or if the user does not have an account, the user can now create one. We now store user profiles in the database, which have complete access to the application. Every created account is stored in the database, in order to gain a token to open the application. What does this mean in terms of user experience? Well, now the user can login and logout like they would in any other established app, and whenever the user hops back into the app, all their data is is saved, i.e. their profile settings, their filters, their favorites lists, and so on. 

#### **3\. Home Page Categories**
The functionality of the home page has been completely re-imagined. Instead of listing out the restaurants in a single flat list, we have a few different categories where the restaurants can be placed in based off their relation to the user. For example, we have a "Restaurants Closest To You" category which will display the restaurants closest to the user. Another category called "Restaurants For You", which will have its first criteria as satisfying as many of the user's filters, then the rest of the criteria follows in priority. These categories are currently non-trivially being sorted, but in the future, as part of our stretch features, we will implement these filtering options. At the moment, all the restaraunts in the app are around the Amherst area, thus most restaraunts are a similar distance from the user. The last category on this page is the "Favorites List". This category is now fully functional and is stored in the database for each user that has created an account. To add a restaraunt to their favorites, a user must simply click on the star button at the top left of each restaraunt card. The user can just as easily also remove restaraunts from their favorites.

#### **4\. Improved Search Feature**
Previously, the search feature required that you enter a word which belongs to the restaurant name that a user is searching for. This is unintuitive and requires extensive prior knowledge of the user in some scenarios. The improved search feature now only requires 2 letters to search and also is capable of taking in restriction and preference filters. For the 1.0, the filters have officially been implemented. What does this mean for the search feature? Well, now the user can set filters in their profile, and then make searches in the search bar. Therefore, if a restaraunt does not meet the restrictions set by the user, the restaraunt does not show up when the user searches for a restaraunt with a similar sub-string. Pretty cool right?

#### **5\. Restaurant Cards**
Throughout the application, restaurants are now displayed as "card" objects. This means whenever they are clicked on, it pulls up the restaurant card popup which stores the information about the restaurant. Here, a user can add the restaurant to their favorites, view basic information about the restaurant, or scroll through the menu items available there. If a menu is not available for the restaurant, then the user can add a menu for the restaurant using our new OpenAI menu scanner. 


#### **6\. Profile Page**
The UI on the profile page has been updated quite a bit with multiple buttons added for favorites list, sharing profile and logout. On the profile page, a user is able to edit their basic information, and view their favorites list by clicking on the respective button. Moreover, upon clicking the logout button, the user is prompted to confirm their action and is returned to the login page, where if the user logs in again, they are returned to the app with all their data saved. The "Tell A Friend" is currently not working since we haven't integrated it with popular social media apps.
The second tab on the profile page, the "Filters" tab, now leads the user to a list of filters (restrictions and preferences) in the form of a checklist. The user can select as many filters as they want, we will store this in our database so that whenever the user searches for restaraunts we can apply the corresponding features.

#### **6\. User Documentation/Help Buttons**
We now how User Documentation that can be accessed through a Help Button on each of the screens of the app. To access it, simply click on the '?' icon on the bottom right of each page. You will now be able to see specific instructions on how to use the app, incase our amazing UI confuses you. Each help button leads to information that corresponds to the screen you are currently on: this function is implemented for the Login, Home, Search, and Profile screens. These help buttons are also a great way for the user to learn what features the app has and how th user can maximize the app's potential.

### Known Issues + Future Improvements

1. User cannot edit or import their own image on the profile page. 

These are just some of the bugs + improvements which will be addressed by our team in the near future, we keep track of these using our Jira which is linked here:
 https://ishetty.atlassian.net/jira/software/projects/KAN/boards/1


## Testing the Frontend 
There are tests written in multiple folders through the client code. These tests can be executed with the following steps:

1. Open up the project repo and create a new terminal.

2. Navigate to the client folder
       
        cd client\app

3. Run all tests 

        npm test

The tests are run through Jest, and results will display in the terminal, indicating passing, failing tests, and any assertion errors.

### Test Coverage Summary

#### **1\. ExploreTab Search Functionality**

These tests confirm that users can search for a restaurant by different keywords and retrieve expected results:

-   **Test 1:** Searches for "Pasta E Basta" by full name and verifies that it appears in the search results.
-   **Test 2:** Searches using a partial name "Pasta" and verifies that "Pasta E Basta" is still returned in the results.
-   **Test 3:** Searches using another partial name "Basta" and confirms that "Pasta E Basta" is included in the results.

Each test simulates a user typing a search term, submitting it, and waiting for the results to display, ensuring that the component handles different search inputs correctly.

#### **2\. ExploreTab Menu Item Retrieval**

This test ensures that a user can search for "Pasta E Basta," open the restaurant's details, navigate to the menu, and see if a specific item, "Arancini," is present in the list:

-   **Test 4:** Performs a search for "Pasta E Basta," selects it from the results, switches to the "Menu" tab, and checks if "Arancini" is listed as a menu item. This verifies that users can locate specific items on a restaurant's menu.

### Explanation of Integration Testing and Use Case

These are integration tests because they validate the interaction between different components and simulate real user flows through the application:

-   **Multiple Component Interaction**: The tests check how the `ExploreTab` and `RestaurantCard` components work together to retrieve search results and display a detailed menu.
-   **API Dependency**: The tests hit the actual API to fetch search results and restaurant menu data, ensuring proper integration between the backend and frontend.
-   **End-to-End User Flow**: By simulating typing in the search bar, pressing Enter, and navigating through tabs, these tests mimic how a user would search for a restaurant and view its menu items.
