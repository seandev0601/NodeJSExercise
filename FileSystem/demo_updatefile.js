var fs = require('fs');

fs.appendFile('./FileSystem/mynewfile1.txt', ' This is my text. By appendFile Updated!', function (err) {
  if (err) throw err;
  console.log('Updated!');
});

fs.writeFile('./FileSystem/mynewfile3.txt', 'This is my text. By writeFile Replaced!', function (err) {
  if (err) throw err;
  console.log('Replaced!');
});