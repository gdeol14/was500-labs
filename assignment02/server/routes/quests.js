const express = require('express');
const router = express.Router();
const questsController = require('../controllers/questsController');
const auth = require('../middleware/auth');

router.get('/', questsController.getAllQuests);
router.get('/:id', questsController.getQuestById);
router.post('/', auth, questsController.createQuest);
router.put('/:id', auth, questsController.updateQuest);
router.delete('/:id', auth, questsController.deleteQuest);

module.exports = router;