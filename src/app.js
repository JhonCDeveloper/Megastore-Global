const express = require('express');
const cors = require('cors');
const biRoutes = require('./routes/bi.routes');
const migrationRoutes = require('./routes/migration.routes');

const productRoutes = require('./routes/product.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/bi', biRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/products', productRoutes);

module.exports = app;