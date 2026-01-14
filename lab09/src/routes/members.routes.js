const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/members.controller');

// Validation rules
const memberValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email'),
  body('age')
    .isInt({ min: 13, max: 999 })
    .withMessage('Age must be between 13 and 999'),
  body('role')
    .optional()
    .isIn(['Ranger', 'Archer', 'Warrior', 'Hobbit', 'Wizard', 'Dwarf'])
    .withMessage('Invalid role')
];

// Routes
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', memberValidation, createMember);
router.put('/:id', memberValidation, updateMember);
router.delete('/:id', deleteMember);

module.exports = router;