import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, User, BookOpen } from "lucide-react";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/courses`);
        setCourses(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Explore Our Course Catalog
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect course to advance your skills and career.
          </p>

          <div className="mt-8 relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-600 focus:border-primary-600 sm:text-sm shadow-sm transition-shadow"
              placeholder="Search for courses..."
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-red-600">{error}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses
              .filter((course) => {
                const search = searchTerm.toLowerCase();

                return (
                  course.title?.toLowerCase().includes(search) ||
                  course.description?.toLowerCase().includes(search) ||
                  course.instructor?.name?.toLowerCase().includes(search)
                );
              })
              .map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        course.thumbnail !== "no-photo.jpg"
                          ? course.thumbnail
                          : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }
                      alt={course.title}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-sm">
                      {course.modules?.length || 0} Modules
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1 text-gray-400" />
                        {course.instructor?.name || "Instructor"}
                      </div>
                      <Link
                        to={`/courses/${course._id}`}
                        className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        View Details
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            {courses.filter((course) => {
              const search = searchTerm.toLowerCase();

              return (
                course.title?.toLowerCase().includes(search) ||
                course.description?.toLowerCase().includes(search) ||
                course.instructor?.name?.toLowerCase().includes(search)
              );
            }).length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900">
                  No courses available yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Check back soon for new content.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
