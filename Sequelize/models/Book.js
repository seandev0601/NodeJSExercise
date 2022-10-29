const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("../config/database.js");

const Book = sequelize.define('Book', {
  // Let's say we wanted to see every username in uppercase, even
  // though they are not necessarily uppercase in the database itself
  book_title: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('book_title');
      return rawValue ? rawValue.toUpperCase() : null;
    }
  },
  author: { type: DataTypes.STRING },
  code: {
    type: DataTypes.STRING,
    set(value) {
      // Storing passwords in plaintext in the database is terrible.
      // Hashing the value with an appropriate cryptographic hash function is better.
      this.setDataValue('code', hash(value));
    }
  },
  price: { 
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
});

const book_getter = Book.build({ book_title: 'Software Design' });
console.log(book_getter.book_title); // 'SOFTWARE DESIGN'
console.log(book_getter.getDataValue('book_title')); // 'Software Design'

const book_setter = Book.build({ book_title: 'Design Pattern', code: 'ASBS123_dsas' });
console.log(book_setter.password); // '7cfc84b8ea898bb72462e78b4643cfccd77e9f05678ec2ce78754147ba947acc'
console.log(book_setter.getDataValue('password')); // '7cfc84b8ea898bb72462e78b4643cfccd77e9f05678ec2ce78754147ba947acc'

