import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BookOpen, User, Calendar, CheckCircle, Users } from "lucide-react";
import ReactPlayer from "react-player";

const getEmbedUrl = (url) => {
  if (!url) return null;
  const cleanUrl = url.trim();
  if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
    let videoId = "";
    if (cleanUrl.includes("youtube.com/watch?v=")) {
      videoId = cleanUrl.split("v=")[1]?.split("&")[0];
    } else if (cleanUrl.includes("youtube.com/embed/")) {
      videoId = cleanUrl.split("embed/")[1]?.split("?")[0];
    } else if (cleanUrl.includes("youtu.be/")) {
      videoId = cleanUrl.split("/").pop()?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
  return null;
};

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeResource, setActiveResource] = useState(null);
  const [completedResources, setCompletedResources] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleResourceComplete = async (resourceId) => {
    if (user && user.role === "Student" && isEnrolled) {
      if (completedResources.includes(resourceId)) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post(
          `${import.meta.env.VITE_API_URL}/progress/${id}/resource/${resourceId}/complete`,
          {},
          config,
        );
        setCompletedResources((prev) => [...prev, resourceId]);
      } catch (err) {
        console.error("Error updating progress:", err);
      }
    }
  };
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/courses/${id}`,
        );
        setCourse(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/courses/${id}/quizzes`,
          config,
        );

        setQuizzes(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
    fetchQuizzes();
  }, [id, token]);

  useEffect(() => {
    if (user && user.role === "Student") {
      const checkEnrollment = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/progress/my-enrollments`,
            config,
          );
          const enrolled = res.data.data.find(
            (e) => e.course?._id === id || e.course === id,
          );
          if (enrolled) {
            setIsEnrolled(true);
            setCompletedResources(enrolled.completedResources || []);
            setQuizScores(enrolled.quizScores || []);
          }
        } catch (err) {
          console.error(err);
        }
      };
      checkEnrollment();
    }
  }, [user, id, token]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/courses/${id}/enroll`,
        {},
        config,
      );
      setIsEnrolled(true);
      alert("Successfully enrolled!");
    } catch (err) {
      alert(err.response?.data?.error || "Error enrolling in course");
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center mt-20 text-2xl font-bold text-gray-700">
        Course not found
      </div>
    );
  }

  const isInstructor =
    user && (user.id === course.instructor?._id || user.role === "Admin");
  const canAccessContent = isInstructor || isEnrolled;

  let videoModulesCount = 0;
  let docModulesCount = 0;
  if (course.modules) {
    course.modules.forEach((m) => {
      if (m.resources) {
        m.resources.forEach((r) => {
          if (!r.type || r.type.includes("video")) videoModulesCount++;
          if (r.type === "pdf" || r.type === "doc") docModulesCount++;
        });
      }
    });
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      {/* Course Header Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                {course.title}
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary-400" />
                  {course.instructor?.name || "Instructor"}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-400" />
                  {new Date(course.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary-400" />
                  {course.modules?.length || 0} Modules
                </div>
              </div>

              {!isInstructor && user?.role !== "Instructor" && !isEnrolled && (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-primary-600 text-white hover:bg-primary-500 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}
              {isEnrolled && (
                <div className="inline-flex items-center px-6 py-3 rounded-xl bg-green-500/20 text-green-400 font-bold border border-green-500/30">
                  <CheckCircle className="w-5 h-5 mr-2" /> Enrolled
                </div>
              )}
              {isInstructor && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={`/edit-course/${course._id}`}
                    className="inline-flex justify-center items-center bg-gray-700 text-white hover:bg-gray-600 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg w-full sm:w-auto"
                  >
                    Edit Course
                  </Link>
                  <Link
                    to={`/courses/${course._id}/students`}
                    className="inline-flex justify-center items-center bg-gray-800 text-white hover:bg-gray-700 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg w-full sm:w-auto border border-gray-700"
                  >
                    <Users className="w-5 h-5 mr-2" /> View Students
                  </Link>
                </div>
              )}
            </div>

            <div className="hidden lg:block relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800 bg-black min-h-[300px]">
              {course.introVideoUrl ? (
                <div className="w-full h-full flex items-center justify-center aspect-w-16 aspect-h-9">
                  {getEmbedUrl(course.introVideoUrl) ? (
                    <iframe
                      src={getEmbedUrl(course.introVideoUrl)}
                      className="w-full h-full min-h-[300px] border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <ReactPlayer
                      url={
                        course.introVideoType === "local-video"
                          ? `${import.meta.env.VITE_SERVER_URL}${course.introVideoUrl}`
                          : course.introVideoUrl
                      }
                      width="100%"
                      height="100%"
                      controls={true}
                    />
                  )}
                </div>
              ) : (
                <>
                  <img
                    className="w-full h-full object-cover min-h-[300px]"
                    src={
                      course.thumbnail !== "no-photo.jpg"
                        ? course.thumbnail
                        : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={course.title}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary-600" />
                Course Modules
              </h2>

              {activeResource && canAccessContent && (
                <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden shadow-inner mb-6 relative flex items-center justify-center">
                    {!activeResource.type ||
                    activeResource.type === "video-link" ||
                    activeResource.type === "local-video" ? (
                      activeResource.videoUrl || activeResource.fileUrl ? (
                        <ReactPlayer
                          src={
                            activeResource.type === "local-video"
                              ? `${import.meta.env.VITE_SERVER_URL}${activeResource.fileUrl}`
                              : activeResource.videoUrl
                          }
                          width="100%"
                          height="500px"
                          controls={true}
                          onEnded={() =>
                            handleResourceComplete(activeResource._id)
                          }
                        />
                      ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-900 w-full">
                          No video URL provided
                        </div>
                      )
                    ) : activeResource.type === "pdf" ? (
                      activeResource.fileUrl ? (
                        <iframe
                          src={`${import.meta.env.VITE_SERVER_URL}${activeResource.fileUrl}`}
                          className="w-full h-full min-h-[500px]"
                          title="PDF Document"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-900 w-full">
                          No PDF provided
                        </div>
                      )
                    ) : activeResource.type === "doc" ? (
                      activeResource.fileUrl ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-900 w-full">
                          <BookOpen className="h-16 w-16 mb-4" />
                          <a
                            href={`${import.meta.env.VITE_SERVER_URL}${activeResource.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-500"
                          >
                            Download Document
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-900 w-full">
                          No Document provided
                        </div>
                      )
                    ) : null}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {activeResource.title}
                      </h3>
                      <p className="text-gray-600 mt-1 text-sm uppercase tracking-wider">
                        {activeResource.type.replace("-", " ")}
                      </p>
                    </div>
                    {(activeResource.type === "pdf" ||
                      activeResource.type === "doc") && (
                      <button
                        onClick={() =>
                          handleResourceComplete(activeResource._id)
                        }
                        disabled={completedResources.includes(
                          activeResource._id,
                        )}
                        className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-colors ${completedResources.includes(activeResource._id) ? "bg-green-100 text-green-700 cursor-not-allowed" : "bg-primary-600 text-white hover:bg-primary-700"}`}
                      >
                        {completedResources.includes(activeResource._id)
                          ? "Completed"
                          : "Mark as Complete"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module, index) => (
                    <div key={module._id || index} className="p-0">
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          Module {index + 1}: {module.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {module.description}
                        </p>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {module.resources &&
                          module.resources.map((resource, rIndex) => {
                            const isComplete = completedResources.includes(
                              resource._id,
                            );
                            const isActive =
                              activeResource?._id === resource._id;
                            return (
                              <div
                                key={resource._id || rIndex}
                                onClick={() => {
                                  if (canAccessContent) {
                                    setActiveResource(resource);
                                    window.scrollTo({
                                      top: 400,
                                      behavior: "smooth",
                                    });
                                  } else {
                                    alert("Please enroll to view this module.");
                                  }
                                }}
                                className={`p-4 flex items-center justify-between transition-colors ${canAccessContent ? "cursor-pointer hover:bg-primary-50" : "opacity-70"} ${isActive ? "bg-primary-50 border-l-4 border-primary-600" : "border-l-4 border-transparent"}`}
                              >
                                <div className="flex items-center">
                                  {resource.type === "video-link" ||
                                  resource.type === "local-video" ? (
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-3">
                                      <BookOpen className="w-5 h-5" />
                                    </div>
                                  ) : (
                                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mr-3">
                                      <BookOpen className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {resource.title}
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                                      {resource.type.replace("-", " ")}
                                    </p>
                                  </div>
                                </div>
                                {isComplete && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No modules have been added to this course yet.
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary-600" />
                Quizzes
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {quizzes.length > 0 ? (
                  quizzes.map((quiz, index) => (
                    <div
                      key={quiz._id}
                      className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-4">
                          Q{index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {quiz.title}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {quiz.questions?.length || 0} Questions
                          </p>
                        </div>
                      </div>
                      {canAccessContent ? (
                        (() => {
                          const quizScore = quizScores.find(
                            (qs) =>
                              qs.quiz?.toString() === quiz._id?.toString(),
                          );

                          if (quizScore) {
                            const percentage =
                              quizScore.total > 0
                                ? Math.round(
                                    (quizScore.score / quizScore.total) * 100,
                                  )
                                : 0;

                            const passed = percentage >= 50;

                            return (
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p
                                    className={`text-sm font-semibold ${
                                      passed ? "text-green-600" : "text-red-600"
                                    }`}
                                  >
                                    {passed ? "Passed" : "Failed"}
                                  </p>

                                  <p className="text-sm text-gray-600">
                                    Score: {quizScore.score}/{quizScore.total} (
                                    {percentage}%)
                                  </p>
                                </div>

                                <Link
                                  to={`/courses/${id}/quiz/${quiz._id}`}
                                  className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  Retake
                                </Link>
                              </div>
                            );
                          }

                          return (
                            <Link
                              to={`/courses/${id}/quiz/${quiz._id}`}
                              className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                            >
                              Take Quiz
                            </Link>
                          );
                        })()
                      ) : (
                        <span className="text-sm text-gray-400">
                          Enroll to take
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No quizzes available for this course yet.
                  </div>
                )}
              </div>
            </section>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                What you'll learn
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Master the core concepts of this subject
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Build real-world projects and applications
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Prepare for industry certifications
                  </span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center mb-4">
                  Includes
                </p>
                <div className="flex flex-col gap-3 text-sm font-medium text-gray-700">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span>Video Lessons</span>
                    <span className="text-primary-600">
                      {videoModulesCount} Modules
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span>Documents & Resources</span>
                    <span className="text-primary-600">
                      {docModulesCount} items
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span>Access on mobile & TV</span>
                    <span className="text-primary-600">Full lifetime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
