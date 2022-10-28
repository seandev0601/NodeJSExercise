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

# Model Basics

## Concept
Models are the essence of Sequelize. A model is an abstraction that represents a table in your database. In Sequelize, it is a class that extends Model.

The model tells Sequelize several things about the entity it represents, such as the name of the table in the database and which columns it has (and their data types).

A model in Sequelize has a name. This name does not have to be the same name of the table it represents in the database. Usually, models have singular names (such as User) while tables have pluralized names (such as Users), although this is fully configurable.

## Model Definition

Models can be defined in two equivalent ways in Sequelize:

- Calling sequelize.define(modelName, attributes, options)
- Extending Model and calling init(attributes, options)

To learn with an example, we will consider that we want to create a model to represent users, which have a firstName and a lastName. We want our model to be called User, and the table it represents is called Users in the database.

### Using ``sequelize.define``:
```javascript
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
```

### Extending Model
```javascript
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}

User.init({
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});

// the defined model is the class itself
console.log(User === sequelize.models.User); // true
```

## Table name inference

Observe that, in both methods above, the table name (Users) was never explicitly defined. However, the model name was given (User).

By default, when the table name is not given, Sequelize automatically pluralizes the model name and uses that as the table name. This pluralization is done under the hood by a library called inflection, so that irregular plurals (such as person -> people) are computed correctly.

### Enforcing the table name to be equal to the model name

You can stop the auto-pluralization performed by Sequelize using the ``freezeTableName: true`` option. This way, Sequelize will infer the table name to be equal to the model name, without any modifications:

```javascript
sequelize.define('User', {
  // ... (attributes)
}, {
  freezeTableName: true
});
```

This behavior can also be defined globally for the sequelize instance, when it is created:

```javascript
const sequelize = new Sequelize('sqlite::memory:', {
  define: {
    freezeTableName: true
  }
});
```

### Providing the table name directly

You can simply tell Sequelize the name of the table directly as well:
```javascript
sequelize.define('User', {
  // ... (attributes)
}, {
  tableName: 'Employees'
});
```

## Model synchronization

A model can be synchronized with the database by calling ``model.sync(options)``, an asynchronous function (that returns a Promise). With this call, Sequelize will automatically perform an SQL query to the database. Note that this changes only the table in the database, not the model in the JavaScript side.

- **User.sync()** - This creates the table if it doesn't exist (and does nothing if it already exists)
- **User.sync({ force: true })** - This creates the table, **dropping it first** if it already existed
- **User.sync({ alter: true })** - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the **necessary changes** in the table to make it match the model.

Example:
```javascript
await User.sync({ force: true });
console.log("The table for the User model was just (re)created!");
```

### Synchronizing all models at once

use sequelize.sync() to automatically synchronize all models. Example:
```javascript
await sequelize.sync({ force: true });
console.log("All models were synchronized successfully.");
```

### Dropping tables
```javascript
await User.drop();
console.log("User table dropped!");

//drop all tables
await sequelize.drop();
console.log("All tables dropped!");
```

### Database safety check

As shown above, the sync and drop operations are destructive. Sequelize accepts a match option as an additional safety check, which receives a RegExp:
```javascript
// This will run .sync() only if database name ends with '_test'
sequelize.sync({ force: true, match: /_test$/ });
```


## Timestamps

By default, Sequelize automatically adds the fields createdAt and updatedAt to every model, using the data type DataTypes.DATE.

This behavior can be disabled for a model with the timestamps: false option:

```javascript
sequelize.define('User', {
  // ... (attributes)
}, {
  timestamps: false
});
```

It is also possible to enable only one of createdAt/updatedAt, and to provide a custom name for these columns:

```javascript
class Foo extends Model {}
Foo.init({ /* attributes */ }, {
  sequelize,

  // don't forget to enable timestamps!
  timestamps: true,

  // I don't want createdAt
  createdAt: false,

  // I want updatedAt to actually be called updateTimestamp
  updatedAt: 'updateTimestamp'
});
```

## Column declaration shorthand syntax

```javascript
// This:
sequelize.define('User', {
  name: {
    type: DataTypes.STRING
  }
});

// Can be simplified to:
sequelize.define('User', { name: DataTypes.STRING });
```

## Default Values

```javascript
sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    defaultValue: "John Doe"
  }
});

// DataTypes.NOW
sequelize.define('Foo', {
  bar: {
    type: DataTypes.DATETIME,
    defaultValue: DataTypes.NOW
    // This way, the current date/time will be used to populate this column (at the moment of insertion)
  }
});
```

## [Data Types](https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types)

