const express = require("express");

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
  getInstructorStats,
} = require("../controllers/courseController");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

const { enrollCourse } = require("../controllers/progressController");

// Include other resource routers
const quizRouter = require("./quizRoutes");

// Re-route into other resource routers
router.use("/:courseId/quizzes", quizRouter);

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management and enrollment
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: JavaScript Fundamentals
 *               description:
 *                 type: string
 *                 example: Learn JavaScript from basics to advanced concepts
 *               category:
 *                 type: string
 *                 example: Programming
 *     responses:
 *       201:
 *         description: Course created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated JavaScript Course
 *               description:
 *                 type: string
 *                 example: Updated course description
 *               category:
 *                 type: string
 *                 example: Programming
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Successfully enrolled in course
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only students can enroll
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses/{courseId}/students:
 *   get:
 *     summary: Get students enrolled in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: List of enrolled students
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses/instructor/stats:
 *   get:
 *     summary: Get instructor statistics
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

// Course enrollment
router
  .route("/:courseId/enroll")
  .post(protect, authorize("Student"), enrollCourse);

// Instructor statistics
router
  .route("/instructor/stats")
  .get(protect, authorize("Instructor", "Admin"), getInstructorStats);

// Course students
router
  .route("/:courseId/students")
  .get(protect, authorize("Instructor", "Admin"), getCourseStudents);

// Courses
router
  .route("/")
  .get(getCourses)
  .post(protect, authorize("Instructor", "Admin"), createCourse);

// Single course
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("Instructor", "Admin"), updateCourse)
  .delete(protect, authorize("Instructor", "Admin"), deleteCourse);

module.exports = router;
