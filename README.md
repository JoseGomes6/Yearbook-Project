# Digital Yearbook – Desktop App (Electron & React)

# Live Demo

The application is deployed and running on the Department's server:

URL: http://10.17.0.30

## Application Screenshot

![Digital Yearbook Interface](./app-screenshot.png)

## Project Description

The **Digital Yearbook** is a modern and responsive application that serves as an interactive digital yearbook for a class.  
Students can create and customize their personal profiles, showcasing personal information, academic achievements, and a favorite quote.  
Users can also leave **signatures (messages)** on each other's profiles, simulating a traditional yearbook experience in a digital format.

The project is built with **React** for the user interface, **Electron** for the desktop application, and **Node.js + MongoDB** for backend data persistence and authentication.

# Student Contributions

-José Pedro Gomes - 2025171142 - ### Full Stack Development: Backend API (Node/Express), Database Design (MongoDB), Frontend UI (React), Desktop Integration (Electron), and Server Deployment (PM2).

## Technologies Used

- **Frontend:** React
- **Desktop App:** Electron
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Styling:** Modern CSS

---

## Execution Instructions

To run the application, the **Backend** and **Frontend** must be running simultaneously.  
Electron uses the running React app to display the desktop version.

---

### 1 - Backend Setup (Server & Database)

1. Navigate to the backend folder:

   ```bash
   cd backend

   ```

2. Install dependencies:
   npm install

3. Create a .env file in the backend folder and add:
   MONGODB_URI=your_mongodb_connection_string

4. Start the backend server:
   node --watch server.js

### 2 - Frontend Setup (React – Browser)

1. Navigate to the UI folder:
   cd ui

2. Install dependencies:
   npm install

3. Start the React application:
   npm start

### 3 - Desktop Application (Electron)

Make sure the React application is already running.

1. Open a new terminal

2. Navigate to the Electron folder:
   cd ui/electron

3. Start the Electron app:
   npx electron electron.js

# Database Initialization

The application was initialized and exported using mongoexport. To restore the default state locally, use the following mongoimport command:

mongoimport --uri="YOUR_MONGODB_URI" --collection=users --file=database_init.json
