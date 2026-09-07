const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video-link', 'local-video', 'pdf', 'doc'],
    default: 'video-link'
  },
  videoUrl: String,
  fileUrl: String
});

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  resources: [ResourceSchema]
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: 'no-photo.jpg'
  },
  introVideoType: {
    type: String,
    enum: ['video-link', 'local-video'],
    default: 'video-link'
  },
  introVideoUrl: {
    type: String,
    default: ''
  },
  modules: [ModuleSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);
