# Type.AI ⌨️

![Live Status](https://img.shields.io/badge/Status-Live-success)
![Version](https://img.shields.io/badge/Version-1.0-blue)

<div align="center">
  <h1 align="center">Type.AI ⌨️</h1>
  <p align="center">
    A minimalist, high-performance typing engine with microscopic keystroke analytics.
  </p>
  <p align="center">
    <a href="https://typeai.nitinyadav.dev"><strong>Live Demo »</strong></a>
  </p>
</div>

<br />

## ✨ Key Features

* **Minimalist Dark-Mode UI:** Distraction-free interface with a custom cursor and fluid animations.
* **Speed Variance Heatmap:** An intelligent grading system that highlights specific characters where the user hesitated, allowing for targeted practice.
* **Multi-line & Code Support:** Fully supports tabs (`\t`) and line breaks (`\n`) for practicing programming syntax and formatting.
* **Google OAuth Integration:** Secure, one-tap login using `@react-oauth/google`.
* **Guest Session Merging:** Play as a guest immediately. When you decide to log in, your previous local session data is intelligently merged into your permanent cloud profile.
* **Real-time Analytics:** Tracks WPM, accuracy, raw time, and specific missed keys.

## 🛠️ Tech Stack

**Frontend (Decoupled Architecture)**
* React.js (Vite)
* Custom CSS (Native animations and flexbox layouts)
* Vercel (Edge CDN Deployment)

**Backend & Database**
* Node.js & Express.js
* MongoDB Atlas
* JSON Web Tokens (JWT) for secure session handling
* Render (Backend Hosting)

---

## 🚀 Running Locally

To run Type.AI on your local machine, you will need to set up both the frontend and backend environments.

### 1. Clone the repository
```bash
git clone https://github.com/NitinYadav354/type.ai.git
```
### 2. Backend Setup
Navigate to the backend directory, install dependencies, and set up your environment variables.
```bash
cd typeai-backend
npm install
```

Create a .env file in the backend root:
```
MONGO_URI=mongodb+srv://<your-cluster-url>
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
# or: node index.js
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies.
```bash
cd typeai-frontend
npm install
```
Create a .env file in the frontend root:
```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```
Start the Vite development server:
```bash
npm run dev
```

### Architecture Notes
* Type.AI utilizes a dual-deployment strategy to maximize speed and minimize costs:
* The static frontend is distributed globally via Vercel's CDN, ensuring instant load times.
* The backend runs on a Render web service, secured by strictly configured CORS policies that only accept requests from the authenticated frontend domain.

### Contributing
* Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/NitinYadav354/type.ai/issues).


