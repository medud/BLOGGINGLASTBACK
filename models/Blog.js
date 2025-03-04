const mongoose = require('mongoose');
const CategoryEnum = require('./categoryEnum');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: Object.values(CategoryEnum),
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },
    image: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

blogSchema.set('toJSON', { virtuals: true });
blogSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
