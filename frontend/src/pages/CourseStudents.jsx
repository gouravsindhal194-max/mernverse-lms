import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ArrowLeft, Users, CheckCircle, XCircle } from "lucide-react";

const CourseStudents = () => {
  const { id } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [courseRes, studentsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/courses/${id}`, config),
          axios.get(
            `${import.meta.env.VITE_API_URL}/courses/${id}/students`,
            config
          ),
        ]);

        setCourse(courseRes.data.data);
        setEnrollments(studentsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <Link
            to={`/edit-course/${id}`}
            className="flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Edit Course
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-900 text-white flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Users className="h-8 w-8 text-primary-400" />
                Enrolled Students
              </h1>
              <p className="mt-2 text-gray-300">Course: {course?.title}</p>
            </div>
            <div className="bg-gray-800 px-6 py-3 rounded-xl border border-gray-700 text-center">
              <span className="block text-2xl font-black text-white">
                {enrollments.length}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                Total Students
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-6 font-bold">Student Name</th>
                  <th className="p-6 font-bold">Email</th>
                  <th className="p-6 font-bold">Progress</th>
                  <th className="p-6 font-bold">Quiz Scores</th>
                  <th className="p-6 font-bold">Enrolled Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <tr
                      key={enrollment._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-6">
                        <div className="font-bold text-gray-900">
                          {enrollment.student?.name}
                        </div>
                      </td>
                      <td className="p-6 text-gray-600">
                        {enrollment.student?.email}
                      </td>
                      <td className="p-6">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 max-w-[100px]">
                          <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{ width: `${enrollment.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-500">
                          {enrollment.progress || 0}%
                        </span>
                      </td>
                      <td className="p-6">
                        {enrollment.quizScores &&
                        enrollment.quizScores.length > 0 ? (
                          <div className="space-y-2">
                            {enrollment.quizScores.map((qs, i) => (
                              <div
                                key={i}
                                className="text-sm flex items-center gap-2"
                              >
                                {qs.score === qs.total ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-primary-500" />
                                )}
                                <span className="font-medium text-gray-700">
                                  {qs.quiz?.title || "Quiz"}:
                                </span>
                                <span className="font-bold">
                                  {qs.score}/{qs.total}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            No quizzes taken
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-sm text-gray-500">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No students enrolled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseStudents;
