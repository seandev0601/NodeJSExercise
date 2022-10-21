# Environment
Install Express and save it in the dependencies list. For example:
```
npm install express
```

To install Express temporarily and not add it to the dependencies list:
```
npm install express --no-save
```

## nodemon

This tool restarts our server as soon as we make a change in any of our files, otherwise we need to restart the server manually after each file modification. To install nodemon, use the following command −
```
npm install -g nodemon
```

> [使用 nodemon 取代 node 啟動程式](https://andy6804tw.github.io/2017/12/24/nodemon-tutorial/)


# Express application generator

Use the application generator tool, express-generator, to quickly create an application skeleton.

You can run the application generator with the npx command (available in Node.js 8.2.0).

```
npx express-generator
```
For earlier Node versions, install the application generator as a global npm package and then launch it:
```
npm install -g express-generator
express
```

The generated app has the following directory structure:

```
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug

7 directories, 9 files
```

> [Express application generator
](https://expressjs.com/en/starter/generator.html)
