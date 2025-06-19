import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const MIN_LENGTH = 50;
const MAX_LENGTH = 5000;

export default function InputPage() {
  const [lectureNotes, setLectureNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();

  // Character count
  const charCount = lectureNotes.length;

  // Handle textarea change
  const handleChange = (e) => {
    setLectureNotes(e.target.value);
    setValidationError(null);
    setApiError(null);
  };

  // Handle quiz generation
  const handleGenerateQuiz = async () => {
    // Input validation
    if (lectureNotes.length < MIN_LENGTH) {
      setValidationError(`Please enter at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (lectureNotes.length > MAX_LENGTH) {
      setValidationError(`Please limit your input to ${MAX_LENGTH} characters.`);
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await api.post(`/generate-quiz`, {
        text: lectureNotes,
      });
      setIsLoading(false);
      // Navigate to /quiz with quiz data
      navigate("/quiz", { state: { quizData: response.data.quiz } });
    } catch (error) {
      setIsLoading(false);
      setApiError(
        error.response?.data?.error ||
          "An error occurred while generating the quiz. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-2 text-center">
          Transform Your Notes into Quizzes!
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Paste your lecture notes below and generate a custom multiple-choice quiz in seconds.
        </p>
        <label htmlFor="lecture-notes" className="block text-lg font-medium text-gray-700 mb-2">
          Paste your lecture notes here:
        </label>
        <textarea
          id="lecture-notes"
          className="w-full p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none shadow-sm resize-y text-gray-800 placeholder-gray-400 bg-white transition max-h-96"
          placeholder="e.g., The water cycle describes the continuous movement of water on, above, and below the surface of the Earth..."
          rows={10}
          maxLength={MAX_LENGTH}
          value={lectureNotes}
          onChange={handleChange}
          disabled={isLoading}
        />
        <div className="w-full flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">{charCount}/{MAX_LENGTH} characters</span>
          {validationError && (
            <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded ml-2">{validationError}</span>
          )}
        </div>
        {apiError && (
          <div className="w-full mt-4 text-red-700 bg-red-100 p-2 rounded text-center font-medium">
            {apiError}
          </div>
        )}
        <button
          className={`mt-6 w-full sm:max-w-xs py-3 px-6 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleGenerateQuiz}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Generating...
            </>
          ) : (
            "Generate Quiz"
          )}
        </button>
      </div>
    </div>
  );
}