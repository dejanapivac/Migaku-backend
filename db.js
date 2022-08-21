const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "postgreSlonic22",
    host: "localhost",
    post: 5432,
    database: "migakudb"
});

module.exports = pool;