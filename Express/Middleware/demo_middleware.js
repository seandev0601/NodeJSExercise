const express = require('express')
const app = express()
const port = 8080

//Simple request time logger
app.use(function(req, res, next){
   console.log("A new request received at " + Date.now());
   req.requestTime = Date.now()
   //This function call is very important. It tells that more processing is
   //required for the current request and is in the next middleware
   // function route handler.
   next()
});

app.get('/', (req, res, next) => {
  res.send('Hello Express! Requested at: ' + req.requestTime)
  next()
})

app.use('/', function(req, res, next){
   console.log('End')
  next()
});

//Middleware function to log request protocol
// app.use('/things', function(req, res, next){
//    console.log("A request for things received at " + Date.now());
//    next();
// });

const myLogger = function (req, res, next) {
  console.log('A request for things LOGGED')
  next()
}

app.use('/things', myLogger)

// Route handler that sends the response
app.get('/things', function(req, res, next){
   res.send('Things');
  next()
});

app.use('/things', function(req, res){
   console.log('Things End')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})