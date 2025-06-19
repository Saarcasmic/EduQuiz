# EduQuiz: AI-Powered Quiz Generator 🧠✨

![image](https://github.com/user-attachments/assets/695a710b-e627-4401-b164-bcc89fcb1128)


## Table of Contents 📖

- [About The Project](#about-the-project-)
  - [Features](#features-)
  - [Built With](#built-with-)
- [Live Demo](#live-demo-)
- [Architecture Workflow](#architecture-workflow-)
  - [1. User & Frontend Interaction](#1-user--frontend-interaction-react-on-vercel-)
  - [2. Backend Processing](#2-backend-processing-flask-on-render-)
  - [3. AI Quiz Generation](#3-ai-quiz-generation-google-gemini-)
  - [4. Database & Authentication](#4-database--authentication-supabase-)
  - [High-Level Flow](#high-level-flow-)
- [Getting Started](#getting-started-)
  - [Prerequisites](#prerequisites-)
  - [Installation (Local Development)](#installation-local-development-)
- [Usage](#usage-)
- [Automated Testing](#automated-testing-)
- [Deployment](#deployment-)
  - [Backend (Flask)](#backend-flask-)
  - [Frontend (React)](#frontend-react-)
- [Future Enhancements](#future-enhancements-)
- [Contributing](#contributing-)
- [License](#license-)
- [Acknowledgments](#acknowledgments-)


## About The Project 🚀

EduQuiz is an intelligent web application designed to revolutionize the way students and educators prepare for assessments. Leveraging the power of Google's Gemini AI, EduQuiz takes raw lecture notes or any textual content and instantly generates a comprehensive, multiple-choice quiz. This project aims to provide a quick, efficient, and personalized way to reinforce learning and assess comprehension. 📚

### Features ✨

  * **AI-Powered Quiz Generation:** Upload or paste lecture notes/text, and Gemini AI crafts relevant multiple-choice questions with options. 🤖
  * **User Authentication:** Secure user registration and login powered by Supabase Auth. 🔐
  * **Intuitive UI:** A clean, responsive user interface built with React and Tailwind CSS for a seamless experience. 💅
  * **Quiz Display & Interaction:** Presents generated quizzes in an easy-to-read format, allowing users to select answers. ✅

### Built With 🛠️

EduQuiz is a full-stack application utilizing a modern tech stack:

**Frontend:** 🖥️

  * [React](https://react.dev/) (JavaScript library for building user interfaces) ⚛️
  * [Vite](https://vitejs.dev/) (Fast frontend build tool) ⚡
  * [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework) 🎨
  * [React Router DOM](https://reactrouter.com/en/main) (For navigation) 🛣️

**Backend:** ⚙️

  * [Flask](https://flask.palletsprojects.com/) (Python micro web framework) 🐍
  * [Google Gemini API](https://ai.google.dev/models/gemini) (For AI-powered quiz generation) ✨
  * [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/) (Handling Cross-Origin Resource Sharing) 🔗

**Database & Authentication:** 🗄️

  * [Supabase](https://supabase.com/) (Open Source Firebase Alternative - PostgreSQL database with built-in authentication services) 🌿

-----

## Live Demo 🌐

Experience EduQuiz live\! Click the links below to try it out:

  * **App Link:** [[EduQuiz](https://edu-quiz-psi.vercel.app/)] 🚀


##  Architecture Workflow 🚀

This workflow outlines the core interactions between the main components of your EduQuiz application.
![diagram](https://github.com/user-attachments/assets/4b70aff7-4f7a-4219-941b-b29339a05ef2)


---

### 1. User & Frontend Interaction (React on Vercel) 🌐

* **What it is:** Your React application, built with Vite and deployed on **Vercel**. This is what the user sees and interacts with directly in their web browser.
* **Role:**
    * Presents the user interface (UI).
    * Captures user input (login details, lecture notes).
    * Displays quizzes and results.
* **Sends to:** Your Backend (Flask).

---

### 2. Backend Processing (Flask on Render) ⚙️

* **What it is:** Your Flask application, deployed on **Render**. This is the brain that handles all the logic and connects different services.
* **Role:**
    * Receives requests from the **Frontend**.
    * Manages user authentication and talks to **Supabase Auth**.
    * Sends lecture notes to **Google Gemini AI** for quiz generation.
    * Receives quiz data from **Google Gemini AI**.
    * Sends quiz data or authentication responses back to the **Frontend**.
* **Sends to:** Google Gemini AI and Supabase.
* **Receives from:** Google Gemini AI and Supabase.

---

### 3. AI Quiz Generation (Google Gemini) ✨

* **What it is:** Google's powerful AI model.
* **Role:** Takes lecture notes sent by the **Backend** and intelligently creates multiple-choice quiz questions and answers.
* **Sends to:** Your Backend (Flask).

---

### 4. Database & Authentication (Supabase) 🔐

* **What it is:** A robust, open-source database (PostgreSQL) with built-in authentication services.
* **Role:**
    * Securely handles **user registration** and **login**.
    * Stores user data and potentially quiz-related data.
* **Sends to:** Your Backend (Flask) (authentication tokens, user data).
* **Receives from:** Your Backend (Flask) (user credentials).

---

### High-Level Flow 🔄

1.  **User interacts with Frontend (on Vercel).**
2.  **Frontend sends requests (e.g., login, generate quiz) to Backend (on Render).**
3.  **Backend processes requests:**
    * For authentication, it talks to **Supabase**.
    * For quiz generation, it talks to **Google Gemini AI**.
4.  **Backend receives data** from Supabase or Google Gemini AI.
5.  **Backend sends responses back to Frontend.**
6.  **Frontend displays** the results to the user.

---
## Getting Started 🏁

To get a local copy up and running, follow these simple steps.

### Prerequisites ✅

Make sure you have the following installed on your local machine:

  * **Node.js & npm** (for the React frontend) 🟢
      * [Download Node.js](https://nodejs.org/en/download/) (npm is included)
  * **Python 3.x** (for the Flask backend) 🐍
      * [Download Python](https://www.python.org/downloads/)
  * **pip** (Python package installer, usually comes with Python) 📦
  * **Git** (for cloning the repository) 🐙
      * [Download Git](https://git-scm.com/downloads)
  * **Supabase Project:** You'll need your own Supabase project URL and Anon Key. 🔑
      * [Sign up for Supabase](https://supabase.com/dashboard/sign-up)

### Installation (Local Development) ⬇️

This project uses a monorepo structure, with the frontend in `client/` and the backend in `server/`.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Saarcasmic/EduQuiz/.git
    cd [eduquiz]
    ```

2.  **Backend Setup (`server/`):**
    a.  **Navigate to the server directory:**
    ` bash cd server  `
    b.  **Create and activate a virtual environment:**
    ` bash python -m venv venv # On Windows: .\venv\Scripts\activate # On macOS/Linux: source venv/bin/activate  `
    c.  **Install Python dependencies:**
    ` bash pip install -r requirements.txt  `
    d.  **Create a `.env` file** in the `server/` directory and add your Supabase and Gemini API credentials:
    `SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL" SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY" GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"`
    e.  **Run the Flask backend:**
    `` bash flask run # Or, if your main app file is named `app.py` and app instance `app`: # FLASK_APP=app.py flask run  ``
    The backend will typically run on `http://localhost:5000`. 🏃‍♂️

3.  **Frontend Setup (`client/`):**
    a.  **Open a new terminal tab/window** and navigate to the client directory (from the project root):
    ` bash cd ../client  `
    b.  **Install Node.js dependencies:**
    ` bash npm install  `
    c.  **Create a `.env.local` file** in the `client/` directory and add your backend URL for local development:
    `VITE_BACKEND_URL=http://localhost:5000`
    d.  **Start the React development server:**
    ` bash npm run dev  `
    The frontend will typically run on `http://localhost:5173`. 🖥️

-----

## Usage 💡

1.  **Access the Frontend:** Open your web browser and go to `http://localhost:5173` (or the deployed Vercel/Netlify URL). 🚀
2.  **Sign Up/Sign In:** Register a new account or log in with existing credentials. Your authentication is handled securely by Supabase. 🔑
3.  **Input Lecture Notes:** Navigate to the quiz generation page. Paste or type your lecture notes/text into the provided input area. ✍️
4.  **Generate Quiz:** Click the "Generate Quiz" button. The AI will process your notes and create a multiple-choice quiz. 🤔
5.  **Take the Quiz:** Answer the questions. ✅
6.  **Review Results:** (If implemented) Review your score and see correct answers. 💯

-----

## Automated Testing 🧪

EduQuiz includes automated tests to ensure reliability and functionality.

**Backend Tests (Pytest):**

  * **Run from `server/` directory:**
    ```bash
    cd server
    pytest
    ```
    *Expects: All backend unit and integration tests to pass. ✔️*

**Frontend Tests (Vitest):**

  * **Run from `client/` directory:**
    ```bash
    cd client
    npm test
    ```
    *Expects: All frontend component tests to pass. ✅*

-----

## Deployment 🚀

This project is deployed using free-tier services for both frontend and backend.

### Backend (Flask) 🐍

The Flask backend is deployed on **Render.com**. ☁️

  * **Service Type:** Web Service
  * **Build Command:** `pip install -r requirements.txt` (or similar, ensure `gunicorn` is in `requirements.txt`)
  * **Start Command:** `gunicorn --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker --bind 0.0.0.0:$PORT flask_app:application` (or `gunicorn --bind 0.0.0.0:$PORT flask_app:application` if not using websockets yet).
  * **Environment Variables:** `SUPABASE_URL`, `SUPABASE_KEY`, `GEMINI_API_KEY` are set directly in Render's environment variables. 🔑
  * **CORS:** Configured to allow requests from the deployed frontend URL (and `localhost` for development). 🌐

### Frontend (React) ⚛️

The React frontend is deployed on **Vercel** (or Netlify). 🖥️

  * **Deployment Method:** Connected directly to the GitHub repository. 🐙
  * **Root Directory:** `client/` (Crucial for monorepo setup) 📂
  * **Build Command:** `npm run build` 🏗️
  * **Publish Directory:** `dist` 📦
  * **Environment Variables:** `VITE_BACKEND_URL` is set in Vercel/Netlify's project settings, pointing to your Render backend URL. 🔗

-----

## Future Enhancements 💡

  * **Live Collaborative Quizzes:** Allow multiple users to join a quiz session and compete or collaborate in real-time. 🤝
  * **Diverse Question Types:** Support for true/false, fill-in-the-blanks, or short answer questions. 📝
  * **User Profiles & History:** Store past quiz results and lecture notes for review. 📈
  * **Adaptive Learning:** Generate quizzes based on user performance, focusing on weak areas. 🎯
  * **Rich Text Editor for Notes:** Enhance the input experience for lecture notes. ✍️

-----

## Contributing 💖

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. 🙏

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project 🍴
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`) 🌿
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`) 💾
4.  Push to the Branch (`git push origin feature/AmazingFeature`) ⬆️
5.  Open a Pull Request 🔄

-----

## License ⚖️

Distributed under the MIT License. See `LICENSE` for more information. *(Create a `LICENSE` file in your root directory if you haven't already.)*

-----

## Acknowledgments 🙌

  * [Google Gemini API](https://ai.google.dev/models/gemini)
  * [Supabase](https://supabase.com/)
  * [React](https://react.dev/)
  * [Flask](https://flask.palletsprojects.com/)
  * [Tailwind CSS](https://tailwindcss.com/)
  * [Render](https://render.com/)
  * [Vercel](https://vercel.com/) (or Netlify)

-----
