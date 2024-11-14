# Frontend Beta Release Notes

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

For the beta release, the client application has various improved UI changes and functionalities implemented. 

### New/Modified in Beta Release
The following have been added following the alpha release:

#### **1\. Login Page + Create Account Page**
There is now a login page for the application. Here a user will be prompted to enter their email and password to login. Currently, we don't store user profiles in the database, so as long as you enter valid email and password according to the string regex, then you can access the application. In the future, we will require that you account is stored in the database, in order to gain a token to open the application.

#### **2\. Home Page Categories**
The functionality of the home page has been completely re-imagined. Instead of listing out the restaurants in a single flat list, we have a few different categories where the restaurants can be placed in based off their relation to the user. For example, we have a "Restaurants Closest To You" category which will display the restaurants closest to the user. Another category called "Restaurants For You", which will have its first criteria as satisfying as many of the user's filters, then the rest of the criteria follows in priority. These categories are currently non-trivially being sorted and don't have legitimate functionality, but in the future we will implement these filtering options. We believe users will like this feature as it allows them to find what they are searching for quicker, and browse with more ease.

#### **3\. Improved Search Feature**
Previously, the search feature required that you enter a word which belongs to the restaurant name that a user is searching for. This is unintuitive and requires extensive prior knowledge of the user in some scenarios. The improved search feature now only requires 2 letters to search and also is capable of taking in restriction and preference filters. However, since the filters haven't been implemented yet, that functionality isn't available in the search yet. In the future, we plan on improving the search feature even further to provide the "most likely" restaurants they are looking for, in the case that none of the key letters even match.

#### **4\. Restaurant Cards**
Throughout the application, restaurants are now displayed as "card" objects. This means whenever they are clicked on, it pulls up the restaurant card popup which stores the information about the restaurant. Here, a user can add the restaurant to their favorites, view basic information about the restaurant, or scroll through the menu items available there. If a menu is not available for the restaurant, then the user can add a menu for the restaurant. 
We do not yet have the functionality for adding restaurants to favorites list, or allowing the user to add a menu for the restaurant, but they are coming up in the next release.

#### **5\. Profile Page**
The UI on the profile page has been updated quite a bit with multiple buttons added for favorites list, sharing profile and logout. However, their actual functionalities have not been fully completed yet. However, on the profile page, a user is able to edit their basic information.

### Known Issues + Future Improvements

1. Camera and map buttons on the search page are not functioning. 
2. User cannot edit or import their own image on the profile page. 
3. Favoriting a restaurant does not actually add the restaurant to the favorites list.
4. Clicking upload menu when a restaurant doesn't contain a menu, does not do anything.
5. The keyboard on the login page blocks the view of the login details and box where the user can type. This makes it impossible to see what you are typing while the keyboard is open.

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
