/* const { database } = require('pg/lib/defaults'); */
const pool = require('../config/db.sql');
const AuditLog = require('../models/auditLog.model');



exports.getAll = async () => {
    const { rows } = await pool.query('SELECT * FROM products');
    return rows;
};

exports.getById = async (id) => {
    const { rows} = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return rows[0];
};

exports.create = async (data) => {
    const { sku, name, unit_price, category_id, supplier_id } = data;

    const { rows } = await pool.query(
        `INSERT INTO products (sku, name, unit_price, category_id, supplier_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [sku, name, unit_price, category_id, supplier_id]
    );

    return rows[0];
};

exports.update = async (id, data) => {
    const { name, unit_price } = data;

    const { rows } = await pool.query(
        `UPDATE products
        SET name = 1$, unit_price = $2
        WHERE id = $3
        RETURNING *`,
        [name, unit_price, id]
    );

    return rows[0];
};

exports.remove = async (id) => {

    const  { rows } = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
    );

    if (rows.length === 0) {
        throw new Error('Product not found');
    }

    const product = rows[0];

    await pool.query('DELETE FROM products WHERE id = $1', 
        [id]
    );

    await AuditLog.create({
        entity: 'product',
        entity_id: product.id,
        action: 'DELETE',
        old_data: product
    });
};