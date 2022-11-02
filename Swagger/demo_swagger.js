const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const YAML = require('yamljs');
const swaggerYamlDocument = YAML.load('./Swagger/swagger.yaml');

var options = {
  explorer: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use('/api-docs-yaml', swaggerUi.serve, swaggerUi.setup(swaggerYamlDocument, options));

app.listen(8080, () => {
  console.log(`Example app listening on port ${8080}`)
})