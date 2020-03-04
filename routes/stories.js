const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// load models js
const User = mongoose.model('users');
const Story = mongoose.model('stories');
const Comment = mongoose.model('comments');

router.get('/', (req, res) => {
    Story.find({ status: 'Public' })
        .populate('user')
        .sort({ date: 'desc' })
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
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        });
});

//show stories
router.get('/show/:id', (req, res) => {
    Story.findOne({ _id: req.params.id })
        .populate('user')
        .populate('comments')
        .then(story => {
            res.render('stories/show', {
                story: story
            });
        });
});

//edit story 
router.get('/edit/:id', (req, res) => {
    Story.findOne({ _id: req.params.id })
        .then(story => {
            res.render('stories/edit', {
                story: story
            });
        });
});

//update db from edit form
router.put('/:id', (req, res) => {
    Story.findOne({ _id: req.params.id })
        .then(story => {
            let allowComments;

            //check if allowComments is on
            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }

            story.title = req.body.title;
            story.status = req.body.status;
            story.allowComments = allowComments;
            story.body = req.body.body;

            story.save()
                .then(story => {
                    res.redirect('/dashboard');
                });
        });
});

//delete a story

router.delete("/:id", (req, res) => {
    Story.deleteOne({ _id: req.params.id })
        .then(story => {
            res.redirect("/dashboard");
        });
});


module.exports = router;