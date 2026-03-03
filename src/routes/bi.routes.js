const express = require('express');
const router = express.Router();
const controller = require('../controllers/bi.controller');

router.get('/suppliers-analysis',
    controller.suppliersAnalysis);
router.get('/customer-history/:customerId',
    controller.customerHistory);
router.get('/top-products/:category',
    controller.topProducts);

module.exports = router;