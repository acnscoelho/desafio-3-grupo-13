const fs = require('fs');
const swaggerSpec = require('./src/config/swagger');

fs.writeFileSync('swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('swagger.json gerado com sucesso!'); 