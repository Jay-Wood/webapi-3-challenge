const express = 'express';
const db = require('./userDb.js');
const router = require("express").Router();

router.post('/', validateUser, (req, res) => {
    console.log("Req in post ", req.body)
    let userData = req.body
    db.insert(userData)
        .then(user => {
            res.status(200).json({userData: user})
        })    
        .catch( () => {
            res.status(500).json({error: "There was a server problem with this post"})
        })
});

router.post('/:id/posts', validateUserId, (req, res) => {

});

router.get('/', (req, res) => {
    db.get()
        .then( resources => res.status(201).json(resources) )
        .catch( () => {
            res.status(500).json({ error: "The user information could not be retrieved." })
        })
});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    db.getById(req.user)
        .then(res.status(200).json(req.user))
        .catch( () => {
                res.status(500).json({error: "There was an error while getting the user from the database"})
        })
});

router.get('/:id/posts', validateUserId, (req, res) => {

});

router.delete('/:id', validateUserId, (req, res) => {

});

router.put('/:id', validateUserId, (req, res) => {

});

//custom middleware
function validateUserId(req, res, next) {
    let id = req.params.id;
    db.getById(id)
        .then(user => {
            if(user.id) {
                req.user = user
                next()
            } 
        })
        .catch( () => {
            res.status(404).json({error: "No user with that ID exists"})
        })
};

function validateUser(req, res, next) {
    let userPost = req.body
    console.log("userPost: ", userPost)

    if(!userPost) {
        res.status(400).json({message: "missing user data" })
    } 
    else if(!userPost.name) {
        res.status(400).json({message: "Missing user name"})
    } else { next() }
};

function validatePost(req, res, next) {

};

module.exports = router;
