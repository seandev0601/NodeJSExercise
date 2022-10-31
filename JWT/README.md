# JSON web Token (JWT)

### JWT Tutorial Resource
- [JWT Authentication Tutorial - Node.js](https://www.youtube.com/watch?v=mbsmsi7l3r4)
- [What Is JWT and Why Should You Use JWT](https://www.youtube.com/watch?v=7Q17ubqLfaM)

## Installing
```shell
npm i jsonwebtoken dotenv

npm install concurrently --save ## run multiple .js server
```

## create .env ACCESS_TOKEN_SECRET & REFRESH_TOKEN_SECRET
Use ``require('crypto').randomBytes(64).toString('hex')`` create Secrtet token
```shell
$ node
Welcome to Node.js v16.15.0.
Type ".help" for more information.
> require('crypto').randomBytes(64).toString('hex')
'ab8b6c6f61351d24832868ffb932bcbb4e44525233a748b6c3dafbfa17ac7faff4086ae69a98a1821c2acf9ef0b385f68c59731cd18c550ce365f66c460be005'


// .env
ACCESS_TOKEN_SECRET=ab8b6c6f61351d24832868ffb932bcbb4e44525233a748b6c3dafbfa17ac7faff4086ae69a98a1821c2acf9ef0b385f68c59731cd18c550ce365f66c460be005
REFRESH_TOKEN_SECRET=17ab7f213b52f6409feda70c0f0f5901577243ef4feb8e096c9492d383d210a7451f6baba99c522509d0d506d8a74aabfa5dea20a19adc4c5a5f4206d077986f
```

## create authServer.js

- Post ``/login`` to generate access token and refresh token
- Use Post ``/token`` with refresh token to get new access token. When access token expires.
- Remove refresh token by Delete ``/logout``

```javascript
require('dotenv').config({path: './JWT/.env'})

const express = require('express')
const app = express()
const port = 4000

const jwt = require('jsonwebtoken')

// for parsing application/json
app.use(express.json()); 

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

let refreshTokens = []

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.post('/login', (req, res) => {
  // Authenticate User
  
  const username = req.body.username
  console.log(`Get username: ${username}`)
  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)

  const responseToken = { accessToken: accessToken, refreshToken: refreshToken }
  
  console.log(`Response token: ${responseToken}`)
  res.json(responseToken)
})

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    console.log('Get Refresh Token')
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  console.log('Logout remove token')
  res.sendStatus(204)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## create server.js

Get ``/posts`` to get posts data. 

Use ``authenticateToken`` to verify token

```javascript
require('dotenv').config({path: './JWT/.env'})

const express = require('express')
const app = express()
const port = 8080

const jwt = require('jsonwebtoken')

// for parsing application/json
app.use(express.json()); 

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

const posts = [
  {
    username: 'Emma',
    title: 'Post 1'
  },
  {
    username: 'Anna',
    title: 'Post 2'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']
  if ( token == null ) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err)
      return res.sendStaus(403)
    }
    console.log(`Token verify successfully!`)
    req.user = user
    next()
  })
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

# Testing API

``` shell

### 1. login get access token and refresh token

POST http://locahost:4000/login
Content-Type application/json 

{
  "username": "Emma"
}

### 2. use access token to get posts data
### access token expires In 15s

GET http://locahost:8080/posts
Authorization: Bearer
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRW1tYSIsImlhdCI6MTY2NzE4NTE0OH0.AByguJbz9ebOYU8ttCdKpME-Q8CXyebYNZSwbJdKfac

### 3. use refresh token to get new accesstoken

POST http://localhost:4000/token Content-Type: application/json

{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRW1tYSIsImlhdCI6MTY2NzE5NjMyNX0.uwzGGbo7sTWfICCQfBapMa0IP0iVx3vbIjHv9qgI7WI"
}

### 4. use new access token to get posts data

GET http://locahost:8080/posts
Authorization: Bearer
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRW1tYSIsImlhdCI6MTY2NzIwMjI2MiwiZXhwIjoxNjY3MjAyMjc3fQ.1FlOPdi4BUKX_9sIYjcyowpVQJLwNXYLkoinKiPInxo

### 5. logout. and remove refresh token

DELETE http://localhost:4000/logout Content-Type: application/json

{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRW1tYSIsImlhdCI6MTY2NzE5NjMyNX0.uwzGGbo7sTWfICCQfBapMa0IP0iVx3vbIjHv9qgI7WI"
}
```
