const mongoose = require('mongoose');

const npcSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'NPC name is required'],
    trim: true,
    index: true
  },
  race: {
    type: String,
    required: [true, 'Race is required'],
    enum: ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling', 'Dragonborn', 'Other']
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    enum: ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Paladin', 'Barbarian', 'Bard', 'Druid', 'Monk', 'Sorcerer', 'Warlock', 'Commoner', 'Noble', 'Merchant', 'Other']
  },
  alignment: {
    type: String,
    required: [true, 'Alignment is required'],
    enum: ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil']
  },
  level: {
    type: Number,
    min: [1, 'Level must be at least 1'],
    max: [20, 'Level cannot exceed 20'],
    default: 1
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
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

module.exports = mongoose.model('NPC', npcSchema);