- [String](https://sequelize.org/docs/v6/core-concepts/model-basics/#Strings)
- [Boolean](https://sequelize.org/docs/v6/core-concepts/model-basics/#Boolean)
- [Numbers](https://sequelize.org/docs/v6/core-concepts/model-basics/#Numbers)
- [Dates](https://sequelize.org/docs/v6/core-concepts/model-basics/#Dates)
- [UUIDs](https://sequelize.org/docs/v6/core-concepts/model-basics/#UUIDS)

## Column Options

When defining a column
- the type
- allowNull
- defaultValue
```javascript
// instantiating will automatically set the flag to true if not set
flag: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
```
- unique
```javascript
// The unique property is simply a shorthand to create a unique constraint.
someUnique: { type: DataTypes.STRING, unique: true },
```
- primaryKey
```javascript
// Go on reading for further information about primary keys
identifier: { type: DataTypes.STRING, primaryKey: true },
```
- autoIncrement
```javascript
// autoIncrement can be used to create auto_incrementing integer columns
incrementMe: { type: DataTypes.INTEGER, autoIncrement: true }
```
- foreign keys
```javascript
// It is possible to create foreign keys:
bar_id: {
  type: DataTypes.INTEGER,

  references: {
    // This is a reference to another model
    model: Bar,

    // This is the column name of the referenced model
    key: 'id',

    // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
    deferrable: Deferrable.INITIALLY_IMMEDIATE
    // Options:
    // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
    // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
    // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
}
```
- Comments
```javascript
  // Comments can only be added to columns in MySQL, MariaDB, PostgreSQL and MSSQL
  commentMe: {
    type: DataTypes.INTEGER,
    comment: 'This is a column name that has a comment'
  }
```

## Taking advantage of Models being classes

The Sequelize models are ES6 classes. You can very easily add custom instance or class level methods.

```javascript
class User extends Model {
  static classLevelMethod() {
    return 'foo';
  }
  instanceLevelMethod() {
    return 'bar';
  }
  getFullname() {
    return [this.firstname, this.lastname].join(' ');
  }
}
User.init({
  firstname: Sequelize.TEXT,
  lastname: Sequelize.TEXT
}, { sequelize });

console.log(User.classLevelMethod()); // 'foo'
const user = User.build({ firstname: 'Jane', lastname: 'Doe' });
console.log(user.instanceLevelMethod()); // 'bar'
console.log(user.getFullname()); // 'Jane Doe'
```

# Model Instances

## Creating an instance

Create instances by using the ``build`` method.
```javascript
const jane = User.build({ name: "Jane" });
console.log(jane instanceof User); // true
console.log(jane.name); // "Jane"
```

The **build** method only creates an object that represents data that can be mapped to a database. In order to really **save** (i.e. persist) this instance in the database, the save method should be used:

```javascript
await jane.save();
console.log('Jane was saved to the database!');
```

### A very useful shortcut: the create method
```javascript
const jane = await User.create({ name: "Jane" });
// Jane exists in the database now!
console.log(jane instanceof User); // true
console.log(jane.name); // "Jane"

console.log(jane.toJSON()); // This is good!
console.log(JSON.stringify(jane, null, 4)); // This is also good!
```

## Updating an instance

```javascript
const jane = await User.create({ name: "Jane" });
console.log(jane.name); // "Jane"
jane.name = "Ada";
// the name is still "Jane" in the database
await jane.save();
// Now the name was updated to "Ada" in the database!

// Or update several fields at once with the set method
jane.set({
  name: "Ada",
  favoriteColor: "blue"
});
// As above, the database still has "Jane" and "green"
await jane.save();
// The database now has "Ada" and "blue" for name and favorite color
```

## Deleting an instance

```javascript
const jane = await User.create({ name: "Jane" });
console.log(jane.name); // "Jane"
await jane.destroy();
// Now this entry was removed from the database
```

## Reloading an instance
```javascrip
const jane = await User.create({ name: "Jane" });
console.log(jane.name); // "Jane"
jane.name = "Ada";
// the name is still "Jane" in the database
await jane.reload();
console.log(jane.name); // "Jane"
```

## Saving only some fields
```javascript
const jane = await User.create({ name: "Jane" });
console.log(jane.name); // "Jane"
console.log(jane.favoriteColor); // "green"
jane.name = "Jane II";
jane.favoriteColor = "blue";
await jane.save({ fields: ['name'] });
console.log(jane.name); // "Jane II"
console.log(jane.favoriteColor); // "blue"
// The above printed blue because the local object has it set to blue, but
// in the database it is still "green":
await jane.reload();
console.log(jane.name); // "Jane II"
console.log(jane.favoriteColor); // "green"
```

## Incrementing and decrementing integer values

```javascript
const jane = await User.create({ name: "Jane", age: 100, cash: 5000 });
const incrementResult = await jane.increment('age', { by: 2 });


// increment multiple fields
await jane.increment({
  'age': 2,
  'cash': 100
});

// If the values are incremented by the same amount, you can use this other syntax as well:
await jane.increment(['age', 'cash'], { by: 2 });
```

# Model Querying

## Simple INSERT queries

```javascript
// Create a new user
const jane = await User.create({ firstName: "Jane", lastName: "Doe" });
console.log("Jane's auto-generated ID:", jane.id);

// the User model to set only an username but not an admin flag (i.e., isAdmin):
const user = await User.create({
  username: 'alice123',
  isAdmin: true
}, { fields: ['username'] });
// let's assume the default of isAdmin is false
console.log(user.username); // 'alice123'
console.log(user.isAdmin); // false
```

## Simple SELECT queries

```javascript
// Find all users
const users = await User.findAll();
console.log(users.every(user => user instanceof User)); // true
console.log("All users:", JSON.stringify(users, null, 2));
```

## Finders

### findAll
a standard SELECT query which will retrieve all entries from the table (unless restricted by something like a where clause, for example).

### findByPk

The findByPk method obtains only a single entry from the table, using the provided primary key.
```javascript
const project = await Project.findByPk(123);
if (project === null) {
  console.log('Not found!');
} else {
  console.log(project instanceof Project); // true
  // Its primary key is 123
}
```

### findOne

The findOne method obtains the first entry it finds (that fulfills the optional query options, if provided).
```javascript
const project = await Project.findOne({ where: { title: 'My Title' } });
if (project === null) {
  console.log('Not found!');
} else {
  console.log(project instanceof Project); // true
  console.log(project.title); // 'My Title'
}
```

### findOrCreate

The method findOrCreate will create an entry in the table unless it can find one fulfilling the query options.

The where option is considered for finding the entry, and the defaults option is used to define what must be created in case nothing was found. If the defaults do not contain values for every column, Sequelize will take the values given to where (if present).

Let's assume we have an empty database with a User model which has a username and a job.
```javascript
const [user, created] = await User.findOrCreate({
  where: { username: 'sdepold' },
  defaults: {
    job: 'Technical Lead JavaScript'
  }
});
console.log(user.username); // 'sdepold'
console.log(user.job); // This may or may not be 'Technical Lead JavaScript'
console.log(created); // The boolean indicating whether this instance was just created
if (created) {
  console.log(user.job); // This will certainly be 'Technical Lead JavaScript'
}
```

### [findAndCountAll](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findandcountall)

The findAndCountAll method is a convenience method that combines findAll and count.

When group is not provided, the findAndCountAll method returns an object with two properties:

- **count** - an integer - the total number records matching the query
- **rows** - an array of objects - the obtained records
- 
When group is provided, the findAndCountAll method returns an object with two properties:

- **count** - an array of objects - contains the count in each group and the projected attributes
- **rows** - an array of objects - the obtained records

```javascript
const { count, rows } = await Project.findAndCountAll({
  where: {
    title: {
      [Op.like]: 'foo%'
    }
  },
  offset: 10,
  limit: 2
});
console.log(count);
console.log(rows);
```

### Specifying attributes for SELECT queries

```javascript
// SELECT firstName, favoriteColor FROM ...
const users = await User.findAll({
  attributes: ['firstName', 'favoriteColor']
});
console.log("All users:", JSON.stringify(users, null, 2));

// SELECT firstName, favoriteColor AS color, age FROM ...
const users = await User.findAll({
  attributes: ['firstName', ['favoriteColor', 'color'], 'age']
});
```

```javascript
// This is a tiresome way of getting the number of hats (along with every column)
Model.findAll({
  attributes: [
    'id', 'foo', 'bar', 'baz', 'qux', 'hats', // We had to list all attributes...
    [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'] // To add the aggregation...
  ]
});
//SELECT id, foo, bar, baz, qux, hats, COUNT(hats) AS n_hats FROM ...
```

Similarly, it's also possible to remove a selected few attributes:
```javascript
Model.findAll({
  attributes: { exclude: ['baz'] }
});

// Assuming all columns are 'id', 'foo', 'bar', 'baz' and 'qux'
// SELECT id, foo, bar, qux FROM ...
```

## Applying WHERE clauses

```javascript
Post.findAll({
  where: {
    authorId: 2
  }
});
// SELECT * FROM post WHERE authorId = 2;

// OR ===================================
const { Op } = require("sequelize");
Post.findAll({
  where: {
    authorId: {
      [Op.eq]: 2
    }
  }
});
// SELECT * FROM post WHERE authorId = 2;
```

Multiple checks can be passed:
```javascript
Post.findAll({
  where: {
    authorId: 12,
    status: 'active'
  }
});
// SELECT * FROM post WHERE authorId = 12 AND status = 'active';

// Op AND ===================================

const { Op } = require("sequelize");
Post.findAll({
  where: {
    [Op.and]: [
      { authorId: 12 },
      { status: 'active' }
    ]
  }
});
// SELECT * FROM post WHERE authorId = 12 AND status = 'active';

// Op OR ===================================
const { Op } = require("sequelize");
Post.findAll({
  where: {
    [Op.or]: [
      { authorId: 12 },
      { authorId: 13 }
    ]
  }
});
// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;
```

Or involving the same field
```javascript
const { Op } = require("sequelize");
Post.destroy({
  where: {
    authorId: {
      [Op.or]: [12, 13]
    }
  }
});
// DELETE FROM post WHERE authorId = 12 OR authorId = 13;
```

### [Operators](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators)

### [Logical combinations with operators](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#logical-combinations-with-operators)

### [Advanced queries with functions (not just columns)](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#advanced-queries-with-functions-not-just-columns)

## Simple UPDATE queries

```javascript
// Change everyone without a last name to "Doe"
await User.update({ lastName: "Doe" }, {
  where: {
    lastName: null
  }
});
```

## Simple DELETE queries

```javascript
// Delete everyone named "Jane"
await User.destroy({
  where: {
    firstName: "Jane"
  }
});

// Truncate the table
await User.destroy({
  truncate: true
});
```

## Creating in bulk

Sequelize provides the Model.bulkCreate method to allow creating multiple records at once, with only one query.

```javascript
const captains = await Captain.bulkCreate([
  { name: 'Jack Sparrow' },
  { name: 'Davy Jones' }
]);
console.log(captains.length); // 2
console.log(captains[0] instanceof Captain); // true
console.log(captains[0].name); // 'Jack Sparrow'
console.log(captains[0].id); // 1 // (or another auto-generated value)
```

bulkCreate does not run validations on each object that is going to be created

```javascript
const Foo = sequelize.define('foo', {
  bar: {
    type: DataTypes.TEXT,
    validate: {
      len: [4, 6]
    }
  }
});

// This will not throw an error, both instances will be created
await Foo.bulkCreate([
  { name: 'abc123' },
  { name: 'name too long' }
]);

// This will throw an error, nothing will be created
await Foo.bulkCreate([
  { name: 'abc123' },
  { name: 'name too long' }
], { validate: true });
```

## Ordering and Grouping

### [Ordering](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#ordering)

These items are themselves arrays in the form **[column, direction]**. The column will be escaped correctly and the direction will be checked in a whitelist of valid directions (such as **ASC, DESC, NULLS FIRST**, etc).

```javascript
Subtask.findAll({
  order: [
    ['title', 'DESC']
  ]
    // Will escape title and validate DESC against a list of valid direction parameters
});
```

## Grouping
```javascript
Project.findAll({ group: 'name' });
// yields 'GROUP BY name'
```

## Limits and Pagination
```javascript
// Fetch 10 instances/rows
Project.findAll({ limit: 10 });

// Skip 8 instances/rows
Project.findAll({ offset: 8 });

// Skip 5 instances and fetch the 5 after that
Project.findAll({ offset: 5, limit: 5 });
```

## Utility methods

### count

```javascript
console.log(`There are ${await Project.count()} projects`);

const amount = await Project.count({
  where: {
    id: {
      [Op.gt]: 25
    }
  }
});
console.log(`There are ${amount} projects with an id greater than 25`);
```

### max,min,and sum

```javascript
await User.max('age'); // 40
await User.max('age', { where: { age: { [Op.lt]: 20 } } }); // 10
await User.min('age'); // 5
await User.min('age', { where: { age: { [Op.gt]: 5 } } }); // 10
await User.sum('age'); // 55
await User.sum('age', { where: { age: { [Op.gt]: 5 } } }); // 50
```
### increment, decrement

```javascript
await User.increment({age: 5}, { where: { id: 1 } }) // Will increase age to 15
await User.increment({age: -5}, { where: { id: 1 } }) // Will decrease age to 5
```

```
node ./Sequelize/db_connection.js
```