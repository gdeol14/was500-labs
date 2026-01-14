const express = require('express');
const router = express.Router();
const npcsController = require('../controllers/npcsController');
const auth = require('../middleware/auth');

router.get('/', npcsController.getAllNPCs);
router.get('/:id', npcsController.getNPCById);
router.post('/', auth, npcsController.createNPC);
router.put('/:id', auth, npcsController.updateNPC);
router.delete('/:id', auth, npcsController.deleteNPC);

module.exports = router;