const express = require('express')
const app = express()
const port = 8080
var multer = require('multer');
var upload = multer();

// for parsing application/json
app.use(express.json()); 

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 

app.get('/', (req, res) => {
  console.log(req.body);
  const query = req.query
  let id = req.query.id;
  if(!id || isNaN(id)){
    res.send("recieved your request!")
    // res.json(req.body)
  }else{
    console.log(query)
    res.send("recieved your request!<br>" + id)
  }
})

app.post('/', function(req, res){
   console.log(req.body);
   res.send("recieved your request POST!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})