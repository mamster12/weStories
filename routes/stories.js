const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// load models js
const User = mongoose.model('users');
const Story = mongoose.model('stories');

router.get('/', (req, res) => {
    Story.find({ status: 'Public' })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});


//process adding story
router.post('/', ensureAuthenticated, (req, res) => {
    let allowComments;

    //check if allowComments is on
    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }

    //set newStory Object
    const newStory = {
        title: req.body.title,
        allowComments: allowComments,
        status: req.body.status,
        body: req.body.body,
        user: req.user.id
    }

    //save to db
    new Story(newStory)
        .save()
        .then(stories => {
            res.redirect(`/stories/show/${story.id}`);
        });
});

//show stories
router.get('/show/:id', (req, res) => {
    Story.findOne({ _id: req.params.id })
        .populate('user')
        .then(story => {
            res.render('stories/show', {
                story: story
            });
        });
});
module.exports = router;