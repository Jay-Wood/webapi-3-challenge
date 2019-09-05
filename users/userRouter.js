const express = 'express';
const db = require('./userDb.js');
const router = require("express").Router();
const postdb = require("../posts/postDb.js");

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

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const newPost = req.body;
    postdb.insert(newPost)
        .then( (post) => {res.status(201).json(post)})
        .catch( () => {
            res.status(500).json({error: "There was an error posting this post to the database."})
        })
});

router.get('/', (req, res) => {
    db.get()
        .then( resources => res.status(201).json(resources) )
        .catch( () => {
            res.status(500).json({ error: "The user information could not be retrieved." })
        })
});

router.get('/:id', validateUserId, (req, res) => {
    // const id = req.params.id;
    db.getById(req.user)
        .then(res.status(200).json(req.user))
        .catch( () => {
                res.status(500).json({error: "There was an error while getting the user from the database"})
        })
});

router.get('/:id/posts', validateUserId, (req, res) => {
    let id = req.params.id;   
    db.getUserPosts(id)
        .then(posts => { 
            res.status(200).json(posts)
        })
        .catch( () => {
            res.status(500).json({error: "There was an error retrieving posts from the database"})
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    let id = req.params.id;
    console.log("delete params: ", req.params)
    db.remove(id)
        .then(user => {
            res.status(200).json(user)
        })
        .catch( () => {
            res.status(500).json({error: "There was an error deleting this user"})
        })
});

router.put('/:id', validateUserId, (req, res) => {
    let id = req.params.id;
    let updates = req.body;
    console.log("updates: ", updates)
    db.update(id, updates)
        .then( updates => {
            res.status(201).json(updates)
        })
        .catch( () => {
            res.status(500).json({error: "There was an error updating this user."})
        })
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
    let post = req.body; 
    console.log("validate post: ", post)
    if(!post) {
        res.status(400).json({message: "Missing post data" })
    } 
    else if(!post.text) {
        res.status(400).json({message: "Missing required text field"})
    } else { next() }
};

module.exports = router;
