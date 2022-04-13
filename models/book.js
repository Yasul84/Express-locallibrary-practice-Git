var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Author = require('./author');
var Genre = require('./genre');

var BookSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 100 }, 
        author: { type: Schema.Types.ObjectId, ref: 'Author', required: true, maxLength: 100 }, 
        summary: { type: String, required: true }, 
        isbn: { type: String, required: true }, 
        genre: [{ type: Schema.Types.ObjectId, ref: 'Genre'}]
    }
); 

// Virtual for book's URL 
BookSchema 
    .virtual('URL')
    .get(function() {
        return '/catalog/book/' + this._id;
    }); 

// Export model 
module.exports = mongoose.model('Book', BookSchema);