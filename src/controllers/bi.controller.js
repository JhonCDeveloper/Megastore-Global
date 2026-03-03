const pool = require('../config/db.sql');

exports.suppliersAnalysis = async (req, res) => {
    const { rows } = await pool.query(`
        SELECT s.name, SUM(oi.quantity) AS total_items,
        SUM(oi.quantity * oi.unit_price) AS total_value
        FROM suppliers s
        JOIN products p ON p.supplier_id = p.id
        GROUP BY s.name
        ORDER BY total_items DESC
        `);

        res.json(rows);
};

exports.customerHistory = async (req, res) => {
    const { customerId } = req.params;

    const { rows } = await pool.query(`
        SELECT o.id, o.order_date, p.name, oi.quiantity,
        (oi.quantity * oi.unit_price) AS total
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON p.id = oi.product_id
        WHERE o.customer_id = $1
        ORDER BY o.order_date DESC    
        `, [customerId]);

        res.json(rows);
};

exports.topProducts = async (req, res) => {
    const { category } = req.params;

    const { rows } = await pool.query(`
        SELECT p.name, SUM(oi.quantity) AS units_sold,
        SUM(oi.quantity * oi.unit_price) AS revenue
        FROM products p
        JOIN categories c ON c.id = p.category_id
        JOIN order_items oi ON oi.product_id = p.id
        GROUP BY p.name
        ORDER BY revenue DESC
        `, [category]);

        res.json(rows);
};