import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const optionLabels = ["A", "B", "C", "D"];

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = location.state?.quizData;
  const userAnswers = location.state?.userAnswers;

  // Validate data
  const isValid =
    quizData &&
    Array.isArray(quizData) &&
    quizData.length > 0 &&
    userAnswers &&
    Array.isArray(userAnswers) &&
    userAnswers.length === quizData.length;

  if (!isValid) {
    return (
      <div className="min-h-screen h-screen w-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Quiz results not found.</h2>
          <p className="text-gray-600 mb-6 text-center">Please complete a quiz first.</p>
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

  // Score calculation (last option is correct)
  let score = 0;
  quizData.forEach((q, idx) => {
    if (userAnswers[idx] === q.options.length - 1) {
      score++;
    }
  });
  const percentage = Math.round((score / quizData.length) * 100);

  return (
    <div className="min-h-screen h-screen w-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center overflow-y-auto scroll-smooth max-h-[90vh]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-2 text-center">Your Quiz Results</h1>
        <div className="mb-8 mt-2 text-center">
          <span className="text-2xl sm:text-3xl font-bold text-green-600">
            You scored {score} out of {quizData.length}! ({percentage}%)
          </span>
        </div>
        <div className="w-full flex flex-col gap-6">
          {quizData.map((q, idx) => {
            const userIdx = userAnswers[idx];
            const correctIdx = q.options.length - 1;
            const isCorrect = userIdx === correctIdx;
            return (
              <div
                key={idx}
                className={`w-full rounded-xl shadow p-6 border-2 transition-all duration-200
                  ${isCorrect ? "border-green-400 bg-green-50" : "border-red-300 bg-red-50"}
                `}
              >
                <div className="flex items-center mb-2">
                  <span className="text-lg font-bold text-gray-800 mr-2">Q{idx + 1}.</span>
                  <span className="text-lg font-semibold text-gray-800">{q.question}</span>
                  {isCorrect ? (
                    <span className="ml-3 text-green-600 font-bold flex items-center">
                      <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Correct
                    </span>
                  ) : (
                    <span className="ml-3 text-red-600 font-bold flex items-center">
                      <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      Incorrect
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {q.options.map((opt, oidx) => {
                    const isUser = userIdx === oidx;
                    const isCorrectOpt = correctIdx === oidx;
                    return (
                      <div
                        key={oidx}
                        className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-150
                          ${isCorrectOpt ? "border-green-500 bg-green-100" : "border-gray-200"}
                          ${isUser ? (isCorrectOpt ? "ring-2 ring-green-400" : "ring-2 ring-red-400 bg-red-100 border-red-400") : ""}
                        `}
                      >
                        <span className="font-semibold mr-2">{optionLabels[oidx]})</span>
                        <span className="text-gray-800">{opt}</span>
                        {isUser && (
                          <span className="ml-2 text-xs font-bold uppercase px-2 py-1 rounded bg-blue-200 text-blue-800">Your Answer</span>
                        )}
                        {isCorrectOpt && (
                          <span className="ml-2 text-xs font-bold uppercase px-2 py-1 rounded bg-green-200 text-green-800">Correct</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-200 text-lg"
          onClick={() => navigate("/input")}
        >
          Start New Quiz
        </button>
      </div>
    </div>
  );
} 