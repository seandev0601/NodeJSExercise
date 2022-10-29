# Start Sequelize

# Tutorial Resource
- [Sequelize office](https://sequelize.org/docs/v6/)
- [Sequelize office中文](https://sequelize.cn/docs/v6/)
- [the-comprehensive-sequelize-cheatsheet](https://dev.to/projectescape/the-comprehensive-sequelize-cheatsheet-3m1m)


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

### Closing the connection

Sequelize will keep the connection open by default, and use the same connection for all queries. If you need to close the connection, call ``sequelize.close()`` (which is asynchronous and returns a Promise).

### Logging

By default, Sequelize will log to console every SQL query it performs. The options.logging option can be used to customize this behavior, by defining the function that gets executed every time Sequelize would log something.

```javascript
const sequelize = new Sequelize('sqlite::memory:', {
  // Choose one of the logging options
  logging: console.log,                  // Default, displays the first parameter of the log function call
  logging: (...msg) => console.log(msg), // Displays all log function call parameters
  logging: false,                        // Disables logging
  logging: msg => logger.debug(msg),     // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
  logging: logger.debug.bind(logger)     // Alternative way to use custom logger, displays all messages
});
```

# Menu

- #### [Model Basics](./Model_Basics.md)
- #### [Model Instances](./Model_Instance.md)
- #### [Model Querying](./Model_Querying.md)
- #### [Getters, Setters & Virtuals](./Getters_Setters_Virtuals.md)
- #### [Validations & Constraints](./Validations_Constraints.md)
- #### [Raw Queries](./Raw_Queries.md)

---

- #### [Associations](https://sequelize.org/docs/v6/core-concepts/assocs/)
- #### [Advanced Association Concepts](https://sequelize.org/docs/v6/category/advanced-association-concepts/)
- #### [Other topics](https://sequelize.org/docs/v6/category/other-topics/)