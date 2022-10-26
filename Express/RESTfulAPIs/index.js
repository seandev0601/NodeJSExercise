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