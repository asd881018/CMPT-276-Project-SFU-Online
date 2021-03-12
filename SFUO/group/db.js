var { Pool } = require("pg");

var Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    database: "sfu",
    password: "Fujiwara",
    host: "localhost",
    port: 5432
});

module.exports = pool;
