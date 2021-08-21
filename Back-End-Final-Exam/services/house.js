const House = require('../models/House');
const User = require('../models/User');

async function createHouse(houseData) {
    const house = new House(houseData);
    await house.save();

    return house;
}

async function getAllHouses() {
    const allHouses = await House.find({}).lean();

    return allHouses;
}

async function getHouseById(id) {
    const house = await House.findById(id).populate('owner').populate('rented').lean();

    return house;
}

async function getLimitHouses() {
    const house = await House.find().sort({createdAt: 'desc'}).populate('owner').populate('rented').limit(3).lean();

    return house;
}

async function joinHouse(houseId, userId) {
    const house = await House.findById(houseId);
    const user = await User.findOne({ _id: userId });
    house.rented.push(userId);
    house.pieces = Number(house.pieces) - 1;
    return house.save();
}

async function editHouse(houseId, houseData) {
    const house = await House.findById(houseId);

    house.name = houseData.name;
    house.type = houseData.type;
    house.year = houseData.year;
    house.city = houseData.city;
    house.homeImg = houseData.homeImg;
    house.description = houseData.description;
    house.pieces = houseData.pieces;



    return house.save();

}



async function deleteHouse(houseId) {

    return House.findByIdAndDelete(houseId);
}


module.exports = {
    createHouse,
    getAllHouses,
    getHouseById,
    getLimitHouses,
    joinHouse,
    editHouse,
    deleteHouse
};