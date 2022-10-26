# MySQL

## Install MySQL Driver

```
npm install mysql
```
Node.js can use this module to manipulate the MySQL database:
```javascript
var mysql = require('mysql');
```

## Create Connection

### db_connection.js

```javascript
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "dbname"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
```

### Query a Database

```javascript
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
});
```

### Create Database
```javascript
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE mydb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});
```

### Create a Table
```javascript
  var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
```

### Alert Table primary key
```javascript
  var sql = "ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table altered");
  });
```


## Insert

### Insert into table
```javascript
  var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
```

### Insert multiple Records
```javascript
  var sql = "INSERT INTO customers (name, address) VALUES ?";
  var values = [
    ['John', 'Highway 71'],
    ['Peter', 'Lowstreet 4'],
    ['Amy', 'Apple st 652'],
    ['Hannah', 'Mountain 21'],
    ['Michael', 'Valley 345'],
    ['Sandy', 'Ocean blvd 2'],
    ['Betty', 'Green Grass 1'],
    ['Richard', 'Sky st 331'],
    ['Susan', 'One way 98'],
    ['Vicky', 'Yellow Garden 2'],
    ['Ben', 'Park Lane 38'],
    ['William', 'Central st 954'],
    ['Chuck', 'Main Road 989'],
    ['Viola', 'Sideway 1633']
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
```

### The Result Object
When executing a query, a result object is returned.

The result object contains information about how the query affected the table.

The result object returned from the example above looks like this:
```javascript
{
  fieldCount: 0,
  affectedRows: 14,
  insertId: 0,
  serverStatus: 2,
  warningCount: 0,
  message: '\'Records:14  Duplicated: 0  Warnings: 0',
  protocol41: true,
  changedRows: 0
}

Example
console.log(result.affectedRows) //print 14
```

### Get Inserted ID
```javascript
  var sql = "INSERT INTO customers (name, address) VALUES ('Michelle', 'Blue Village 1')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted, ID: " + result.insertId);
  });
```

## Select

### Select from a table
```javascript
  con.query("SELECT * FROM customers", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
```

### Select columns
```javascript
  con.query("SELECT name, address FROM customers", function (err, result, fields) {
    if (err) throw err;
    console.log(result);

    //Return the address of the third record
    console.log(result[2].address);
  });
```

### The Fields Object
```javascript
  con.query("SELECT name, address FROM customers", function (err, result, fields) {
    if (err) throw err;
    console.log(fields);
  });

//
[
  FieldPacket {
    catalog: 'def',
    db: 'dbnodevul',
    table: 'customers',
    orgTable: 'customers',
    name: 'name',
    orgName: 'name',
    charsetNr: 255,
    length: 1020,
    type: 253,
    flags: 0,
    decimals: 0,
    default: undefined,
    zeroFill: false,
    protocol41: true
  },
  FieldPacket {
    catalog: 'def',
    db: 'dbnodevul',
    table: 'customers',
    orgTable: 'customers',
    name: 'address',
    orgName: 'address',
    charsetNr: 255,
    length: 1020,
    type: 253,
    flags: 0,
    decimals: 0,
    default: undefined,
    zeroFill: false,
    protocol41: true
  }
]
//
```


## Where

### Select with a filter
```javascript
  con.query("SELECT * FROM customers WHERE address = 'Park Lane 38'", function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

### Wildcard Characters
Use the '%' wildcard to represent zero, one or multiple characters:
```javascript
  con.query("SELECT * FROM customers WHERE address LIKE 'S%'", function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

### Escaping Query Values
When query values are variables provided by the user, you should escape the values.

This is to prevent SQL injections, which is a common web hacking technique to destroy or misuse your database.

The MySQL module has methods to escape query values:
```javascript
var adr = 'Mountain 21';
var sql = 'SELECT * FROM customers WHERE address = ' + mysql.escape(adr);
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log(result);
});
```

### Use placeholder
You can also use a ? as a placeholder for the values you want to escape.

In this case, the variable is sent as the second parameter in the query() method:
```javascript
var adr = 'Mountain 21';
var sql = 'SELECT * FROM customers WHERE address = ?';
con.query(sql, [adr], function (err, result) {
  if (err) throw err;
  console.log(result);
});
```

### multiple placeholders
If you have multiple placeholders, the array contains multiple values, in that order:
```javascript
  var name = 'Amy';
  var adr = 'Mountain 21';
  var sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
  con.query(sql, [name, adr], function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

## Order By

### Sort the Result
```javascript
  con.query("SELECT * FROM customers ORDER BY name", function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

### ORDER BY DESC
```javascript
  con.query("SELECT * FROM customers ORDER BY name DESC", function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

## Delete

### Delete Record
```javascript
  var sql = "DELETE FROM customers WHERE address = 'Mountain 21'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
```

## Drop Table

### Delete a Table
```javascript
  var sql = "DROP TABLE customers";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table deleted");
  });
```

### Drop Only if Exist
If the the table you want to delete is already deleted, or for any other reason does not exist, you can use the IF EXISTS keyword to avoid getting an error.
```javascript
  var sql = "DROP TABLE IF EXISTS customers";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

## Update

### Update Table
```javascript
  var sql = "UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
```

## Limit

### Limit the Result
```javascript
  var sql = "SELECT * FROM customers LIMIT 5";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

### Start From Another Position
```javascript
  var sql = "SELECT * FROM customers LIMIT 5 OFFSET 2";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

### Shorter Syntax
```javascript
  var sql = "SELECT * FROM customers LIMIT 4, 5";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

## Join

### Create users products table
```javascript
  var sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), favorite_product INT)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("users Table created");
  });

  var sql = "CREATE TABLE products (id INT, name VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("products Table created");
  });
```

### Insert Records
```javascript
  var sql = "INSERT INTO users (name, favorite_product) VALUES ?";
  var values = [
    ['John', 154],
    ['Peter', 155],
    ['Amy', 154],
    ['Hannah', 0],
    ['Michael', 0]
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Users Table. Number of records inserted: " + result.affectedRows);
  });

  var sql = "INSERT INTO products (id, name) VALUES ?";
  var values = [
    [154, 'Chocolate Heaven'],
    [155, 'Tasty Lemons'],
    [156, 'Vanilla Dreams']
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Products Table. Number of records inserted: " + result.affectedRows);
  });
```

### Join Two or More Tables
```javascript
  var sql = "SELECT users.name AS user, products.name AS favorite FROM users JOIN products ON users.favorite_product = products.id";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

### Left Join
```javascript
  var sql = "SELECT users.name AS user, products.name AS favorite FROM users LEFT JOIN products ON users.favorite_product = products.id";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

### Right Join
```javascript
  var sql = "SELECT users.name AS user, products.name AS favorite FROM users RIGHT JOIN products ON users.favorite_product = products.id";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
```

### 
```javascript

```

### 
```javascript

```