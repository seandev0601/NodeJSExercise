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

# [Back Menu](./README.md#Menu)