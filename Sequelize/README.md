# Start Sequelize

In this tutorial you will learn to make a simple setup of Sequelize.

## Installing

```
npm install --save sequelize
```

You'll also have to manually install the driver for your database of choice:
> This tutorial will use mysql

```
# One of the following:
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
$ npm install --save oracledb # Oracle Database
```

## Connecting to a database
> [Constructors](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize)
```javascript
const { Sequelize } = require('sequelize');

const userName = ''
const password = ''
const dbHost = 'localhost'
const port = '3306'
const dbNmae = ''

// Option 1: Passing a connection URI
const sequelize = new Sequelize('mysql://${userName}:${password}@${dbHost}:${port}/${dbName}') // Example for mysql

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize(dbNmae, userName, password, {
  host: dbHost,
  port: port
  dialect: 'mysql',/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
```

### Other [Connection Pool](https://sequelize.org/docs/v6/other-topics/connection-pool/)
```javascript
const sequelize = new Sequelize(/* ... */, {
  // ...
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
```

## Testing the connection

use the .authenticate() function to test if the connection is OK

```javascript
const sequelizeAuthenticate = async () => await sequelize.authenticate();

try {
  sequelizeAuthenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// or ======================================================================

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.')
}).catch(error => {
  console.error('Unable to connect to the database:', error)
})
```