const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: developer,
    database: 'node-complete',
    password: '',
})

module.exports = pool.promise()