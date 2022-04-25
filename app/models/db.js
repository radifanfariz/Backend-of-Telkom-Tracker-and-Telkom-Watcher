const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

//create db conection
// const connection = mysql.createConnection({
//     host: dbConfig.HOST,
//     user: dbConfig.USER,
//     port: dbConfig.PORT,
//     password: dbConfig.PASSWORD,
//     database: dbConfig.DB
// });

//create db conection pool
const connection = mysql.createPool({
    connectionLimit: 100,
    host: dbConfig.HOST,
    user: dbConfig.USER,
    port: dbConfig.PORT,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    debug: false,
});

// connection.connect(error => {
//     if (error) throw error;
//     console.log("Successfully connected to the databases");
// });

module.exports = connection;