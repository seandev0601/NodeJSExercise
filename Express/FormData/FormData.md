### body-parser(for parsing JSON and url-encoded data)
### multer(for parsing multipart/form data)

---

To install the body-parser and multer, go to your terminal and use −

```
npm install --save body-parser multer
```

> body-parser middleware is available in Express v4.16.0 onwards.

```javascript
const express = require('express')
const app = express()
const port = 8080
var multer = require('multer');
var upload = multer();

// for parsing application/json
app.use(express.json()); 

// for parsing application/xwww-
app.use(express.urlencoded({ extended: false })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 

app.get('/', (req, res) => {
  console.log(req.body);
  res.send("recieved your request!");
  // res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

> [Request Properties](https://expressjs.com/en/4x/api.html#req)
>
> [Response Properties](https://expressjs.com/en/4x/api.html#res)