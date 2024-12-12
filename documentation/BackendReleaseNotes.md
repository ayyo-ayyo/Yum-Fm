# Backend 1.0 Release Notes

This document provides the necessary resources to get the backend server installed and running, as well as configuring the project to interface with the MongoDB database.

## Overview
1. [Prerequisites](#prerequisites) 
2. [Installation](#installation)
3. [Features and Release Notes](#features--release-notes)
4. [Testing](#test-coverage-summary)

## Prerequisites
The following are assumed to be installed/available. Instructions to install each can be found at the corresponding link.
* [Node.js](https://nodejs.org/en) - Version 23.1.0+
* [Git](https://git-scm.com/downloads) - Version 2.39+
* Access to a terminal or command prompt

## Installation

Begin by opening the terminal, and navigating to the directory where the project will be saved. Run

    git clone https://github.com/ishaan-shetty/Yum-Fm.git

Navigate into the newly created folder, and into the server subfolder with

    cd Yum-Fm/server
    
Install the required Node packages by running

    npm install

At this point, the server should be runnable, however it won't be able to access the database. To fix this, do the following, making sure to replace `username_here` and `password_here` with your appropriate credentials:

On Linux/MacOS:

    export DB_URI="mongodb+srv://username_here:password_here@yumfm.socqf.mongodb.net/yumfm_data?retryWrites=true&w=majority&appName=YumFM"

On Windows:

    set DB_URI="mongodb+srv://username_here:password_here@yumfm.socqf.mongodb.net/yumfm_data?retryWrites=true&w=majority&appName=YumFM"

Now the server should be able to access the database, and you can run the server with the following command:

    node server

## Features & Release Notes

For the beta release, the server implements several HTTP endpoints/routes that allow the client access to the MongoDB database. 

### New/Modified in Beta Release
The following have been added following the alpha release:

### `GET /api/login?user_name=<user name>&password=<password>`
* **Description:** Returns an HTTP response with the corresponding User for the given user name and password.

* **Supported Types**: N/A


### `POST /api/login`
* **Description:** Creates a new User who has signed in for the first time. Expects a user_id, user_name, and user_password to be provided in the request body.

* **Supported Types**: N/A

### `GET /api/search?q=<text query>&type=<type>&mfilters=<mfilters>&pfilters=<pfilters>`
* **Description:** Searches the database for any documents of the given type by name based on the text query. **New in Beta:** Optionally, mfilters is a comma separated list of filters that each type has to fulfill in order to be returned. Optionally, pfilters is a comma separated list of preferred filters to sort the returned documents by, with documents matching more pfilters coming first in the search results.

* **Supported Types:** restaurants, menuitems


### Included since Alpha Release
The remaining were implemented in the alpha release.

### `GET /api/<type>`
* **Description:** Returns an HTTP response with a representation of all documents for the corresponding type

* **Supported Types**: restaurants, menu items, menus, preferences, restrictions, users

### `GET /api/<type>/<id>`
* **Description:** Returns an HTTP response with a document for the corresponding type that matched the given _id, or nothing if the id didn’t exist

* **Supported Types**: restaurants, menu items, menus, preferences, restrictions, users

### `POST /api/<type>`
* **Description:** Creates a new document in the database for the given type. The data for this new document must be provided in the request body and match the type.

* **Supported Types**: restaurants, menu items, menus, preferences, restrictions, users

### `DELETE /api/<type>/<id>`
* **Description:** Deletes the specified document for the given type if a document's _id exactly matches the provided id.

* **Supported Types:** restaurants, menu items, menus, preferences, restrictions, users

### `PUT /api/<type>/<id>`
* **Description:** Update the document for the specified type by the given _id with the values given in the body of the request

* **Supported Types:** restaurants, menu items, menus, preferences, restrictions, users

## Testing the Backend 
There are several unit tests written in the `server\__tests__` folder. These tests can be executed with the following steps:

1. Open up the project repo and create a new terminal.

2. Navigate to the server folder
       
        cd server

3. Run all tests 

        npm test

The tests are run through Jest, and results will display in the terminal, indicating passing, failing tests, and any assertion errors.

### Test Coverage Summary
* **Route Tests:** Checks that all routes are functioning.

    * Ensures that each database route is able to fetch from the corresponding database table, and returning an error code of 404 or 200 depending on the existence of data in the table.
* **General Search Tests:** Verifies that all required query parameters are present.

    * Ensures that requests without a query (q) parameter or type (type) parameter return a 400 status code for invalid requests.
* **Restaurant Search Tests:** Checks search functionality specifically for restaurant results.

    * Tests that a search with a full restaurant name returns the expected restaurant with the correct name and description.
    * Confirms that a partial search term (e.g., Oce) returns results that include the target restaurant ("Ocean Restaurant").
    * Ensures that a search with a non-existent restaurant name returns an empty array, indicating no results.
    * Validates that searches with filter parameters (mfilters) return only the results matching those filter conditions.*

* **Menu Item Search Tests:** Checks search functionality for menu items.

    * Ensures that a search with a full menu item name returns the correct item with the expected name and price.
    * Verifies that a partial search term (e.g., sa) returns results that include the target item ("sandwich").
    * Confirms that a search with a non-existent menu item name returns an empty array, indicating no results.

These tests provide coverage for valid and invalid inputs across the /search endpoint, ensuring the server’s correct response to various search queries and filter conditions.
