import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const QuizGame = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/quiz/getAllQuestions");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitScoreForQuestion = async (questionId, points) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`http://localhost:9000/api/leaderboard/${questionId}/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId, points }),
      });
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);
  };

  const nextQuestion = async () => {
    if (!selected) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selected === currentQuestion.answer;
    const pointsEarned = isCorrect ? 10 : 0;
    const newScore = score + pointsEarned;

    if (isCorrect) setScore(newScore);

    setSubmitting(true);
    await submitScoreForQuestion(currentQuestion.questionId, pointsEarned);
    setSubmitting(false);

    if (currentIndex + 1 >= questions.length) {
      setQuizFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
  };

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800 font-bold text-2xl">
        No questions available.
      </div>
    );
  }

  // ─── Quiz Finished ─────────────────────────────────────────────────────────

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-10 text-center w-full max-w-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Quiz Completed!</h1>
          <p className="text-slate-500 font-medium mb-8">All questions answered</p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Your Score</p>
            <p className="text-5xl font-black text-green-600">{score}</p>
            <p className="text-slate-500 font-medium text-sm mt-1">
              {score / 10} / {questions.length} correct
            </p>
          </div>

          <button
            onClick={() => navigate(`/leaderboard/${roomId}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-md shadow-blue-600/15"
          >
            View Leaderboard →
          </button>
        </div>
      </div>
    );
  }

  // ─── Active Question ───────────────────────────────────────────────────────

  const currentQuestion = questions[currentIndex];
  const options = [
    currentQuestion.optionA,
    currentQuestion.optionB,
    currentQuestion.optionC,
    currentQuestion.optionD,
  ];

  const progressPercent = (currentIndex / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 w-full max-w-5xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Quiz Game</h1>
            <p className="text-slate-500 font-medium text-sm mt-0.5">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Score</p>
            <p className="text-2xl font-black text-green-600">{score}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Options - Light Grid Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {options.map((option, index) => {
            let style = "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 hover:border-blue-400 cursor-pointer shadow-sm";

            if (selected) {
              if (option === currentQuestion.answer) {
                style = "bg-green-600 border-green-600 text-white cursor-default shadow-md";
              } else if (option === selected && option !== currentQuestion.answer) {
                style = "bg-red-600 border-red-600 text-white cursor-default shadow-md";
              } else {
                style = "bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-default";
              }
            }

            return (
              <button
                key={index}
                disabled={!!selected}
                onClick={() => handleAnswer(option)}
                className={`${style} border-2 p-5 rounded-xl text-left font-bold transition-all duration-150 disabled:cursor-not-allowed flex items-center`}
              >
                <span className={`text-sm mr-3 font-mono font-bold ${selected && (option === currentQuestion.answer || option === selected) ? "text-white/80" : "text-blue-600"}`}>
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback + Next */}
        <div className="flex items-center justify-between">
          <div>
            {selected && (
              selected === currentQuestion.answer ? (
                <p className="text-green-600 font-bold text-lg">✓ Correct! +10 points</p>
              ) : (
                <p className="text-red-600 font-bold text-lg">✗ Wrong answer</p>
              )
            )}
          </div>

          <button
            disabled={!selected || submitting}
            onClick={nextQuestion}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-200 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-600/15"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : currentIndex === questions.length - 1 ? (
              "Finish Quiz"
            ) : (
              "Next →"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuizGame;