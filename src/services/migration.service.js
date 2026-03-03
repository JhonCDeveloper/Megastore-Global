const fs = require('fs');
const readline = require('readline')
const pool = require('../config/db.sql')

const FILE_PATH = './data/raw_data.csv';

exports.importCSV = async () => {
    const fileStream = fs.createReadStream(FILE_PATH);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let isHeader = true;

    for await (const line of rl) {
        if (isHeader)  {
            isHeader = false;
            continue;
        }

        const [
            transaction_id,
            date,
            customer_name,
            customer_email,
            address,
            category_name,
            sku,
            product_name,
            unit_price,
            quiantity,
            supplier_name,
            supplier_contact
        ] = line.split(',');

        await processRow({
            date,
            customer_name,
            customer_email,
            address,
            category_name,
            sku,
            product_name,
            unit_price,
            quiantity,
            supplier_name,
            supplier_contact
        });
    }
};

const processRow = async (row) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        //CUSTOMER
        const customer = await client.query(
            `INSERT INTO customers (name, email, address)
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
            `, [row.customer_name, row.customer_email, row.address]
        );

        //SUPPLIER

        const supplier = await client.query(
            `INSERT INTO suppliers (name, contact_email)
            VALUES ($1, $2)
            ON CONFLICT (name) DO NOTHING
            RETURNING id
            `, [row.supplier_name, row.supplier_contact]
        );

        const supplierId = supplier.rows[0]?.id ||
        (await client.query(
            'SELECT id FROM suppliers WHERE name = $1',
            [row.supplier_name]
        )).rows[0].id;

        //CATEGORY
        const category = await client.query(
            `INSERT INTO categories (name)
            VALUES ($1)
            ON CONFLICT (name) DO NOTHING
            RETURNING id
            `, [row.category_name]
        );

        const categoryId = category.rows[0]?.id ||
        (await client.query(
            'SELECT id FROM categories WHERE name = $1',
            [row.category_name]
        )).rows[0].id;

        //PRODUCT
        const product = await client.query(
            `INSERT INTO products (sku, name, unit_price, category_id, supplier_id)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (sku) DO NOTHING
            RETURNING id`,
            [
            row.sku,
            row.product_name,
            row.unit_price,
            categoryId,
            supplierId
            ]
        );

        const productId = product.rows[0]?.id ||
        (await client.query(
            'SELECT id FROM products WHERE sku = $1',
            [row.sku]
        )).rows[0].id;

        //ORDER
        const order = await client.query(
            `INSERT INTO orders (order_date, customer_id)
            VALUES ($1, $2)
            RETURNING id`,
            [row.date, customer.rows[0].id]
        );

        //ORDER ITEM
        await client.query(
            `INSERT INTO order_items (order_id,
            product_id, quantity, unit_price)
            VALUES ($1, $2, $3, $4)`,
            [order.rows[0].id, productId, row.quiantity,
            row.unit_price]
        );

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
};