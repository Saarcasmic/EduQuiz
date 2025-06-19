import { BrowserRouter, Routes, Route } from "react-router-dom";
import InputPage from "./components/InputPage";
import QuizDisplayPage from "./components/QuizDisplayPage";
import ResultsPage from "./components/ResultsPage";
import LandingPage from "./components/LandingPage";
import SignUpPage from "./auth/SignUpPage";
import SignInPage from "./auth/SignInPage";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-blue-50 w-screen">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route
              path="/input"
              element={
                <ProtectedRoute>
                  <InputPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <QuizDisplayPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}