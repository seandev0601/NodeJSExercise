# Middleware

Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware in the stack.

![](https://i.imgur.com/xYI2Mgb.png)

```javascript
var express = require('express');
var app = express();

//Simple request time logger
app.use(function(req, res, next){
   console.log("A new request received at " + Date.now());
   
   //This function call is very important. It tells that more processing is
   //required for the current request and is in the next middleware
   // function route handler.
   next();
});

app.listen(3000);
```

The above middleware is called for every request on the server. So after every request, we will get the following message in the console −
```
A new request received at 1467267512545
```

To restrict it to a specific route (and all its subroutes), provide that route as the first argument of app.use(). For Example,

```javascript
var express = require('express');
var app = express();

//Middleware function to log request protocol
app.use('/things', function(req, res, next){
   console.log("A request for things received at " + Date.now());
   next();
});

// Route handler that sends the response
app.get('/things', function(req, res){
   res.send('Things');
});

app.listen(3000);
```

Now whenever you request any subroute of '/things', only then it will log the time.

## Other Example
```javascript
const express = require('express')
const app = express()

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000)
```


# Order of Middleware Calls

One of the most important things about middleware in Express is the order in which they are written/included in your file; the order in which they are executed, given that the route matches also needs to be considered.

```javascript
var express = require('express');
var app = express();

//First middleware before response is sent
app.use(function(req, res, next){
   console.log("Start");
   next();
});

//Route handler
app.get('/', function(req, res, next){
   res.send("Middle");
   next();
});

app.use('/', function(req, res){
   console.log('End');
});

app.listen(3000);
```

When we visit '/' after running this code, we receive the response as Middle and on our console −

```
Start
End
```

The following diagram summarizes what we have learnt about middleware −

![](https://www.tutorialspoint.com/expressjs/images/middleware_desc.jpg)


# [Third Party Middleware](https://expressjs.com/en/resources/middleware.html)

A list of Third party middleware for Express is available here. Following are some of the most commonly used middleware; we will also learn how to use/mount these −


## body-parser

This is used to parse the body of requests which have payloads attached to them. To mount body parser, we need to install it using **npm install --save body-parser** and to mount it, include the following lines in your index.js −

```javascript
var bodyParser = require('body-parser');

//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }))

//To parse json data
app.use(bodyParser.json())
```

## cookie-parser

It parses Cookie header and populate req.cookies with an object keyed by cookie names. To mount cookie parser, we need to install it using **npm install --save cookie-parser** and to mount it, include the following lines in your index.js −

```javascript
var cookieParser = require('cookie-parser');
app.use(cookieParser())
```

# Error-handling middleware

Define error-handling middleware functions in the same way as other middleware functions, except with four arguments instead of three, specifically with the signature (err, req, res, next)):

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

