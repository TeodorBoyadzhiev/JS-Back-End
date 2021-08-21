const { Schema, model } = require('mongoose');


const schema = new Schema({
    name: { type: String, required: true, minLength: [6, 'The Name should be at least 6 characters long'] },
    type: { type: String, required: true, enum: { values: ['Apartment', 'Villa', 'House'], message: '{VALUE} is not supported "Property Type"' } },
    year: { type: Number, required: true, min: [1850, 'The Year should be between 1850 and 2021'], max: [2021, 'The Year should be between 1850 and 2021!'] },
    city: { type: String, required: true, minLength: [4, 'The City should be at least 4 characters long'] },
    homeImg: { type: String, required: true, match: [/^https?:\/\//, 'Home Image should be a valid URL'] },
    description: { type: String, required: true, maxLength: [60, 'Description should be maximum of 60 characters long'] },
    pieces: { type: Number, required: true, min: [0, 'Pieces should be positive number between 0-10'], max: [10, 'Pieces should be positive number between 0-10'] },
    rented: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now}

});


module.exports = model('House', schema);