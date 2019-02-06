const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-complete', 'developer', '', {
    dialect: "mysql",
    host: "localhost"
})

module.exports = sequelize