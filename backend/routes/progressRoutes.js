const express = require("express");

const {
  getMyEnrollments,
  updateProgress,
  markResourceComplete,
} = require("../controllers/progressController");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Student enrollment and course progress
 */

/**
 * @swagger
 * /api/progress/my-enrollments:
 *   get:
 *     summary: Get current student's enrollments
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of student's enrollments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only students can access enrollments
 */

/**
 * @swagger
 * /api/progress/{enrollmentId}:
 *   put:
 *     summary: Update course progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       400:
 *         description: Invalid progress data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only students can update progress
 *       404:
 *         description: Enrollment not found
 */

/**
 * @swagger
 * /api/progress/{courseId}/resource/{resourceId}/complete:
 *   post:
 *     summary: Mark a course resource as complete
 *     tags: [Progress]
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
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource marked as complete
 *       400:
 *         description: Invalid resource or request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only students can complete resources
 *       404:
 *         description: Course or resource not found
 */

router.get("/my-enrollments", protect, authorize("Student"), getMyEnrollments);

router.put("/:enrollmentId", protect, authorize("Student"), updateProgress);

router.post(
  "/:courseId/resource/:resourceId/complete",
  protect,
  authorize("Student"),
  markResourceComplete,
);

module.exports = router;
