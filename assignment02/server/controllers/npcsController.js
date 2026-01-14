const NPC = require('../models/NPC');

exports.getAllNPCs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, race, class: npcClass, search, sort = '-createdAt' } = req.query;
    
    const query = {};
    
    if (race) {
      query.race = race;
    }
    
    if (npcClass) {
      query.class = npcClass;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const npcs = await NPC.find(query)
      .populate('createdBy', 'username')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await NPC.countDocuments(query);

    res.json({
      npcs,
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

exports.getNPCById = async (req, res, next) => {
  try {
    const npc = await NPC.findById(req.params.id).populate('createdBy', 'username');
    
    if (!npc) {
      return res.status(404).json({ error: 'NPC not found' });
    }

    res.json({ npc });
  } catch (error) {
    next(error);
  }
};

exports.createNPC = async (req, res, next) => {
  try {
    const npc = new NPC({
      ...req.body,
      createdBy: req.userId
    });
    
    await npc.save();
    await npc.populate('createdBy', 'username');
    
    res.status(201).json({
      message: 'NPC created successfully',
      npc
    });
  } catch (error) {
    next(error);
  }
};

exports.updateNPC = async (req, res, next) => {
  try {
    const npc = await NPC.findOne({
      _id: req.params.id,
      createdBy: req.userId
    });

    if (!npc) {
      return res.status(404).json({ error: 'NPC not found or unauthorized' });
    }

    Object.assign(npc, req.body);
    await npc.save();
    await npc.populate('createdBy', 'username');

    res.json({
      message: 'NPC updated successfully',
      npc
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNPC = async (req, res, next) => {
  try {
    const npc = await NPC.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId
    });

    if (!npc) {
      return res.status(404).json({ error: 'NPC not found or unauthorized' });
    }

    res.json({ message: 'NPC deleted successfully' });
  } catch (error) {
    next(error);
  }
};