const { Sequelize } = require('sequelize')

const userName = 'dev13134'
const password = 'Vul35l4191'
const dbHost = 'db4free.net'
const port = '3306'
const dbNmae = 'dbnodevul'

// Passing parameters separately (other dialects)
const sequelize = new Sequelize(dbNmae, userName, password, {
  host: dbHost,
  port: port,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 50000
  },
  define: {
    timestamps: false,
    freezeTableName: true
  }
})

module.exports = sequelize