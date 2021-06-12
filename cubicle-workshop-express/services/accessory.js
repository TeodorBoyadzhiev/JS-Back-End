const Accessory = require('../models/Accessory');



async function getAllAccessory(existing) {
    return Accessory.find({ _id: { $nin: existing }}).lean();
}

async function createAccessory(accessory) {
    const record = new Accessory(accessory);
    return record.save();
}

module.exports = {
    createAccessory,
    getAllAccessory
};