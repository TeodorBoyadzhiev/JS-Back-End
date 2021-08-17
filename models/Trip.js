const { Schema, model } = require('mongoose');


const schema = new Schema({
    startPoint: { type: String, required: [true, 'Startpoint is required'], minLength: [4, 'Startpoint should be at least 4 characters long'] },
    endPoint: { type: String, required: [true, 'Startpoint is required'], minLength: [4, 'Startpoint should be at least 4 characters long'] },
    date: { type: String, required: true },
    time: { type: String, required: true },
    carImage: { type: String, required: true, match: [/^https?:\/\//, 'Carimage should be a valid URL'] },
    carBrand: { type: String, required: true, minLength: [4, 'Carbrand should be at least 4 characters long'] },
    seats: { type: Number, required: true, minLength: [0, 'Seats should be at least 1'], maxLength: [4, 'Seats should be not more tha 4'] },
    price: { type: Number, required: true, minLength: [0, 'Price should be between 0-50'], maxLength: [50, 'Price should be between 0-50'] },
    description: { type: String, required: true, maxLength: [10, 'Description should be not more than 10 characters long'] },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    buddies: [{ type: Schema.Types.ObjectId, ref: 'User' }]

});


module.exports = model('Trip', schema);