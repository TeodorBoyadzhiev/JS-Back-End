const Cube = require('../models/Cube');


async function init() {
    return (req, res, next) => {
        req.storage = {
            getAll,
            getById,
            create
        };
        next();
    };
}

async function getAll(query) {
    const options = {};
    if (query.search) {
        options.name = { $regex: query.search, $options: 'i' };
    }
    if (query.from) {
        options.difficulty = { $gte: Number(query.from) };
    }
    if (query.to) {
        options.difficulty = options.difficulty || {};
        options.difficulty.$lte = Number(query.to) ;
    }

    const cubes = Cube.find(options).lean();

    return cubes;
}

async function getById(id) {
    const cube = await Cube.findById(id).lean();

    if (cube) {
        return cube;
    } else {
        return undefind;
    }
}

async function create(cube) {
    const record = new Cube(cube);
    return record.save();

}

module.exports = {
    init,
    getAll,
    getById,
    create
};