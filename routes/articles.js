var express = require('express');
var router = express.Router();

// add mongoose
var mongoose = require('mongoose');

// make this page to refer to the database
var Article = require('../models/article');

// Set up the get handler for the main articles page
router.get('/', function(req, res, next) {
    // use the article model to query the articles collection in the db
    Article.find(function(err, articles) {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.render('articles', {
                title: 'Articles',
                articles: articles
            });

        }
    })
});

// GET handler for add to display a blank form
router.get('/add', function(req, res, next) {
    res.render('articles/add', {
        title: 'Add a New Article'
    });
});
// POST handler for add to process the form
router.post('/add', function(req, res, next) {
    // save a new article using our Article model
    Article.create( {
        title: req.body.title,
        content: req.body.content
        }
    );
    // redirect to main articles page
    res.redirect('/articles');
});
// GET handler for edit to show the populated form
router.get('/:id', function(req, res, next) { // we make an id
    // create an id variable to store the id from the url
    var id = req.params.id;

    // look up the selected article
    Article.findById(id, function (err, article) {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // show the edit view
            res.render('articles/edit', {
                title: 'Article Details',
                article: article
            });
        }
    });
    //res.render('articles/add', {
    //    title: 'Add a New Article'
    //});
});
// POST handler for edit to update the article
router.post('/:id', function(req, res, next) {
    // create an id variable to store the id from the url
    var id = req.params.id;

    // fill the article object
    var article = new Article({
        _id: id,
        title: req.body.title,
        content: req.body.content
    });

    // use mongoose and our Article model to update
    Article.update({_id: id}, article, function(err) {
            if (err) {
                console.log(err)
                res.end(err);
            } else {
                res.redirect('/articles');
            }
        });
});
// GET handler for delete using article id parameter
router.get('/delete/:id', function(req, res, next) {
    // grab the id parameter from the url
    var id = req.params.id;

        Article.remove({_id: id}, function(err) {
            if (err) {
                console.log(err);
                res.end(err);
            } else {
                // show updated articles list
                res.redirect('/articles');
            }
        });
});
// make public
module.exports = router;