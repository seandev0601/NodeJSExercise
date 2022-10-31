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