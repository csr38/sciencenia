# ScienCENIA Hub App

## Setup

When initializing a new development environment, you will want do the following:
- Install [Node.js LTS](https://nodejs.org/en/download/package-manager/all) (Node 20.x at the time of writing) and [Bun](https://bun.sh/docs/installation).
- Follow the [Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment/) guide in the Expo docs.
  - You'll want to select "Development build", as we're using CNG and not Expo Go.
  - After selecting "Development build", you'll want to **disable** "Build with Expo Application Services (EAS)".
  - When following the instructions, substitute any `npm` commands with `bun` (recommended).
- Enter the repo, and run `bun install` to install the dependencies.
- Fill out the `.env` file with the necessary environment variables. See `.env.template` as a reference.
  - Right now this is just the Auth0 client ID and domain.
- Run `bun start` to start the development server.

You might optionally want to also install [Reactotron](https://docs.infinite.red/reactotron/) as a debugging tool. Once opened, you should reload the app via Reactotron itself to connect to a running app. To track state changes, you can start by subscribing to `*`, which will show you the root Zustand store.

## Configuring a developer Auth0 app
The tl;dr is:
- Create a new Auth0 application, with application type "Native".
- From the **Settings** tab, copy over the domain and client ID to the `.env` file.
- In both **Allowed Callback URLs** and **Allowed Logout URLs**, add the following:
  ```
  com.cenia.scienceniahub.auth0://YOUR_DOMAIN/ios/com.cenia.scienceniahub/callback, com.cenia.scienceniahub.auth0://YOUR_DOMAIN/android/com.cenia.scienceniahub/callback
  ```
  Replacing both instances of `YOUR_DOMAIN` with your Auth0 domain.


## Application Overview

### Purpose and Features

ScienCENIA Hub is a mobile application designed to serve as a central hub for CENIA (Centro Nacional de Inteligencia Artificial) students and researchers. 

The app aims to:

* Provide easy access to CENIA's scientific documentation.
* Allow students to manage their personal information and academic data.
* Facilitate the process of requesting funding for travel, conferences, and other research-related activities.
* Enable students to apply for and track the status of incentive applications.

### Key Screens and Functionality

The ScienCENIA Hub app includes the following key screens:

* **Login Screen:** Allows users to authenticate using their CENIA credentials via Auth0.
* **Funds Section:**
    * **Funds List View:** Displays a list of available calls for funds and incentives.
    * **Create Fund Request:** Enables students to submit funding requests for travel, conferences, etc.
    * **Fund Application Screen:** Lists all fund applications submitted by the user.
    * **Fund Application Detail Screen:** Provides detailed information about a specific fund application.
    * **Create Incentive Request:** Allows students to apply for available incentives.
* **Settings Screen:** 
    * **Edit Student Profile:** Allows students to update their personal and academic information.
    * **Edit Thesis Information:** Enables students to manage details about their thesis project.
    * **Logout:** Allows users to sign out of the application.

## Proyect's Structure

The project structure is based on Ignite so will look similar to this:

```
ignite-project
├── app
│   ├── components
│   ├── config
│   ├── i18n
│   ├── models
│   ├── navigators
│   ├── screens
│   ├── services
│   ├── theme
│   ├── utils
│   └── app.tsx
├── assets
│   ├── icons
│   └── images
├── test
│   ├── __snapshots__
│   ├── mockFile.ts
│   └── setup.ts
├── README.md
├── android
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── keystores
│   └── settings.gradle
├── ignite
│   └── templates
|       |── app-icon
│       ├── component
│       ├── model
│       ├── navigator
│       └── screen
├── index.js
├── ios
│   ├── IgniteProject
│   ├── IgniteProject-tvOS
│   ├── IgniteProject-tvOSTests
│   ├── IgniteProject.xcodeproj
│   └── IgniteProjectTests
├── .env
└── package.json

```

### ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the `app` directory looks similar to the following:

```
app
├── components
├── config
├── i18n
├── models
├── navigators
├── screens
├── services
├── theme
├── utils
└── app.tsx
```

**components**
This is where your reusable components live which help you build your screens.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigators**
This is where your `react-navigation` navigators will live.

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truly shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application.

### ./assets directory

This directory is designed to organize and store various assets, making it easy for you to manage and use them in your application. The assets are further categorized into subdirectories, including `icons` and `images`:

```
assets
├── icons
└── images
```

**icons**
This is where your icon assets will live. These icons can be used for buttons, navigation elements, or any other UI components. The recommended format for icons is PNG, but other formats can be used as well.

Ignite comes with a built-in `Icon` component. You can find detailed usage instructions in the [docs](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md).

**images**
This is where your images will live, such as background images, logos, or any other graphics. You can use various formats such as PNG, JPEG, or GIF for your images.

Another valuable built-in component within Ignite is the `AutoImage` component. You can find detailed usage instructions in the [docs](https://github.com/infinitered/ignite/blob/master/docs/Components-AutoImage.md).

How to use your `icon` or `image` assets:

```
import { Image } from 'react-native';

const MyComponent = () => {
  return (
    <Image source={require('../assets/images/my_image.png')} />
  );
};
```

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find templates you can customize to help you get started with React Native.

### ./test directory

This directory will hold your Jest configs and mocks.

### Key Directories and Files

* **`app/components`:** Contains reusable UI components used throughout the application.
* **`app/navigators`:** Defines the application's navigation structure using `react-navigation`.
* **`app/screens`:** Contains the screen components representing different views within the app (e.g., Login, Funds List, Create Fund Request, Settings).
* **`app/services`:** Houses the API service used to interact with the backend server. This includes functions for fetching data, submitting requests, and managing user authentication.
* **`app/theme`:** Defines the application's styling, including colors, spacing, and typography.
* **`app/utils`:** Contains helper functions and utilities used across the application.

### Screen Components

Each screen component in the `app/screens` directory represents a specific view within the application. These components are responsible for fetching data, displaying UI elements, handling user interactions, and navigating between screens.

**Example: `FundApplicationScreen.tsx`**

This screen component displays a list of the user's fund applications. 

* It fetches the user's email from the global store.
* It sets up the screen header.
* Upon mounting, it makes an API request to retrieve the user's fund requests.
* It displays a loading indicator while fetching data.
* If requests are retrieved successfully, it renders them in a list using `FlatList` and `FundingRequestPreview`.
* If no requests are found, it displays a message indicating that no requests are available.
* When a request is pressed, it navigates to the `FundApplicationDetailScreen`, passing the request details.

### API Service

The `app/services/api` file defines the API service used to interact with the backend server. It includes functions for:

* `getFundRequests`: Retrieving a user's fund requests.
* `createFundRequest`: Submitting a new fund request.
* `getApplicationPeriods`: Fetching available incentive application periods.
* `getUserIncentives`: Retrieving a user's incentive applications.
* `createIncentiveRequest`: Submitting a new incentive application.
* `getUserByEmail`: Retrieving user details by email.
* `updateUser`: Updating user profile information.
* `createThesis`: Creating a new thesis entry for a user.
* `getThesisByEmail`: Retrieving thesis details by user email.
* `updateThesis`: Updating thesis information.

## Running Maestro end-to-end tests

Follow our [Maestro Setup](https://ignitecookbook.com/docs/recipes/MaestroSetup) recipe from the [Ignite Cookbook](https://ignitecookbook.com/)!