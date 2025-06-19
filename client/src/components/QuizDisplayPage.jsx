import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const optionLabels = ["A", "B", "C", "D"];

export default function QuizDisplayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = location.state?.quizData;

  // Handle missing or empty quiz data
  if (!quizData || !Array.isArray(quizData) || quizData.length === 0) {
    return (
      <div className="min-h-screen h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">No quiz data available.</h2>
          <p className="text-gray-600 mb-6 text-center">Please generate a quiz from the home page.</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-200"
            onClick={() => navigate("/input")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // State for current question and user answers
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(quizData.length).fill(null));

  const currentQuestion = quizData[currentQuestionIndex];

  // Handle option selection
  const handleOptionSelect = (optionIdx) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = optionIdx;
    setUserAnswers(updatedAnswers);
  };

  // Navigation handlers
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const handleSubmit = () => {
    navigate("/results", { state: { userAnswers, quizData } });
  };

  // Responsive card layout
  return (
    <div className="min-h-screen h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center max-h-[90vh] overflow-y-auto">
        {/* Progress Indicator */}
        <div className="mb-4 w-full flex justify-between items-center">
          <span className="text-blue-700 font-semibold text-lg">
            Question {currentQuestionIndex + 1} of {quizData.length}
          </span>
        </div>
        {/* Question Card */}
        <div className="w-full bg-gray-50 rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            {currentQuestion.question}
          </h2>
          <div className="flex flex-col gap-4">
            {currentQuestion.options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center cursor-pointer rounded-lg border transition-all duration-150 px-4 py-3 text-base sm:text-lg
                  ${userAnswers[currentQuestionIndex] === idx
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-300 bg-white hover:border-blue-400"}
                `}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") handleOptionSelect(idx);
                }}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  checked={userAnswers[currentQuestionIndex] === idx}
                  onChange={() => handleOptionSelect(idx)}
                  className="form-radio h-5 w-5 text-blue-600 mr-3"
                />
                <span className="font-semibold mr-2">{optionLabels[idx]})</span>
                <span className="text-gray-800">{option}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="w-full flex flex-col sm:flex-row justify-between gap-4 mt-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          {currentQuestionIndex < quizData.length - 1 ? (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={userAnswers[currentQuestionIndex] === null}
            >
              Next
            </button>
          ) : (
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={userAnswers[currentQuestionIndex] === null}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 