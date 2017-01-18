# Udacity Project - Public Transportation App

Application allows users to select a departure and arrival train station. The user will then see information about the two stations. The information provided may include connected stations on the path, arrival & departure times, or any other useful information. Application defaults to offline-first functionality with Service Worker. When the application is online the user should be able to see up to date information from the transit authority of choice. When offline the user should be able to continue to see route information they have accessed while online.

API from Washington Metropolitan Area Transit Authority ([WMATA](https://developer.wmata.com/)) is used and the Blue Line is chosen as an example.

- `npm start`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the build folder.