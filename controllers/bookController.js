var Author = require('../models/author');
var Book = require('../models/book');
var BookInstance = require('../models/bookinstance');
var Genre = require('../models/genre'); 
const { body, validationResult } = require('express-validator'); 
var async = require('async'); 

exports.index = function (req, res) {
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass in an empty object as a match condition to find all documents of this collection.
        }, 
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        }, 
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status: 'Available'}, callback);
        }, 
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        }, 
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home Index', error: err, data: results });
    });
};

// Display list of all books.
exports.book_list = function(req, res, next) {
    Book
        .find({}, 'title author')
        .sort({ title: 1 })
        .populate('author')
        .exec(function (err, results) {
            if (err) { return next(err); } 
            // Successful, so render. 
            res.render('book_list', { title: 'Book List', book_list: results });
        });
}; 

// Display detail page of a specific Book. 
exports.book_detail = function(req, res, next) {
    async.parallel({
        book: function(callback) {
            Book 
                .findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        }, 
        book_instance: function(callback) {
            BookInstance 
                .findById(req.params.id)
                .exec(callback);
        }, 
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.book == null) {
            //No results. 
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        } 
    // Successful, so render.
    res.render('book_detal', { title: results.book.title, book: results.book, book_instances: results.book_instance });
    });
}; 

// Display Book create form on GET. 
exports.book_create_get = function(req, res, next) {
    // Get all authors and genres, which we can use for adding to our book. 
    async.parallel({
        author: function(callback) {
            Author.find(callback);
        }, 
        genre: function(callback) {
            Genre.find(callback);
        }, 
    }, function (err, results) {
        if (err) { return next(err); }
        // Successful, so render. 
        res.render('book_form', { title: 'Book Creation Form', author: results.author, genre: results.genre });
    });    
};

// Display Book create form on POST. 
exports.book_create_post = [
    // Convert the genre to an array. 
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)) {
            if(typeof req.body.genre === 'undefined') 
            req.body.genre = [];
            else 
            req.body.genre = new Array(req.body.genre);
        }
        next();
    }, 

    // Validate and sanitize fields. 
    body('title').trim().isLength( { min: 1 } ).withMessage('Title must not be empty.').escape(), 
    body('author').trim().isLength( { min: 1 }).withMessage('Author must not be empty.').escape(), 
    body('summary').trim().isLength( { min: 1 }).withMessage('Summary must not be empty.').escape(),
    body('isbn').trim().isLength( { min: 1 }).escape(), 
    body('genre').escape(), 

    // Process request after validation and sanitization. 
    (req, res, next) => {
        // Extract the validation errors from the request. 
        const error = validationResult(req); 

        // Create a Book object with escaped and trimmed data. 
        var book = new Book(
            {
                title: req.body.title, 
                author: req.body.author, 
                summary: req.body.summary,
                isbn: req.body.isbn, 
                genre: req.body.genre
            }
        );

        // There are errors. Render form again with sanitized values/error messages. 
        if (!error.isEmpty()) {
            
            // Get all authors and genres, which we can use for adding to our book. 
            async.parallel({
                author: function(callback) {
                    Author.find(callback);
                }, 
                genre: function(callback) {
                    Genre.find(callback);
                }, 
            }, function (err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for( let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }

                // Successful, so render. 
                res.render('book_form', { title: 'Book Creation Form', author: results.author, genre: results.genre, book: book, errors: error.array() });
            });
            return;        
        } else {
            book.save(function(err, results) {
                if (err) { return next(err); }
                // Successful, so render. 
                res.redirect(book.url);
            });
        }
    }
]; 

// Display Book delete on GET. 
exports.book_delete_get = function(req, res, next) {
    async.parallel({
        book: function(callback) {
            Book
                .findById(req.params.book._id)
                .exec(callback)
        }, 
        author: function(callback) {
            Author
                .findById(req.params.author._id)
                .exec(callback)
        },
        bookinstance: function(callback) {
            BookInstance
                .find()
                .exec(callback)
        }, 
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.book == null) {
            // No results. 
            res.redirect('/catalog/book_list');
        }
        // Successful, so render. 
        res.render('book_delete', { title: 'Delete Book', book: results.book, author: results.author });
    });
};

// Handle Book delete on POST. 
exports.book_delete_post = function(req, res, next) {
    async.parallel({
        book: function(callback) {
            Book 
                .findById(req.body.book._id) 
                .exec(callback) 
        }, 
        author: function(callback) {
            Author 
                .findById(req.body.author._id) 
                .exec(callback)
        }, 
        bookinstance: function(callback) {
            BookInstance 
                .find()
                .exec(callback)
        }, 
    }, function(err, results) {
        if (err) { return next(err); }
        // Success 
        if (results.bookinstance.length > 0) {
            // Book has more than one instance. Redirect to Book Instance deletion form. 
            res.redirect('/catalog/bookinstance_delete');
        } else {
            // Book has no more existing instances. Delete book and redirect to the list of books.
            Book.findByIdAndRemove(req.body.book._id, function deleteBook(err) {
                if (err) { return next(err); }
                // Success - go to book list. 
                res.redirect('/catalog/book_list');
            })
        }
    });
};

// Handle Book update on GET. 
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle Book update on POST. 
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};
