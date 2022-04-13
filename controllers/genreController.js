var Book = require('../models/book');
var Genre = require('../models/genre');
var async = require('async');
const { body, validationResult } = require('express-validator');

// Display list of Genres. 
exports.genre_list = function(req, res, next) {
    Genre
        .find()
        .sort([[ 'genre_name' ,'ascending' ]])
        .exec(function (err, results) {
            if (err) { return next(err); }
            // Successful, so render. 
            res.render('genre_list', { title: 'List of Genres', genre_list: results });
        });
}; 

// Display detail page of Genre. 
exports.genre_detail = function(req, res, next) {
    Genre
        .find(req.params.name)
        .exec(function (err, results) {
            if (err) { return next(err); }
            // Successful, so render. 
            res.render('genre_detail', { title: 'Genre Details', genre_detail: results });
        });
}; 

// Display Genre create form on GET. 
exports.genre_create_get = function(req, res, next) {
    res.render('genre_form', { title: 'Genre creation form' });
}; 

// Display Genre create form on POST. 
exports.genre_create_post = [
    body('name').trim().isLength( { min: 1 }).escape().withMessage('Genre name must be specified.').isAlphanumeric().withMessage('Genre name has non-alphanumeric characters.'), 

    // Process request after validation and sanitization. 
    (req, res, next) => {

        // Extract the validation errors from request. 
        const error = validationResult(req);

        // Create a Genre object with escaped and trimmed data.
        var genre = new Genre(
            {
                name: req.body.name
            }
        );

        if (!error.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages. 
            res.render('genre_form', { title: 'Genre creation form', genre: genre, errors: error.array() });
            return;
        } else {
            // Data from form is valid. Check if Genre with the same name already exists.
            Genre.findOne({ 'name': req.body.name })
                .exec(function(err, found_genre) {
                    if (err) { return next(err); }
                
                if (found_genre) {
                    // Genre exists. Redirect to its detail page.  
                    res.redirect(found_genre.url);
                } else {
                    genre.save(function(err) {
                        if (err) { return next(err); }
                // Successful - redirect to new genre record. 
                res.redirect(genre.url);
                });
                }
                
            });
        }
    }
]; 

// Display Genre delete on GET. 
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};


// Handle Genre delete on POST. 
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Handle Genre update on GET. 
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST. 
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
