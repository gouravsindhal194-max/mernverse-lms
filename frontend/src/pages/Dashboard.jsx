import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BookOpen,
  PlusCircle,
  PlayCircle,
  BarChart,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeStudents: 0,
    avgCompletion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        if (user.role === "Instructor" || user.role === "Admin") {
          // Fetch courses created by this instructor
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/courses`,
            config,
          );
          // Filter by instructor locally (or ideally in backend)
          const instructorCourses = res.data.data.filter(
            (c) => c.instructor?._id === user.id || c.instructor === user.id,
          );
          setCourses(instructorCourses);

          const statsRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/courses/instructor/stats`,
            config,
          );
          setStats(statsRes.data.data);
        } else {
          // Fetch student enrollments
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/progress/my-enrollments`,
            config,
          );
          setEnrollments(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmDelete) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/courses/${courseId}`,
        config,
      );
      // Remove deleted course from UI
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId),
      );

      alert("Course deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete course");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Here is what's happening with your learning journey.
          </p>
        </div>
        {(user.role === "Instructor" || user.role === "Admin") && (
          <Link
            to="/create-course"
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-sm"
          >
            <PlusCircle className="h-5 w-5" />
            Create Course
          </Link>
        )}
      </div>

      {user.role === "Student" ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary-600" />
            My Enrollments
          </h2>

          {enrollments.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start your learning journey by exploring our course catalog.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-all"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.filter((enrollment) => enrollment.course?._id).map((enrollment) => (
                <div
                  key={enrollment._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-gray-200 relative">
                    <img
                      src={
                        enrollment.course?.thumbnail !== "no-photo.jpg"
                          ? enrollment.course?.thumbnail
                          : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }
                      alt="Course thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-16 w-16 text-white opacity-80" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                      {enrollment.course?.title}
                    </h3>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          Overall Progress
                        </span>
                        <span className="text-xs font-bold text-primary-600">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      to={`/courses/${enrollment.course?._id}`}
                      className="mt-5 w-full block text-center bg-gray-50 text-primary-700 font-medium py-2 rounded-lg hover:bg-primary-50 transition-colors border border-gray-100"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCourses || courses.length}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <BarChart className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeStudents}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-purple-50 p-4 rounded-xl">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Avg. Completion
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgCompletion}%
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modules
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={
                              course.thumbnail !== "no-photo.jpg"
                                ? course.thumbnail
                                : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {course.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.modules?.length || 0} modules
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          to={`/courses/${course._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View/Edit
                        </Link>

                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      You haven't created any courses yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
