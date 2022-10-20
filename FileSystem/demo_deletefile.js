var fs = require('fs');

fs.unlink('./FileSystem/mynewfile2.txt', function (err) {
  if (err) throw err;
  console.log('File deleted!');
});

fs.rename('./FileSystem/mynewfile1.txt', './FileSystem/myrenamedfile.txt', function (err) {
  if (err) throw err;
  console.log('File Renamed!');
});