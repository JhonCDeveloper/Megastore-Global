const service = require('../services/product.service');

exports.getAll = async (req, res) => {
    const products = await service.getAll();
    res.json(products);
};

exports.getById = async (req, res) => {
    const product = await
    service.getById(req.params.id);
    res.json(product);
};

exports.create = async (req, res) => {
    const product = await service.create(req.body);
    res.status(201).json(product);
};

exports.update = async (req, res) => {
    const product = await
    service.update(req.params.id, req.body);
    res.json(product);
};

exports.remove = async (req, res) => {
    try {
        await service.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: error.message});
    }
};