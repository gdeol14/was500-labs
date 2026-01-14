const Member = require('../models/member.model');
const { ok, fail } = require('../utils/responses');
const { validationResult } = require('express-validator');

// GET /api/v1/members - List all members with optional filters
exports.getAllMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', role, minAge, maxAge } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      if (maxAge) filter.age.$lte = parseInt(maxAge);
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 50); // Max 50 items
    const skip = (pageNum - 1) * limitNum;

    // Build sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    // Execute query
    const members = await Member.find(filter)
      .sort(sortObj)
      .limit(limitNum)
      .skip(skip);

    const total = await Member.countDocuments(filter);

    res.status(200).json(ok(members, {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum)
    }));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/members/:id - Get single member
exports.getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json(fail('Member not found'));
    }

    res.status(200).json(ok(member));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/members - Create new member
exports.createMember = async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(fail('Validation failed', errors.array()));
    }

    const member = await Member.create(req.body);
    res.status(201).json(ok(member));
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/members/:id - Update member (full replacement)
exports.updateMember = async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(fail('Validation failed', errors.array()));
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json(fail('Member not found'));
    }

    res.status(200).json(ok(member));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/members/:id - Delete member
exports.deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json(fail('Member not found'));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};