var mysql = require('mysql');

var con = mysql.createConnection({
  // host: "localhost",
  // user: "yourusername",
  // password: "yourpassword"
  host: "db4free.net",
  user: "dev13134",
  password: "Vul35l4191",
  database: "dbnodevul"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  // var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table created");
  // });

  // var sql = "ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table altered");
  // });

  // var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("1 record inserted");
  // });

  // var sql = "INSERT INTO customers (name, address) VALUES ?";
  // var values = [
  //   ['John', 'Highway 71'],
  //   ['Peter', 'Lowstreet 4'],
  //   ['Amy', 'Apple st 652'],
  //   ['Hannah', 'Mountain 21'],
  //   ['Michael', 'Valley 345'],
  //   ['Sandy', 'Ocean blvd 2'],
  //   ['Betty', 'Green Grass 1'],
  //   ['Richard', 'Sky st 331'],
  //   ['Susan', 'One way 98'],
  //   ['Vicky', 'Yellow Garden 2'],
  //   ['Ben', 'Park Lane 38'],
  //   ['William', 'Central st 954'],
  //   ['Chuck', 'Main Road 989'],
  //   ['Viola', 'Sideway 1633']
  // ];
  // con.query(sql, [values], function (err, result) {
  //   if (err) throw err;
  //   console.log("Number of records inserted: " + result.affectedRows);
  // });

  // var sql = "INSERT INTO customers (name, address) VALUES ('Michelle', 'Blue Village 1')";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("1 record inserted, ID: " + result.insertId);
  // });

  // con.query("SELECT * FROM customers", function (err, result, fields) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // con.query("SELECT name, address FROM customers", function (err, result, fields) {
  //   if (err) throw err;
  //   console.log(result);

  //   //Return the address of the third record
  //   console.log(result[2].address);
  // });

  // con.query("SELECT name, address FROM customers", function (err, result, fields) {
  //   if (err) throw err;
  //   console.log(fields);
  // });

  // con.query("SELECT * FROM customers WHERE address = 'Park Lane 38'", function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // con.query("SELECT * FROM customers WHERE address LIKE 'S%'", function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // var adr = 'Mountain 21';
  // var sql = 'SELECT * FROM customers WHERE address = ' + mysql.escape(adr);
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // var adr = 'Mountain 21';
  // var sql = 'SELECT * FROM customers WHERE address = ?';
  // con.query(sql, [adr], function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // var name = 'Amy';
  // var adr = 'Mountain 21';
  // var sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
  // con.query(sql, [name, adr], function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // con.query("SELECT * FROM customers ORDER BY name", function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });
  
  // con.query("SELECT * FROM customers ORDER BY name DESC", function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // var sql = "DELETE FROM customers WHERE address = 'Mountain 21'";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Number of records deleted: " + result.affectedRows);
  // });

  // var sql = "UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log(result.affectedRows + " record(s) updated");
  // });

  // var sql = "SELECT * FROM customers LIMIT 5";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // var sql = "SELECT * FROM customers LIMIT 5 OFFSET 2";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  // var sql = "SELECT * FROM customers LIMIT 4, 5";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  //Create users and products data
  // var sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), favorite_product INT)";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("users Table created");
  // });

  // var sql = "CREATE TABLE products (id INT, name VARCHAR(255))";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("products Table created");
  // });

  //Insert data to users and products
  // var sql = "INSERT INTO users (name, favorite_product) VALUES ?";
  // var values = [
  //   ['John', 154],
  //   ['Peter', 155],
  //   ['Amy', 154],
  //   ['Hannah', 0],
  //   ['Michael', 0]
  // ];
  // con.query(sql, [values], function (err, result) {
  //   if (err) throw err;
  //   console.log("Users Table. Number of records inserted: " + result.affectedRows);
  // });

  // var sql = "INSERT INTO products (id, name) VALUES ?";
  // var values = [
  //   [154, 'Chocolate Heaven'],
  //   [155, 'Tasty Lemons'],
  //   [156, 'Vanilla Dreams']
  // ];
  // con.query(sql, [values], function (err, result) {
  //   if (err) throw err;
  //   console.log("Products Table. Number of records inserted: " + result.affectedRows);
  // });

  var sql = "SELECT users.name AS user, products.name AS favorite FROM users JOIN products ON users.favorite_product = products.id";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });

  var sql = "SELECT users.name AS user, products.name AS favorite FROM users LEFT JOIN products ON users.favorite_product = products.id";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
  
  var sql = "SELECT users.name AS user, products.name AS favorite FROM users RIGHT JOIN products ON users.favorite_product = products.id";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
  
});