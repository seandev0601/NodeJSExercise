# Validations & Constraints

In this tutorial you will learn how to setup validations and constraints for your models in Sequelize.

```javascript
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define("user", {
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  hashedPassword: {
    type: DataTypes.STRING(64),
    validate: {
      is: /^[0-9a-f]{64}$/i
    }
  }
});

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();
```

## Difference between Validations and Constraints

**Validations** are checks performed in the Sequelize level, **in pure JavaScript**. They can be arbitrarily complex if you provide a custom validator function, or can be one of the built-in validators offered by Sequelize. If a validation fails, no SQL query will be sent to the database at all.

On the other hand, **constraints** are rules defined **at SQL level**. The most basic example of constraint is an Unique Constraint. If a constraint check fails, an error will be thrown by the database and Sequelize will forward this error to JavaScript (in this example, throwing a SequelizeUniqueConstraintError). Note that in this case, the SQL query was performed, unlike the case for validations.

## Unique Constraint
```javascript
/* ... */ {
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
} /* ... */
```

When this model is synchronized (by calling sequelize.sync for example), the username field will be created in the table as `username` TEXT UNIQUE, and an attempt to insert an username that already exists there will throw a SequelizeUniqueConstraintError.


## Allowing/disallowing null values

By default, null is an allowed value for every column of a model. This can be disabled setting the allowNull: false option for a column, as it was done in the username field from our code example:

```javascript
/* ... */ {
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
} /* ... */
```

## Validators
Model validators allow you to specify format/content/inheritance validations for each attribute of the model. Validations are automatically run on create, update and save. You can also call validate() to manually validate an instance.

### [Per-attribute validations](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/#per-attribute-validations)

```javascript
sequelize.define('foo', {
  bar: {
    type: DataTypes.STRING,
    validate: {
      is: /^[a-z]+$/i,          // matches this RegExp
      is: ["^[a-z]+$",'i'],     // same as above, but constructing the RegExp from a string
      ...
        
      // Examples of custom validators:
      isEven(value) {
        if (parseInt(value) % 2 !== 0) {
          throw new Error('Only even values are allowed!');
        }
      }
      isGreaterThanOtherField(value) {
        if (parseInt(value) <= parseInt(this.otherField)) {
          throw new Error('Bar must be greater than otherField.');
        }
      }
    }
  }
});
```

To use a custom error message instead of that provided by validator.js, use an object instead of the plain value or array of arguments, for example a validator which needs no argument can be given a custom message with
```javascript
isInt: {
  msg: "Must be an integer number of pennies"
}
```

or if arguments need to also be passed add an args property:
```javascript
isIn: {
  args: [['en', 'zh']],
  msg: "Must be English or Chinese"
}
```

When using custom validator functions the error message will be whatever message the thrown Error object holds.

### [allowNull interaction with other validators
](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/#allownull-interaction-with-other-validators)

### Model-wide validations(https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/#model-wide-validations)



# [Back Menu](./README.md#Menu)