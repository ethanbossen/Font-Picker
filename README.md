# Font-Picker
This is a web application that allows users to search, select, and apply Google Fonts to their content. It uses the Google Fonts API to fetch a list of available fonts, displays them in a searchable dropdown, and dynamically loads the selected font for use in the app.

### Features
	•	**Searchable Font List**: Users can type in the search bar to filter the available fonts.
	•	**Dynamic Font Application**: Select a font from the list, and it will immediately be applied to the displayed text.
	•	**Load More Fonts**: If the user scrolls through the list of fonts, additional fonts are loaded on-demand.
	•	**External Links**: Users can visit Google Fonts directly to browse the full collection.

### Tech Stack
	•	**Next.js**: A JavaScript library for building user interfaces.
	•	**Mantine**: A modern React component library for building fast and accessible web apps.
	•	**Axios**: A promise-based HTTP client for making requests to external APIs.
	•	**Google Fonts API**: Provides access to Google Fonts to load and display web fonts.

## Set-Up and Running
1. clone repo
2. install dependencies: ```npm install```
3. navigate to ```FontPicker.tsx``` and replace API Key with your own
4. run with ```npm run dev```
