const Quest = require('../models/Quest');

exports.getAllQuests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, difficulty, status, search, sort = '-createdAt' } = req.query;
    
    const query = {};
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const quests = await Quest.find(query)
      .populate('createdBy', 'username')
      .populate('npcs', 'name race class')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Quest.countDocuments(query);

    res.json({
      quests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuestById = async (req, res, next) => {
  try {
    const quest = await Quest.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('npcs', 'name race class level');
    
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    res.json({ quest });
  } catch (error) {
    next(error);
  }
};

exports.createQuest = async (req, res, next) => {
  try {
    const quest = new Quest({
      ...req.body,
      createdBy: req.userId
    });
    
    await quest.save();
    await quest.populate('createdBy', 'username');
    await quest.populate('npcs', 'name race class');
    
    res.status(201).json({
      message: 'Quest created successfully',
      quest
    });
  } catch (error) {
    next(error);
  }
};

exports.updateQuest = async (req, res, next) => {
  try {
    const quest = await Quest.findOne({
      _id: req.params.id,
      createdBy: req.userId
    });

    if (!quest) {
      return res.status(404).json({ error: 'Quest not found or unauthorized' });
    }

    Object.assign(quest, req.body);
    await quest.save();
    await quest.populate('createdBy', 'username');
    await quest.populate('npcs', 'name race class');

    res.json({
      message: 'Quest updated successfully',
      quest
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuest = async (req, res, next) => {
  try {
    const quest = await Quest.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId
    });

    if (!quest) {
      return res.status(404).json({ error: 'Quest not found or unauthorized' });
    }

    res.json({ message: 'Quest deleted successfully' });
  } catch (error) {
    next(error);
  }
};