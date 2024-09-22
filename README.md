
# 🎵 Retro Player Frontend

This project is the frontend application for the Retro Player, which allows users to upload, manage, and listen to their MP3 files stored on Google Drive. The frontend connects to a backend server that handles authentication, file management, and database interactions. The app provides a user-friendly interface with features such as playing, editing, and deleting tracks.

## 🚀 Project Purpose

The goal of this project is to provide a React-based frontend that allows users to interact with the backend service, enabling them to manage their music collection, listen to tracks, and have a dynamic and responsive experience.

## 🛠️ Technologies Used

- **React**: JavaScript library for building the user interface.
- **React Router**: For handling navigation between different routes (e.g., login, home).
- **useContext**: To manage and pass user authentication state across components.
- **Fetch API**: To communicate with the backend server for data retrieval and manipulation.
- **CSS**: For styling the user interface.
- **useState and useEffect**: React hooks for managing component state and lifecycle events.

## ⚙️ Getting Started

Follow these steps to set up and run the frontend application on your local machine.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd retro-player-frontend
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed on your machine. Then, install the necessary dependencies by running:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of your project with the following content:

```env
REACT_APP_BACKEND_URL=http://localhost:4000
```

This URL should point to the backend server that the frontend will interact with. Adjust it according to your backend service URL.

### 4. Run the Frontend Application

Start the frontend development server with the following command:

```bash
npm start
```

The application should now be running at `http://localhost:3000`.

## 📚 Key Components

### 1. `Home.jsx`
- The main page where users can view their uploaded tracks.
- Allows users to play, edit, and delete tracks.
- Uses the `MusicPlayer` and `SongContainer` components to display and manage the tracks.

### 2. `Login.jsx`
- The login page where users can authenticate by entering their username and password.
- Connects to the backend's login endpoint to verify user credentials.

### 3. `MusicPlayer.jsx`
- Handles the playback of the uploaded tracks.
- Features play, pause, next, previous, shuffle, and loop functionality.
- Displays the track's progress and allows users to seek within the track.

### 4. `SongContainer.jsx`
- Displays individual tracks in a list format.
- Allows users to play, edit, or delete tracks.

### 5. `CodeEffect.jsx`
- A decorative component that creates a dynamic and animated background using canvas.
- Generates moving dots that connect when they are close to each other.

### 6. `Progress.jsx`
- Handles the display of the track's progress bar.
- Allows users to seek within the track by dragging the slider.

### 7. `App.jsx`
- Acts as the main entry point for the React Router.
- Manages routing between the login page and the home page based on the user's authentication state.

### 8. `Usuario.jsx`
- Provides the user context using `createContext`.
- Shares user authentication data (`logado` and `id_user`) across different components.

## 🌐 API Communication

The frontend communicates with the backend through various endpoints to manage user authentication, upload tracks, retrieve tracks, update track details, and delete tracks. The backend URL is defined in the environment variables.

### API Endpoints Used
- **Login**: `POST /login`
- **Get User**: `GET /user/:id`
- **Get Tracks**: `GET /tracks/:id`
- **Upload Track**: `POST /upload`
- **Update Track**: `PUT /updateTrack/:id`
- **Delete Track**: `DELETE /delete-file/:id`
- **Logout**: `GET /logout`

## 📝 Styling and Assets

- The project includes a `estilos.css` file that manages the overall styling of the application.
- Custom icons and images for buttons (play, pause, shuffle, etc.) are stored in the `assets` directory.

## 💡 How to Use

1. Start the frontend by running `npm start`.
2. Access the application at `http://localhost:3000`.
3. Log in with your credentials, and the app will redirect you to the home page, where you can start managing your music tracks.
4. Use the player controls to listen to your music, edit track details, or delete tracks as needed.

## 💡 Future Improvements
- Implement user registration.
- Add playlist management for organizing tracks.
- Improve styling for better responsiveness on mobile devices.
- Enhance error handling and feedback for user actions.

## 📜 License
This project is licensed under the MIT License.

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.
