const express = require('express');

const { PORT } = require('./config');
const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');
const routerConfig = require('./config/routes');



start();
async function start() {
    const app = express();

    await databaseConfig(app);
    expressConfig(app);
    routerConfig(app);


    app.listen(PORT, ()=> console.log('Application is running on port: ' + PORT));
}

