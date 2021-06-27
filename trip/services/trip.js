const Trip = require('../models/Trip');

async function createTrip(tripData) {
    const trip = new Trip(tripData);
    await trip.save();

    return trip;
}

async function getAllTrips() {
    const allTrips = await Trip.find({}).lean();

    return allTrips;
}

async function getTripById(id) {
    const trip = await Trip.findById(id).lean();

    return trip;
}

async function editTrip(tripId, tripData) {
    const trip = await Trip.findById(tripId);

    trip.startPoint = tripData.startPoint;
    trip.endPoint = tripData.endPoint;
    trip.date = tripData.date;
    trip.time = tripData.time;
    trip.carImage = tripData.carImage;
    trip.carBrand = tripData.carBrand;
    trip.seats = Number(tripData.seats);
    trip.price = Number(tripData.price);
    trip.description = tripData.description;
              

    return trip.save();

}



async function deleteTrip(tripId) {

    return Trip.findByIdAndDelete(tripId);
}


module.exports = {
    createTrip,
    getAllTrips,
    getTripById,
    editTrip,
    deleteTrip
};