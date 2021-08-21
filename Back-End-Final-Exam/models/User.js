const { Schema, model } = require('mongoose');


const schema = new Schema({
    fullName: { type: String, required: [true, 'FullName is required'] },
    username: { type: String, required: [true, 'Username is required'] },
    hashedPassword: { type: String, required: true }
});


module.exports = model('User', schema);