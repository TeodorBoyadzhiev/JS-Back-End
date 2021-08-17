const Trip = require('../models/Trip');
const User = require('../models/User');

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

async function joinTrip(tripId, userId) {
    const trip = await Trip.findById(tripId);
    const user = await User.findOne({_id:userId});
    trip.buddies.push(userId);
    user.tripHistory.push(tripId);
    trip.seats -= 1;
    return Promise.all([user.save(), trip.save()]);
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
    joinTrip,
    editTrip,
    deleteTrip
};