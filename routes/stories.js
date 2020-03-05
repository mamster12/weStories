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
        })
        .catch(err => {
            res.redirect('stories/add');
        });
});

//show stories
router.get('/show/:id', (req, res) => {
    Story.findOne({ _id: req.params.id })
        .populate('user')
        .populate('comments')
        .then(story => {
            if (story.status == "Public") {
                res.render('stories/show', {
                    story: story
                });
            } else {
                if (req.user) {
                    if (req.user.id == story.user._id) {
                        res.render('stories/show', {
                            story: story
                        });
                    } else {
                        console.log(story.user);
                        res.redirect('/stories');
                    }
                } else {
                    res.redirect('/stories');
                }
            }
        });
});

//show single user stories
router.get('/user/:userID', (req, res) => {
    Story.find({ user: req.params.userID, status: 'Public' })
        .populate('user')
        .sort({ date: 'desc' })
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});

//shoy my stories
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({ user: req.user.id })
        .populate('user')
        .sort({ date: 'desc' })
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});

//edit story 
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({ _id: req.params.id })
        .then(story => {
            if (story.user != req.user.id) {
                res.redirect('/stories');
            } else {
                res.render('stories/edit', {
                    story: story
                });
            }
        });
});

//update db from edit form
router.put('/:id', ensureAuthenticated, (req, res) => {
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

router.delete("/:id", ensureAuthenticated, (req, res) => {
    Story.deleteOne({ _id: req.params.id })
        .then(story => {
            res.redirect("/dashboard");
        });
});


module.exports = router;