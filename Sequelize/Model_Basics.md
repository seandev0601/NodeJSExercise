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

# [Back Menu](./README.md#Menu)