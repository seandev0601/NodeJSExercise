const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Hello Express!')
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})

app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})

//A special method, all, is provided by Express to handle all types of http methods at a particular route using the same function.
app.all('/test', function(req, res){
   res.send("HTTP method doesn't have any effect on this route!");
});


var things = require('./things.js');

//both index.js and things.js should be in same directory
app.use('/things', things);


//routing parameter
app.get('/users/:userId/books/:bookId', (req, res) => {
  // res.send(req.params)
  res.send('userId: ' + req.params.userId + ' and bookId: ' + req.params.bookId);
  
})

//Request URL: http://localhost:8080/flights/LAX-SFO
//{ "from": "LAX", "to": "SFO" }
app.get('/flights/:from-:to', (req, res) => {
  res.send(req.params)
})

//Request URL: http://localhost:8080/plantae/Prunus.persica
//{ "genus": "Prunus", "species": "persica" }
app.get('/plantae/:genus.:species', (req, res) => {
  res.send(req.params)
})

//Request URL: http://localhost:8080/member/42
//{ "userId": "42" }
app.get('/member/:dserId', (req, res) => {
  res.send(req.params)
})

// need the id to be a 5-digit long number
app.get('/event/:id([0-9]{5})', function(req, res){
   res.send('id: ' + req.params.id);
});


//routing handler
app.get('/example/b', (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from B!')
})

const cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

const cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

const cb2 = function (req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])

//app.route()
app.route('/book')
  .get((req, res) => {
    res.send('Get a random book')
  })
  .post((req, res) => {
    res.send('Add a book')
  })
  .put((req, res) => {
    res.send('Update the book')
  })

//Other routes here
app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})