const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const tripController = require('../controllers/tripController');



module.exports = (app) => {

    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/trip', tripController);

};