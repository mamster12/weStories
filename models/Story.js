const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Public'
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }],

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    date: {
        type: Date,
        default: Date.now
    }

});

mongoose.model('stories', StorySchema, 'stories');