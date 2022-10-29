# Raw Queries

As there are often use cases in which it is just easier to execute raw / already prepared SQL queries, you can use the sequelize.query method.

```javascript
const [results, metadata] = await sequelize.query("UPDATE users SET y = 42 WHERE x = 12");
// Results will be an empty array and metadata will contain the number of affected rows.
```

In cases where you don't need to access the metadata you can pass in a query type to tell sequelize how to format the results. For example, for a simple select query you could do:
```javascript
const { QueryTypes } = require('sequelize');
const users = await sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
// We didn't need to destructure the result here - the results were returned directly
```

A second option is the model. If you pass a model the returned data will be instances of that model.

```javascript
// Callee is the model definition. This allows you to easily map a query to a predefined model
const projects = await sequelize.query('SELECT * FROM projects', {
  model: Projects,
  mapToModel: true // pass true here if you have any mapped fields
});
// Each element of `projects` is now an instance of Project
```

See more options in the [query API reference](https://sequelize.org/api/v6/class/src/sequelize.js~Sequelize.html#instance-method-query). Some examples:

## "Dotted" attributes and the nest option
If an attribute name of the table contains dots, the resulting objects can become nested objects by setting the nest: true option. This is achieved with dottie.js under the hood. See below:

Without nest: true:
```javascript
const { QueryTypes } = require('sequelize');
const records = await sequelize.query('select 1 as `foo.bar.baz`', {
  type: QueryTypes.SELECT
});
console.log(JSON.stringify(records[0], null, 2));

{
  "foo.bar.baz": 1
}
```

With nest: true:
```javascript
const { QueryTypes } = require('sequelize');
const records = await sequelize.query('select 1 as `foo.bar.baz`', {
  nest: true,
  type: QueryTypes.SELECT
});
console.log(JSON.stringify(records[0], null, 2));

{
  "foo": {
    "bar": {
      "baz": 1
    }
  }
}
```

## Replacements

Replacements in a query can be done in two different ways, either using named parameters (starting with :), or unnamed, represented by a ?. Replacements are passed in the options object.

- If an array is passed, ? will be replaced in the order that they appear in the array
- If an object is passed, :key will be replaced with the keys from that object. If the object contains keys not found in the query or vice versa, an exception will be thrown.
```javascript
const { QueryTypes } = require('sequelize');

await sequelize.query(
  'SELECT * FROM projects WHERE status = ?',
  {
    replacements: ['active'],
    type: QueryTypes.SELECT
  }
);

await sequelize.query(
  'SELECT * FROM projects WHERE status = :status',
  {
    replacements: { status: 'active' },
    type: QueryTypes.SELECT
  }
);
```

Array replacements will automatically be handled, the following query searches for projects where the status matches an array of values.

```javascript
const { QueryTypes } = require('sequelize');

await sequelize.query(
  'SELECT * FROM projects WHERE status IN(:status)',
  {
    replacements: { status: ['active', 'inactive'] },
    type: QueryTypes.SELECT
  }
);
```

## [Bind Parameter](https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter)

Bind parameters are like replacements. Except replacements are escaped and inserted into the query by sequelize before the query is sent to the database, while bind parameters are sent to the database outside the SQL query text. A query can have either bind parameters or replacements. Bind parameters are referred to by either $1, $2, ... (numeric) or $key (alpha-numeric). This is independent of the dialect.

- If an array is passed, $1 is bound to the 1st element in the array (bind[0])
- If an object is passed, $key is bound to object['key']. Each key must begin with a non-numeric char. $1 is not a valid key, even if object['1'] exists.
- In either case $$ can be used to escape a literal $ sign.



# [Back Menu](./README.md#Menu)