const express = require('express');
const { addGadget, getGadget, updateGadget, decommissionGadget, selfDestruct } = require('../controllers/gadgetController');
const router = express.Router();

router.post('/', addGadget);
router.get('/', getGadget);
router.patch('/:id',updateGadget)
router.delete('/:id', decommissionGadget)
router.post('/:id/self-destruct',selfDestruct)


module.exports = router;