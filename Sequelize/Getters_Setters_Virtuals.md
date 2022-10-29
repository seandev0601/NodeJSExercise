# Getters, Setters & Virtuals

Sequelize allows you to define custom getters and setters for the attributes of your models.

## Getters

``` javascript
const User = sequelize.define('user', {
  // Let's say we wanted to see every username in uppercase, even
  // though they are not necessarily uppercase in the database itself
  username: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('username');
      return rawValue ? rawValue.toUpperCase() : null;
    }
  }
});
```

This getter, just like a standard JavaScript getter, is called automatically when the field value is read:

```javascript
const user = User.build({ username: 'SuperUser123' });
console.log(user.username); // 'SUPERUSER123'
console.log(user.getDataValue('username')); // 'SuperUser123'
```

## Setters

A setter is a set() function defined for one column in the model definition. It receives the value being set:

```javascript
const User = sequelize.define('user', {
  username: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    set(value) {
      // Storing passwords in plaintext in the database is terrible.
      // Hashing the value with an appropriate cryptographic hash function is better.
      this.setDataValue('password', hash(value));
    }
  }
});
```

```javascript
const user = User.build({ username: 'someone', password: 'NotSo§tr0ngP4$SW0RD!' });
console.log(user.password); // '7cfc84b8ea898bb72462e78b4643cfccd77e9f05678ec2ce78754147ba947acc'
console.log(user.getDataValue('password')); // '7cfc84b8ea898bb72462e78b4643cfccd77e9f05678ec2ce78754147ba947acc'
```

If we wanted to involve another field from our model instance in the computation, that is possible and very easy!

```javascript
const User = sequelize.define('user', {
  username: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    set(value) {
      // Storing passwords in plaintext in the database is terrible.
      // Hashing the value with an appropriate cryptographic hash function is better.
      // Using the username as a salt is better.
      this.setDataValue('password', hash(this.username + value));
    }
  }
});
```

## Combining getters and setters

Getters and setters can be both defined in the same field.

For the sake of an example, let's say we are modeling a Post, whose content is a text of unlimited length. To improve memory usage, let's say we want to store a gzipped version of the content.

```javascript
const { gzipSync, gunzipSync } = require('zlib');

const Post = sequelize.define('post', {
  content: {
    type: DataTypes.TEXT,
    get() {
      const storedValue = this.getDataValue('content');
      const gzippedBuffer = Buffer.from(storedValue, 'base64');
      const unzippedBuffer = gunzipSync(gzippedBuffer);
      return unzippedBuffer.toString();
    },
    set(value) {
      const gzippedBuffer = gzipSync(value);
      this.setDataValue('content', gzippedBuffer.toString('base64'));
    }
  }
});
```

With the above setup, whenever we try to interact with the content field of our Post model, Sequelize will automatically handle the custom getter and setter. For example:

```javascript
const post = await Post.create({ content: 'Hello everyone!' });

console.log(post.content); // 'Hello everyone!'
// Everything is happening under the hood, so we can even forget that the
// content is actually being stored as a gzipped base64 string!

// However, if we are really curious, we can get the 'raw' data...
console.log(post.getDataValue('content'));
// Output: 'H4sIAAAAAAAACvNIzcnJV0gtSy2qzM9LVQQAUuk9jQ8AAAA='
```

## Virtual fields

Virtual fields are fields that Sequelize populates under the hood, but in reality they don't even exist in the database.

```javascript
const { DataTypes } = require("sequelize");

const User = sequelize.define('user', {
  firstName: DataTypes.TEXT,
  lastName: DataTypes.TEXT,
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
    set(value) {
      throw new Error('Do not try to set the `fullName` value!');
    }
  }
});
```

The VIRTUAL field does not cause a column in the table to exist. In other words, the model above will not have a fullName column. However, it will appear to have it!

```javascript
const user = await User.create({ firstName: 'John', lastName: 'Doe' });
console.log(user.fullName); // 'John Doe'
```


# [Back Menu](./README.md#Menu)