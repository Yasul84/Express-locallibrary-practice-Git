var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
var async = require('async');
const { body, validationResult } = require('express-validator'); 
const { render } = require('express/lib/response');
const bookinstance = require('../models/bookinstance');

// Display list of all Book Instances. 
exports.bookInstance_list = function(req, res, next) {
    Book
        .populate('book')
        .exec(function (err, results) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('bookInstance_list', { title: 'Book Instance List', bookInstance_list: results });
        }); 
};

// Display specific Book Instance detail page. 
exports.bookInstance_detail = function(req, res, next) {
    BookInstance
        .findById(req.params.id) 
        .exec(function (err, results) {
            if (err) { return next(err); }
            if (bookinstance == null) {
                // No results from book instance search. 
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render. 
            res.render('bookInstance_detail', { title: 'Book Instance Detail Page', bookInstance_detail: results });
        });
}; 

// Display Book Instance form create on GET.
exports.bookInstance_create_get = function(req, res, next) {
    Book
        .find(req.params.title)
        .exec(function (err, results) {
            if (err) { return next(err); }
            // Successful, so render. 
            res.render('bookInstance_form', { title: 'Book Instance Creation Form', book_list: results });
        });
}; 

// Display Book Instance from create on POST. 
exports.bookInstance_create_post = [
    body('book').trim().isLength( {min: 1}).withMessage('Book must be specified').isAlphanumeric().withMessage('Book name has non-alphanumeric characters.').escape(), 
    body('imprint').trim().isLength( { min: 1 }).escape().withMessage('Imprint must be specified.'), 
    body('status').escape(), 
    body('due_back').optional({ checkFalsy: true }).isISO8601().toDate(), 

    // Process request after validation and sanitization. 
    (req, res, next) => {
        // Extract the validation errors from a request. 
        const errors = validationResult(req);

        // Create new Book Instance object with escaped and trimmed data. 
        var bookInstance = new BookInstance(
            {
                book: req.body.book, 
                imprint: req.body.imprint, 
                status: req.book.status, 
                due_back: req.book.due_back
            }
        );

        // There are errors. Render form again with sanitized values and error messages. 
        if (!errors.isEmpty()) {
            Book 
                .find(req.params.title)
                .exec(function (err, results) {
                    if (err) { return next(err); }
                    // Successful, so render. 
                    res.render('bookInstance_form', { title: "Book Instance Creation Form", book_list: results, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance });
                });
                return;
        } else {
            // Data from form is valid. 
            bookInstance 
                .save(function(err) {
                    if (err) { return next(err); }
                    // Successful - redirect to new record URL. 
                    res.redirect(bookInstance.url);
                });
        }
    }
]; 

// Display Book Instance delete on GET. 
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book instance delete GET');
};

// Handle Book Instance delete on POST. 
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book instance delete POST');
};

// Handle Book Instance update on GET. 
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book instance update GET');
};

// Handle Book Instance update on POST. 
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book instance update POST');
};
