const Course = require("../models/Course");
const Quiz = require("../models/Quiz");
const Enrollment = require("../models/Enrollment");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate({
      path: "instructor",
      select: "name email",
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "instructor",
      select: "name email",
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor, Admin)
exports.createCourse = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.instructor = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor, Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

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
      return res
        .status(401)
        .json({
          success: false,
          error: "Not authorized to update this course",
        });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor, Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    // Make sure user is course instructor or admin
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this course",
      });
    }

    // Delete related quizzes
    await Quiz.deleteMany({ course: req.params.id });

    // Delete related enrollments
    await Enrollment.deleteMany({ course: req.params.id });

    // Delete course
    await course.deleteOne();

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
// @desc    Get enrolled students for a course
// @route   GET /api/courses/:courseId/students
// @access  Private (Instructor, Admin)
exports.getCourseStudents = async (req, res, next) => {
  try {
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
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate("student", "name email")
      .populate("quizScores.quiz", "title");

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get instructor dashboard stats
// @route   GET /api/courses/instructor/stats
// @access  Private (Instructor, Admin)
exports.getInstructorStats = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    const courseIds = courses.map((c) => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } });

    const uniqueStudents = new Set();
    let totalProgress = 0;

    enrollments.forEach((enrollment) => {
      uniqueStudents.add(enrollment.student.toString());
      totalProgress += enrollment.progress;
    });

    const activeStudents = uniqueStudents.size;
    const avgCompletion =
      enrollments.length > 0
        ? Math.round(totalProgress / enrollments.length)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCourses: courses.length,
        activeStudents,
        avgCompletion,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
