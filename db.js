const Pool = require("pg").Pool
require('dotenv').config();

const developmentConfig = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
}

const productionConfig = {
    connectionString: process.env.POSTGRES_URL,
    ssl:{
        rejectUnauthorized: false
    }
}

const pool = new Pool(developmentConfig);

module.exports = pool;