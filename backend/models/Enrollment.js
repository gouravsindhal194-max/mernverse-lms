const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: {
    type: Number, // Percentage 0-100
    default: 0,
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot be greater than 100']
  },
  completedResources: [{
    type: mongoose.Schema.ObjectId // References resource _id within Course
  }],
  quizScores: [{
    quiz: {
      type: mongoose.Schema.ObjectId,
      ref: 'Quiz'
    },
    score: Number,
    total: Number
  }],
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate enrollments
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
