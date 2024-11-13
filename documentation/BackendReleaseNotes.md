# Backend Beta Release Notes

This document provides the necessary resources to get the backend server installed and running, as well as configuring the project to interface with the MongoDB database.

## Overview
1. [Prerequisites](#prerequisites) 
2. [Installation](#installation)
2. [Features](#features)

## Prerequisites
The following are assumed to be installed/available. Instructions to install each can be found at the corresponding link.
* [Node.js](https://nodejs.org/en) - Version 23.1.0+
* [Git](https://git-scm.com/downloads) - Version 2.39+
* Access to a terminal or command prompt

## Installation

Begin by opening the terminal, and navigating to the directory where the project will be saved. Run

    git clone https://github.com/ishaan-shetty/Yum-Fm.git

Navigate into the newly created folder, and into the server subfolder with

    cd Yum-FM/server

Install the required Node packages by running

    npm install

At this point, the server should be runnable, however it won't be able to access the database. To fix this, do the following, making sure to replace `username_here` and `password_here` with your appropriate credentials:

On Linux/MacOS:

    export DB_URI="mongodb+srv://username_here:password_here@yumfm.socqf.mongodb.net/yumfm_data?retryWrites=true&w=majority&appName=YumFM"

On Windows:

    set DB_URI="mongodb+srv://username_here:password_here@yumfm.socqf.mongodb.net/yumfm_data?retryWrites=true&w=majority&appName=YumFM"

Now the server should be able to access the database, and you can run the server with the following command:

    node server

## Features