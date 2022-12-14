const { Sequelize, DataTypes, Model } = require('sequelize')

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
  define: {
      timestamps: false
  }
})

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.')
  sequelize.close()
}).catch(error => {
  console.error('Unable to connect to the database:', error)
})