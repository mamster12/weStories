const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: {
        type: String,
        require: true
    },

    user: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        image: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }

});

mongoose.model('comments', CommentSchema);