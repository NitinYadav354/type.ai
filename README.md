# Type.AI ⌨️

![Live Status](https://img.shields.io/badge/Status-Live-success)
![Version](https://img.shields.io/badge/Version-1.0-blue)

<div align="center">
  <h1 align="center">Type.AI ⌨️</h1>
  <p align="center">
    A minimalist, high-performance typing engine with microscopic keystroke analytics and AI coaching.
  </p>
  <p align="center">
    <a href="https://typeai.nitinyadav.dev"><strong>Live Demo »</strong></a>
  </p>
</div>

<br />

##  Key Features
* **AI-Generated Custom Tests:** Completes a closed-loop learning cycle by analyzing your mistakes and generating brand new, custom typing tests on the fly, specifically engineered to target your identified weaknesses.
* **AI-Powered Typing Coach:** Utilizes Google's Gemini AI to analyze raw keystroke micro-timing, identifying specific finger weaknesses, rhythmic inconsistencies, and trouble spots.
* **Closed-Loop Adaptive Practice:** The AI automatically generates highly targeted practice paragraphs engineered specifically to stress-test your identified weaknesses.
* **Zero-Latency Sound Engine:** Features a hardware-accelerated sound board utilizing the Web Audio API to process keystroke audio with **<5ms latency**, overriding standard browser DOM audio delays.
* **Speed Variance Heatmap:** An intelligent grading system that highlights specific characters where you hesitated, allowing for visual feedback on your typing cadence.
* **Google OAuth Integration:** Secure, one-tap login using `@react-oauth/google`.
* **Intelligent Session Merging:** Play as a guest immediately. When you log in, your previous local session data is seamlessly merged into your permanent cloud profile.
* **Multi-line & Code Support:** Fully supports tabs (`\t`) and line breaks (`\n`) for practicing programming syntax and formatting.

##  Tech Stack

**Frontend (Decoupled Architecture)**
* React.js (Vite)
* Custom Hooks (Orchestrator Pattern) & Web Audio API
* Custom CSS (Native animations and flexbox layouts)
* Vercel (Edge CDN Deployment)

**Backend & Database**
* Node.js & Express.js
* Google Gemini API (`@google/genai`)
* MongoDB Atlas
* JSON Web Tokens (JWT) for secure session handling
* Render (Backend Hosting)

---

##  Running Locally

To run Type.AI on your local machine, you will need to set up both the frontend and backend environments.

### 1. Clone the repository
```bash
git clone [https://github.com/NitinYadav354/type.ai.git](https://github.com/NitinYadav354/type.ai.git)
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

### Performance Reports
Performance after v1 deployment: </br>
https://pagespeed.web.dev/analysis/https-typeai-nitinyadav-dev/ojedgf2qla?form_factor=desktop

### Contributing
* Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/NitinYadav354/type.ai/issues).


