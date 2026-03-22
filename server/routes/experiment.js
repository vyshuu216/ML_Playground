const express = require('express');
const router = express.Router();
const { saveExperiment, getExperiments, getExperiment, deleteExperiment } = require('../controllers/experimentController');

router.post('/', saveExperiment);
router.get('/', getExperiments);
router.get('/:id', getExperiment);
router.delete('/:id', deleteExperiment);

module.exports = router;
