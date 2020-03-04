const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({ mergeParams: true });
const stories = require('../routes/stories');
const comments = require('../routes/comments');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');


// load models js
const User = mongoose.model('users');
const Story = mongoose.model('stories');
const Comment = mongoose.model('comments');

//add comments
router.post('/', (req, res) => {
    Story.findOne({ _id: req.params.id })
        .then(story => {
            const newComment = {
                body: req.body.commentBody,
                user: {
                    id: req.user.id,
                    image: req.user.image,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName
                }
            }

            //push to comments array
            new Comment(newComment)
                .save()
                .then(comment => {
                    story.comments.unshift(comment);
                    story.save();
                    res.redirect('/stories/show/' + req.params.id);
                });
        });
});

//delete comment
router.delete("/:comment_id", (req, res) => {
    Comment.deleteOne({ _id: req.params.comment_id })
        .then(comment => {
            res.redirect('/stories/show/' + req.params.id);
        });
});

//render edit form for comment
router.get('/:comment_id/edit', (req, res) => {
    Comment.findOne({ _id: req.params.comment_id })
        .then(comment => {
            res.render('stories/editComment', {
                comment: comment,
                story_id: req.params.id
            });
        });
});

//update or edit comment
router.put('/:comment_id', (req, res) => {
    Comment.findOne({ _id: req.params.comment_id })
        .then(comment => {

            comment.body = req.body.commentBody;
            comment.save()
                .then(comment => {
                    res.redirect('/stories/show/' + req.params.id);
                });
        });
});


module.exports = router;