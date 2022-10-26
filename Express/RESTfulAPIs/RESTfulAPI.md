# RESTful API

![Imgur](https://imgur.com/h4D0oVx.png)


## index.js
```javascript
const express = require('express')
const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var movies = require('./movies.js')
app.use('/movies', movies)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## movies.js
Now that we have our application set up, let us concentrate on creating the API.

Start by setting up the movies.js file.

```javascript
var express = require('express')
var router = express.Router()
var movies = [
   {id: 101, name: "Fight Club", year: 1999, rating: 8.1},
   {id: 102, name: "Inception", year: 2010, rating: 8.7},
   {id: 103, name: "The Dark Knight", year: 2008, rating: 9},
   {id: 104, name: "12 Angry Men", year: 1957, rating: 8.9}
];

// Get all the movies
router.get('/', function(req, res){
   res.json(movies)
});

// Get a specific movie by id
router.get('/:id([0-9]{3,})', function(req, res){
  const searchID = req.params.id
  var currMovie = movies.filter(function(movie){
    if(movie.id == searchID){
      return true
    }
  })
  if(currMovie.length == 1){
    res.json(currMovie[0])
  } else {
    res.status(404)//Set status to 404 as movie was not found
    res.json({message: "Not Found"})
  }
});

// Post create new movie
router.post('/', function(req, res){
   //Check if all fields are provided and are valid:
   if(!req.body.name ||
      !req.body.year.toString().match(/^[0-9]{4}$/g) ||
      !req.body.rating.toString().match(/^[0-9]\.[0-9]$/g)){
      
      res.status(400);
      res.json({message: "Bad Request"});
   } else {
      var newId = movies[movies.length-1].id+1;
      //Gets us the index of movie with given id.
      movies.push({
         id: newId,
         name: req.body.name,
         year: req.body.year,
         rating: req.body.rating
      });
      res.json({message: "New movie created.", location: "/movies/" + newId});
   }
});

// Put create/update movie
router.put('/:id([0-9]{3,})', function(req, res){
   //Check if all fields are provided and are valid:
  if(!req.body.name ||
    !req.body.year.toString().match(/^[0-9]{4}$/g) ||
    !req.body.rating.toString().match(/^[0-9]\.[0-9]$/g) ||
    !req.params.id.toString().match(/^[0-9]{3,}$/g)){
    
    res.status(400);
    res.json({message: "Bad Request"});
  } else {
    //Gets us the index of movie with given id.
    var updateIndex = movies.map(function(movie){
       return movie.id;
    }).indexOf(parseInt(req.params.id));
    
    if(updateIndex === -1){
      //Movie not found, create new
      movies.push({
        id: req.params.id,
        name: req.body.name,
        year: req.body.year,
        rating: req.body.rating
      });
      res.json({message: "New movie created.", location: "/movies/" + req.params.id});
    } else {
      //Update existing movie
      movies[updateIndex] = {
        id: req.params.id,
        name: req.body.name,
        year: req.body.year,
        rating: req.body.rating
      };
      res.json({message: "Movie id " + req.params.id + " updated.", location: "/movies/" + req.params.id});
    }
  }
});

// Delete movie by id
router.delete('/:id([0-9]{3,})', function(req, res){
  //Gets us the index of movie with given id.
  var removeIndex = movies.map(function(movie){
    return movie.id;
  }).indexOf(req.params.id); 
  
  if(removeIndex === -1){
    res.json({message: "Not found"});
  } else {
    movies.splice(removeIndex, 1);
    res.send({message: "Movie id " + req.params.id + " removed."});
  }
});

//Other routes here
router.get('*', function(req, res){
  res.status(400)
  res.json({message: "Bad Request"})
});

//Routes will go here
module.exports = router;
```

### Get all movies data
```javascript
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET 
localhost:8080/movies

// response
[{"id":101,"name":"Fight Club","year":1999,"rating":8.1},{"id":102,"name":"Inception","year":2010,"rating":8.7},
{"id":103,"name":"The Dark Knight","year":2008,"rating":9},
{"id":104,"name":"12 Angry Men","year":1957,"rating":8.9}]
```

### Get a specific movie by id
```javascript
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET localhost:8080/movies/101

// response
{"id":101,"name":"Fight Club","year":1999,"rating":8.1}
```

### Post new movie
```javascript
curl -X POST --data "name = Toy%20story&year = 1995&rating = 8.5" http://localhost:8080/movies

// response
{"message":"New movie created.","location":"/movies/105"}
```

### Put update movie
```javascript
curl -X PUT --data "name = Toy%20story&year = 1995&rating = 8.5" 
http://localhost:8080/movies/101

// response
{"message":"Movie id 101 updated.","location":"/movies/101"}
```

### Put create movie
```javascript
curl -X PUT --data "name = Harry%20Poter&year = 2000&rating = 9.5" http://localhost:8080/movies/106

// response
{"message":"New movie created.","location":"/movies/106"}
```

### Delete movie
```javascript
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X DELETE localhost:8080/movies/106

//response
{"message":"Movie id 106 removed."}
```
