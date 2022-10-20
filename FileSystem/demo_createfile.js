var fs = require('fs');

//create a file named mynewfile1.txt:
fs.appendFile('./FileSystem/mynewfile1.txt', 'Hello content! By appednFile.', function (err) {
  if (err) throw err;
  console.log('Saved! one');
});

fs.open('./FileSystem/mynewfile2.txt', 'w', function (err, file) {
  if (err) throw err;
  console.log('Saved! two');
});

fs.writeFile('./FileSystem/mynewfile3.txt', 'Hello content! By writeFile', function (err) {
  if (err) throw err;
  console.log('Saved! three');
});