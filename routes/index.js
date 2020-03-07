const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// load models js
const User = mongoose.model('users');
const Story = mongoose.model('stories');

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome');
});

router.get('/penname', ensureAuthenticated, (req, res) =>{
    if(req.user.penName){
        res.redirect('/dashboard');
    }else{
        res.render('index/penName');
    }
})

router.post('/penname/:id', ensureAuthenticated, (req, res) =>{
    User.findOne({_id: req.params.id})
    .then(user => {
        user.penName = req.body.penName;
        user.save()
        .then(user => {
            res.redirect('/dashboard');
        })
    })
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Story.find({ user: req.user.id })
        .then(stories => {
            res.render('index/dashboard', {
                stories: stories
            });
        });
});

router.get('/about', (req, res) => {
    res.render('index/about');
});

module.exports = router;