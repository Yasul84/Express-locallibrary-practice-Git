var express = require('express');
var router = express.Router(); 

var author_controller = require('../controllers/authorController');
var book_controller = require('../controllers/bookController');
var bookinstance_controller = require('../controllers/bookinstanceController');
var genre_controller = require('../controllers/genreController');

// BOOK ROUTES 

// GET catalog home page. 
router.get('/', book_controller.index);

// GET request for creating a Book. Note: this must come before routes that display Book (uses id).
router.get('/book/create', book_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);

// GET request to delete Book.
router.get('/book/:id/delete', book_controller.book_delete_get); 

// POST request to delete Book. 
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

// AUTHOR ROUTES

// GET request for creating Author. Note: this must come before route for id, i.e. display author. 
router.get('/author/:id/create', author_controller.author_create_get);

// POST request for creating Author. 
router.post('/author/:id/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post); 

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list); 

// GENRE ROUTES 

// GET request for creating a Genre. Note: this must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

// POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/delete', genre_controller.genre_delete_get); 

// POST request to delete Genre. 
router.post('/genre/delete', genre_controller.genre_delete_post);

// GET request to update Genre. 
router.get('/genre/update', genre_controller.genre_update_get); 

// POST request to update Genre. 
router.post('/genre/update', genre_controller.genre_update_post); 

// GET request for one Genre. 
router.get('/genre/:id', genre_controller.genre_detail); 

// GET request for list of all Genres. 
router.get('/genres', genre_controller.genre_list); 

// BOOK INSTANCE ROUTES 

// GET request for creating a Book Instance. Note: this must come before route taht displays Book Instance (uses id).
router.get('/bookinstance/create', bookinstance_controller.bookInstance_create_get);

// POST request for creating BookInstance. 
router.post('/bookinstance/create', bookinstance_controller.bookInstance_create_post);

// GET request to delete BookInstance. 
router.get('/bookinstance/delete', bookinstance_controller.bookinstance_delete_get);

// POST request to delete BookInstance. 
router.post('/bookinstance/delete', bookinstance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/update', bookinstance_controller.bookinstance_update_get);

// POST request to update BookInstance. 
router.get('/bookinstance/update', bookinstance_controller.bookinstance_update_post);

// GET request for one BookInstance. 
router.get('/bookinstance/:id', bookinstance_controller.bookInstance_detail); 

// Get request for list of all BookInstance. 
router.get('/bookinstances', bookinstance_controller.bookInstance_list);


module.exports = router;