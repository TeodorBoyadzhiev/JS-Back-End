const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const houseController = require('../controllers/houseController');

const notFoundController = require('../controllers/notFoundController');




module.exports = (app) => {

    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/house', houseController);

    app.use('*', notFoundController);


};