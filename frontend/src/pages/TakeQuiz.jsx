import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";

const TakeQuiz = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/quizzes/${quizId}`,
          config,
        );
        setQuiz(res.data.data);
        setAnswers(new Array(res.data.data.questions.length).fill(null));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, token]);

  const handleOptionSelect = (qIndex, oIndex) => {
    if (result) return; // Prevent changing after submission
    const newAnswers = [...answers];
    newAnswers[qIndex] = oIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/quizzes/${quizId}/submit`,
        { answers },
        config,
      );

      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">{error}</h2>
        <Link
          to={`/courses/${courseId}`}
          className="mt-6 inline-block text-primary-600 font-medium hover:text-primary-700"
        >
          Back to Course
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={`/courses/${courseId}`}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Course
        </Link>

        {result ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-center p-12">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Quiz Completed!
            </h1>

            <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto my-8 border border-gray-200">
              <p className="text-lg text-gray-600 mb-2">Your Score</p>
              <div className="text-5xl font-black text-primary-600">
                {result.score}{" "}
                <span className="text-3xl text-gray-400">/ {result.total}</span>
              </div>
              <p className="mt-4 text-sm font-medium text-gray-500">
                {Math.round((result.score / result.total) * 100)}% Accuracy
              </p>
            </div>

            <Link
              to={`/courses/${courseId}`}
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-500 transition-colors shadow-sm"
            >
              Return to Course
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-900 text-white">
              <h1 className="text-3xl font-bold tracking-tight">
                {quiz.title}
              </h1>
              <p className="mt-2 text-gray-300">
                Answer all questions to complete the quiz.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-10">
                {quiz.questions.map((q, qIndex) => (
                  <div
                    key={q._id}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex">
                      <span className="text-primary-600 mr-2">
                        {qIndex + 1}.
                      </span>{" "}
                      {q.questionText}
                    </h3>

                    <div className="space-y-3 pl-6">
                      {q.options.map((opt, oIndex) => (
                        <label
                          key={oIndex}
                          className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${answers[qIndex] === oIndex ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            checked={answers[qIndex] === oIndex}
                            onChange={() => handleOptionSelect(qIndex, oIndex)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <span className="ml-3 font-medium text-gray-700">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-500 transition-colors shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Answers"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
