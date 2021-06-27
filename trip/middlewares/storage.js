
const tripService = require('../services/trip');


module.exports = () => (req, res, next) => {

    req.storage = {
        ...tripService
    };

    next();
};