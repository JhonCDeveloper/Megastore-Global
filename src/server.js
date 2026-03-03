require('dotenv').config();

const app = require('./app');
const connectMongo = require('./config/db.mongo');

const PORT = process.env.PORT || 3000;

connectMongo();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});