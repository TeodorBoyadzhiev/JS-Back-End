const Hotel = require('../models/Hotel');

async function createHotel(hotelData) {
    const hotel = new Hotel(hotelData);
    await hotel.save();

    return hotel;
}

async function getAllHotels() {
    const hotels = await Hotel.find({}).populate('bookedBy').lean();

    return hotels;
}

async function getHotelById(id) {
    const hotel = await Hotel.findById(id).lean();

    return hotel;
}

async function editHotel(hotelId, hotelData) {
    const hotel = await Hotel.findById(hotelId);

    hotel.name = hotelData.name;
    hotel.city = hotelData.city;
    hotel.rooms = hotelData.rooms;
    hotel.imageUrl = hotelData.imageUrl;

    return hotel.save();

}


async function bookHotel(userId, hotelId) {
    
    const hotel = await Hotel.findById(hotelId);

    hotel.bookedBy.push(userId);

    await hotel.save();

}


async function deleteHotel(hotelId) {

    return Hotel.findByIdAndDelete(hotelId);
}


module.exports = {
    createHotel,
    getAllHotels,
    getHotelById,
    bookHotel,
    editHotel,
    deleteHotel
};