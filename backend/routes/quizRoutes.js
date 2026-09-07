const express = require("express");

const {
  getQuizzes,
  getQuiz,
  createQuiz,
  submitQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

const router = express.Router({ mergeParams: true }); // Merge params to get courseId from other routers

const { protect, authorize } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management and submission
 */

/**
 * @swagger
 * /api/courses/{courseId}/quizzes:
 *   get:
 *     summary: Get quizzes for a course
 *     tags: [Quizzes]
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
 *         description: List of quizzes
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses/{courseId}/quizzes:
 *   post:
 *     summary: Create a quiz for a course
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
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
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses/{courseId}/quizzes/{id}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 */

/**
 * @swagger
 * /api/courses/{courseId}/quizzes/{id}:
 *   put:
 *     summary: Update a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Quiz not found
 */

/**
 * @swagger
 * /api/courses/{courseId}/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Quiz not found
 */

/**
 * @swagger
 * /api/courses/{courseId}/quizzes/{id}/submit:
 *   post:
 *     summary: Submit answers for a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 0]
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 *       400:
 *         description: Invalid or missing answers
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 */

/* Existing routes */

router
  .route("/")
  .get(protect, getQuizzes)
  .post(protect, authorize("Instructor", "Admin"), createQuiz);

router
  .route("/:id")
  .get(protect, getQuiz)
  .put(protect, authorize("Instructor", "Admin"), updateQuiz)
  .delete(protect, authorize("Instructor", "Admin"), deleteQuiz);

router.route("/:id/submit").post(protect, submitQuiz);

module.exports = router;
