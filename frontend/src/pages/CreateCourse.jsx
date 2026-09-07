import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { PlusCircle, Trash2, Save, ArrowLeft, Upload } from "lucide-react";

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "no-photo.jpg",
    introVideoType: "video-link",
    introVideoUrl: "",
  });
  const [modules, setModules] = useState([
    {
      title: "",
      description: "",
      resources: [{ title: "", type: "video-link", videoUrl: "", fileUrl: "" }],
    },
  ]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { title, description } = formData;
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: "",
        description: "",
        resources: [
          { title: "", type: "video-link", videoUrl: "", fileUrl: "" },
        ],
      },
    ]);
  };

  const removeModule = (index) => {
    const updatedModules = [...modules];
    updatedModules.splice(index, 1);
    setModules(updatedModules);
  };

  const handleResourceChange = (moduleIndex, resourceIndex, field, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].resources[resourceIndex][field] = value;
    setModules(updatedModules);
  };

  const addResource = (moduleIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].resources.push({
      title: "",
      type: "video-link",
      videoUrl: "",
      fileUrl: "",
    });
    setModules(updatedModules);
  };

  const removeResource = (moduleIndex, resourceIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].resources.splice(resourceIndex, 1);
    setModules(updatedModules);
  };

  const uploadResourceFile = async (moduleIndex, resourceIndex, file) => {
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formDataUpload,
        config,
      );
      handleResourceChange(moduleIndex, resourceIndex, "fileUrl", res.data);
    } catch (err) {
      alert("Error uploading file");
    }
  };

  const uploadCourseIntro = async (file) => {
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formDataUpload,
        config,
      );
      setFormData((prev) => ({ ...prev, introVideoUrl: res.data }));
    } catch (err) {
      alert("Error uploading file");
    }
  };

  // Quiz Handlers
  const addQuiz = () => {
    setQuizzes([
      ...quizzes,
      {
        title: "",
        questions: [
          {
            questionText: "",
            options: ["", "", "", ""],
            correctOptionIndex: 0,
          },
        ],
      },
    ]);
  };

  const removeQuiz = (quizIndex) => {
    const updated = [...quizzes];
    updated.splice(quizIndex, 1);
    setQuizzes(updated);
  };

  const handleQuizChange = (quizIndex, field, value) => {
    const updated = [...quizzes];
    updated[quizIndex][field] = value;
    setQuizzes(updated);
  };

  const addQuestion = (quizIndex) => {
    const updated = [...quizzes];
    updated[quizIndex].questions.push({
      questionText: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
    });
    setQuizzes(updated);
  };

  const removeQuestion = (quizIndex, qIndex) => {
    const updated = [...quizzes];
    updated[quizIndex].questions.splice(qIndex, 1);
    setQuizzes(updated);
  };

  const handleQuestionChange = (quizIndex, qIndex, field, value) => {
    const updated = [...quizzes];
    updated[quizIndex].questions[qIndex][field] = value;
    setQuizzes(updated);
  };

  const handleOptionChange = (quizIndex, qIndex, oIndex, value) => {
    const updated = [...quizzes];
    updated[quizIndex].questions[qIndex].options[oIndex] = value;
    setQuizzes(updated);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const courseData = {
        ...formData,
        modules: modules.filter((m) => m.title !== ""),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/courses`,
        courseData,
        config,
      );
      const courseId = res.data.data._id;

      // Save quizzes sequentially
      for (const quiz of quizzes) {
        if (quiz.title && quiz.questions.length > 0) {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/courses/${courseId}/quizzes`,
            quiz,
            config,
          );
        }
      }

      navigate(`/courses/${courseId}`);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Course
            </h1>
            <p className="mt-2 text-gray-300">
              Fill in the details below to publish your new course.
            </p>
          </div>

          <form onSubmit={onSubmit} className="p-8">
            <div className="space-y-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Course Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={title}
                      onChange={onChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4 border"
                      placeholder="e.g. Complete Web Development Bootcamp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      required
                      rows="4"
                      value={description}
                      onChange={onChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4 border"
                      placeholder="Briefly describe what students will learn..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intro Video Type
                    </label>
                    <select
                      name="introVideoType"
                      value={formData.introVideoType}
                      onChange={onChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4 border mb-3"
                    >
                      <option value="video-link">Video Link</option>
                      <option value="local-video">Upload Video</option>
                    </select>

                    {formData.introVideoType === "video-link" ? (
                      <input
                        type="text"
                        name="introVideoUrl"
                        placeholder="YouTube/Vimeo URL"
                        value={formData.introVideoUrl}
                        onChange={onChange}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4 border"
                      />
                    ) : (
                      <div className="flex items-center">
                        <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <span>
                            <Upload className="inline-block w-4 h-4 mr-2" />
                            Select Intro Video
                          </span>
                          <input
                            type="file"
                            className="sr-only"
                            onChange={(e) =>
                              uploadCourseIntro(e.target.files[0])
                            }
                            accept="video/*"
                          />
                        </label>
                        <span className="ml-3 text-sm text-gray-500">
                          {formData.introVideoUrl
                            ? formData.introVideoUrl.split("-").pop()
                            : "No file selected"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modules */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                  Curriculum Modules
                </h3>

                <div className="space-y-6">
                  {modules.map((module, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative"
                    >
                      {modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeModule(index)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}

                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                        Module {index + 1}
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Module Title
                          </label>
                          <input
                            type="text"
                            required
                            value={module.title}
                            onChange={(e) =>
                              handleModuleChange(index, "title", e.target.value)
                            }
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2 px-3 border"
                            placeholder="e.g. Introduction to React"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <input
                            type="text"
                            value={module.description}
                            onChange={(e) =>
                              handleModuleChange(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2 px-3 border"
                          />
                        </div>

                        {/* Resources */}
                        <div className="mt-6">
                          <h5 className="text-sm font-bold text-gray-700 mb-4">
                            Module Resources
                          </h5>
                          <div className="space-y-4">
                            {module.resources &&
                              module.resources.map((resource, rIndex) => (
                                <div
                                  key={rIndex}
                                  className="bg-white p-4 rounded-lg border border-gray-200 relative shadow-sm"
                                >
                                  {module.resources.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeResource(index, rIndex)
                                      }
                                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}

                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-500">
                                        Resource Title
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={resource.title}
                                        onChange={(e) =>
                                          handleResourceChange(
                                            index,
                                            rIndex,
                                            "title",
                                            e.target.value,
                                          )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1.5 px-3 border text-sm"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-xs font-medium text-gray-500">
                                        Resource Type
                                      </label>
                                      <select
                                        value={resource.type}
                                        onChange={(e) =>
                                          handleResourceChange(
                                            index,
                                            rIndex,
                                            "type",
                                            e.target.value,
                                          )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1.5 px-3 border text-sm"
                                      >
                                        <option value="video-link">
                                          Video Link
                                        </option>
                                        <option value="local-video">
                                          Upload Video
                                        </option>
                                        <option value="pdf">Upload PDF</option>
                                        <option value="doc">
                                          Upload Document
                                        </option>
                                      </select>
                                    </div>

                                    {resource.type === "video-link" && (
                                      <div>
                                        <label className="block text-xs font-medium text-gray-500">
                                          Video URL
                                        </label>
                                        <input
                                          type="text"
                                          value={resource.videoUrl || ""}
                                          onChange={(e) =>
                                            handleResourceChange(
                                              index,
                                              rIndex,
                                              "videoUrl",
                                              e.target.value,
                                            )
                                          }
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1.5 px-3 border text-sm"
                                        />
                                      </div>
                                    )}

                                    {resource.type !== "video-link" && (
                                      <div>
                                        <label className="block text-xs font-medium text-gray-500">
                                          Upload File
                                        </label>
                                        <div className="mt-1 flex items-center">
                                          <label className="cursor-pointer bg-white py-1 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50">
                                            <span>
                                              <Upload className="inline-block w-3 h-3 mr-1" />
                                              Select File
                                            </span>
                                            <input
                                              type="file"
                                              className="sr-only"
                                              onChange={(e) =>
                                                uploadResourceFile(
                                                  index,
                                                  rIndex,
                                                  e.target.files[0],
                                                )
                                              }
                                              accept={
                                                resource.type === "local-video"
                                                  ? "video/*"
                                                  : resource.type === "pdf"
                                                    ? ".pdf"
                                                    : ".doc,.docx"
                                              }
                                            />
                                          </label>
                                          <span className="ml-3 text-xs text-gray-500 truncate max-w-[200px]">
                                            {resource.fileUrl
                                              ? resource.fileUrl
                                                  .split("-")
                                                  .pop()
                                              : "No file selected"}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => addResource(index)}
                            className="mt-3 flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                          >
                            <PlusCircle className="mr-1 h-4 w-4" /> Add Resource
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addModule}
                  className="mt-4 flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Add Another Module
                </button>
              </div>

              {/* Quizzes */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                  Course Quizzes (Optional)
                </h3>

                <div className="space-y-6">
                  {quizzes.map((quiz, quizIndex) => (
                    <div
                      key={quizIndex}
                      className="bg-blue-50 p-6 rounded-xl border border-blue-200 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeQuiz(quizIndex)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                      <div className="mb-6 pr-8">
                        <label className="block text-sm font-bold text-blue-900">
                          Quiz Title
                        </label>
                        <input
                          type="text"
                          required
                          value={quiz.title}
                          onChange={(e) =>
                            handleQuizChange(quizIndex, "title", e.target.value)
                          }
                          className="mt-1 block w-full rounded-lg border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                          placeholder="e.g. End of Course Assessment"
                        />
                      </div>

                      <div className="space-y-4">
                        {quiz.questions.map((q, qIndex) => (
                          <div
                            key={qIndex}
                            className="bg-white p-4 rounded-lg border border-gray-200 relative shadow-sm"
                          >
                            {quiz.questions.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeQuestion(quizIndex, qIndex)
                                }
                                className="absolute top-2 right-2 text-gray-300 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}

                            <label className="block text-sm font-medium text-gray-700">
                              Question {qIndex + 1}
                            </label>
                            <input
                              type="text"
                              required
                              value={q.questionText}
                              onChange={(e) =>
                                handleQuestionChange(
                                  quizIndex,
                                  qIndex,
                                  "questionText",
                                  e.target.value,
                                )
                              }
                              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm py-2 px-3 border mb-3"
                            />

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              {q.options.map((opt, oIndex) => (
                                <div key={oIndex}>
                                  <label className="block text-xs font-medium text-gray-500">
                                    Option {oIndex + 1}
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={opt}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        quizIndex,
                                        qIndex,
                                        oIndex,
                                        e.target.value,
                                      )
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm py-1.5 px-3 border text-sm"
                                  />
                                </div>
                              ))}
                            </div>

                            <label className="block text-sm font-medium text-gray-700">
                              Correct Option
                            </label>
                            <select
                              value={q.correctOptionIndex}
                              onChange={(e) =>
                                handleQuestionChange(
                                  quizIndex,
                                  qIndex,
                                  "correctOptionIndex",
                                  parseInt(e.target.value),
                                )
                              }
                              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm py-2 px-3 border text-sm"
                            >
                              {q.options.map((_, i) => (
                                <option key={i} value={i}>
                                  Option {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addQuestion(quizIndex)}
                        className="mt-4 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <PlusCircle className="mr-1 h-4 w-4" /> Add Question
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addQuiz}
                  className="mt-4 flex items-center justify-center w-full py-4 border-2 border-dashed border-blue-300 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Add Quiz
                </button>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="bg-white px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-4 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center rounded-lg border border-transparent bg-primary-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Publishing..."
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" /> Publish Course
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
