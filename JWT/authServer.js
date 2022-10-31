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

app.get('/', (req, res) => {
  res.send('Hello Express!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})