var http = require('http');
var url = require('url');

//create a server object:
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('Hello World!<br>'); //write a response to the client
  res.write(req.url);
  // var q = url.parse(req.url, true).query;
  // var txt = q.year + " " + q.month;
  // res.end(txt);
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080