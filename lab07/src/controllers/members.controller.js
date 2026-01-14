// Members Controller - handles all CRUD operations for Fellowship members

const fs = require('fs').promises;
const path = require('path');
const { validationResult } = require('express-validator');
const { ok, fail } = require('../utils/responses');

const DATA_FILE = path.join(__dirname, '../data/members.json');

// Helper: Read members from JSON file
const readMembers = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper: Write members to JSON file
const writeMembers = async (members) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(members, null, 2), 'utf8');
};

// Helper: Generate simple ID
const generateId = (members) => {
  if (members.length === 0) return 1;
  return Math.max(...members.map(m => m.id)) + 1;
};

// GET /api/v1/members - List all members (with filtering, sorting, pagination)
exports.listMembers = async (req, res, next) => {
  try {
    let members = await readMembers();
    
    // Filtering
    const { role, minAge, maxAge } = req.query;
    
    if (role) {
      members = members.filter(m => m.role && m.role.toLowerCase() === role.toLowerCase());
    }
    
    if (minAge) {
      const min = parseInt(minAge);
      members = members.filter(m => m.age >= min);
    }
    
    if (maxAge) {
      const max = parseInt(maxAge);
      members = members.filter(m => m.age <= max);
    }
    
    // Sorting
    const { sort = 'createdAt', order = 'asc' } = req.query;
    const validSortFields = ['name', 'createdAt'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order.toLowerCase() === 'desc' ? -1 : 1;
    
    members.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const total = members.length;
    const paginatedMembers = members.slice(startIndex, endIndex);
    
    res.status(200).json(ok(paginatedMembers, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/members/:id - Get single member
exports.getMember = async (req, res, next) => {
  try {
    const members = await readMembers();
    const id = parseInt(req.params.id);
    const member = members.find(m => m.id === id);
    
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
    
    const members = await readMembers();
    const { name, email, age, role } = req.body;
    
    const newMember = {
      id: generateId(members),
      name,
      email,
      age: parseInt(age),
      role: role || 'Member',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    members.push(newMember);
    await writeMembers(members);
    
    res.status(201).json(ok(newMember));
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
    
    const members = await readMembers();
    const id = parseInt(req.params.id);
    const index = members.findIndex(m => m.id === id);
    
    if (index === -1) {
      return res.status(404).json(fail('Member not found'));
    }
    
    const { name, email, age, role } = req.body;
    
    // Full replacement - keep id and createdAt
    members[index] = {
      id,
      name,
      email,
      age: parseInt(age),
      role: role || 'Member',
      createdAt: members[index].createdAt,
      updatedAt: new Date().toISOString()
    };
    
    await writeMembers(members);
    
    res.status(200).json(ok(members[index]));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/members/:id - Delete member
exports.deleteMember = async (req, res, next) => {
  try {
    const members = await readMembers();
    const id = parseInt(req.params.id);
    const index = members.findIndex(m => m.id === id);
    
    if (index === -1) {
      return res.status(404).json(fail('Member not found'));
    }
    
    members.splice(index, 1);
    await writeMembers(members);
    
    // Return 204 No Content (preferred) - no body
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};