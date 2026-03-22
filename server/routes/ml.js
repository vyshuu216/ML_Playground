const express = require('express');
const router = express.Router();
const { runAlgorithm, getDataset } = require('../controllers/mlController');

router.post('/run', runAlgorithm);
router.get('/dataset', getDataset);

module.exports = router;
