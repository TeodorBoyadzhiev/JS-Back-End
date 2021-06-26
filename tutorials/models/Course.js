const { Schema, model } = require('mongoose');



const schema = new Schema({
    title: { type: String, required: [true, 'Title is required'] },
    description: { type: String, required: [true, 'Description is required'], maxLength: [50, 'Maximum 50 symbols required'] },
    imageUrl: { type: String, required: [true, 'ImageUrl is required'] },
    duration: { type: Number, required: [true, 'Duration is required'] },
    createdAt: { type: Date, default: Date.now },
    usersEnrolled: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});





module.exports = model('Course', schema);