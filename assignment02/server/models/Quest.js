const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quest title is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Quest description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['Easy', 'Medium', 'Hard', 'Deadly']
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Failed'],
    default: 'Not Started'
  },
  reward: {
    type: String,
    trim: true
  },
  npcs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NPC'
  }],
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quest', questSchema);