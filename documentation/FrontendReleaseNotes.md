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

### Testing the Frontend 
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
