const express = require('express');
const router = express.Router();
const controller = require('../controllers/migration.controller');

router.post('/import', controller.importCSV);

module.exports = router;