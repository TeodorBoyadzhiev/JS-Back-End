
const houseService = require('../services/house');


module.exports = () => (req, res, next) => {

    req.storage = {
        ...houseService
    };

    next();
};