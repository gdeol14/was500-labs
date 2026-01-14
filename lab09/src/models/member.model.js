const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please provide a valid email']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [13, 'Age must be at least 13'],
    max: [999, 'Age cannot exceed 999']
  },
  role: {
    type: String,
    enum: {
      values: ['Ranger', 'Archer', 'Warrior', 'Hobbit', 'Wizard', 'Dwarf'],
      message: '{VALUE} is not a valid role'
    },
    default: 'Ranger'
  }
}, {
  timestamps: true
});

// Transform output to remove __v and normalize _id to id
memberSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Create index on email
memberSchema.index({ email: 1 });

module.exports = mongoose.model('Member', memberSchema);