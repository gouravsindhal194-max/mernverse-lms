const Quiz = require("../models/Quiz");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const { recalculateEnrollmentProgress } = require("./progressController");

// @desc    Get all quizzes for a course
// @route   GET /api/courses/:courseId/quizzes
// @access  Public
exports.getQuizzes = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === "Admin";
    const enrollment = await Enrollment.exists({
      student: req.user.id,
      course: course._id,
    });

    if (!enrollment && !isInstructor && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "You must be enrolled in this course to access its quizzes",
      });
    }

    let query = Quiz.find({ course: course._id });
    if (!isInstructor && !isAdmin) {
      query = query.select("-questions.correctOptionIndex");
    }
    const quizzes = await query;

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found",
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: quiz.course,
    });

    // Admin and course instructor can access the quiz
    const course = await Course.findById(quiz.course);

    const isInstructor = course && course.instructor.toString() === req.user.id;

    const isAdmin = req.user.role === "Admin";

    // Student must be enrolled
    if (!enrollment && !isInstructor && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "You must be enrolled in this course to access this quiz",
      });
    }

    let quizQuery = Quiz.findById(req.params.id);

    if (!isInstructor && !isAdmin) {
      quizQuery = quizQuery.select("-questions.correctOptionIndex");
    }

    const quizForResponse = await quizQuery;

    res.status(200).json({
      success: true,
      data: quizForResponse,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Instructor, Admin)

exports.updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found",
      });
    }

    // Find the course this quiz belongs to
    const course = await Course.findById(quiz.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    // Only course instructor or Admin can update the quiz
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this quiz",
      });
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Instructor, Admin)

exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found",
      });
    }

    // Find the course this quiz belongs to
    const course = await Course.findById(quiz.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    // Only course instructor or Admin can delete the quiz
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this quiz",
      });
    }

    // Remove embedded score entries first so no enrollment retains a deleted quiz ID.
    await Enrollment.updateMany(
      { "quizScores.quiz": quiz._id },
      { $pull: { quizScores: { quiz: quiz._id } } },
    );

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.createQuiz = async (req, res, next) => {
  try {
    req.body.course = req.params.courseId;

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    // Make sure user is course instructor or admin
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to add a quiz to this course",
      });
    }

    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Submit quiz answers and get score
// @route   POST /api/quizzes/:id/submit
// @access  Private (Student)
exports.submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    const { answers } = req.body; // array of selected option indices

    if (!answers || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide an array of answers" });
    }

    if (
      answers.length !== quiz.questions.length ||
      answers.some(
        (answer, index) =>
          !Number.isInteger(answer) ||
          answer < 0 ||
          answer >= quiz.questions[index].options.length,
      )
    ) {
      return res.status(400).json({
        success: false,
        error: "Answers must include one valid option index for every question",
      });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctOptionIndex) {
        score++;
      }
    });

    // Save to enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: quiz.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        error: "You must be enrolled in this course to submit this quiz",
      });
    }

    const existingScoreIndex = enrollment.quizScores.findIndex(
      (qs) => qs.quiz.toString() === quiz._id.toString(),
    );

    if (existingScoreIndex !== -1) {
      enrollment.quizScores[existingScoreIndex].score = score;
      enrollment.quizScores[existingScoreIndex].total = quiz.questions.length;
    } else {
      enrollment.quizScores.push({
        quiz: quiz._id,
        score,
        total: quiz.questions.length,
      });
    }
    await recalculateEnrollmentProgress(
      enrollment,
      await Course.findById(quiz.course),
    );

    await enrollment.save();

    res.status(200).json({
      success: true,
      score,
      total: quiz.questions.length,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
