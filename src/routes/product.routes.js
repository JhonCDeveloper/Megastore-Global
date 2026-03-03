const express = require('express');
const router = express.Router();

const controller = require('../controllers/product.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id', controller.remove);

module.exports = router;