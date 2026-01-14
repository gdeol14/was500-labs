// Members Routes - defines all endpoints for the members resource

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const membersController = require('../controllers/members.controller');

// Validation rules for POST and PUT
const memberValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('age')
    .isInt({ min: 13, max: 999 })
    .withMessage('Age must be an integer between 13 and 999')
    .toInt(),
  body('role')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Role must be between 2 and 50 characters if provided')
    .escape()
];

// Routes
router.get('/', membersController.listMembers);
router.get('/:id', membersController.getMember);
router.post('/', memberValidation, membersController.createMember);
router.put('/:id', memberValidation, membersController.updateMember);
router.delete('/:id', membersController.deleteMember);

module.exports = router;