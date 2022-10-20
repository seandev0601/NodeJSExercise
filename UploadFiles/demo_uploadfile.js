var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    // form.uploadDir = './UploadFiles/tmp';
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.filepath;
      var newpath = './UploadFiles/' + files.filetoupload.originalFilename;
      console.log(oldpath);
      console.log(newpath);
      // fs.rename(oldpath, newpath, function (err) {
      //   if (err) throw err;
      //   res.write('File uploaded and moved!');
      //   res.end();
      // });

      var readStream=fs.createReadStream(oldpath);
      var writeStream=fs.createWriteStream(newpath);
      readStream.pipe(writeStream);
      readStream.on('end',function(){
        fs.unlinkSync(oldpath);
        res.write('File uploaded and moved!');
        res.end();
      });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);