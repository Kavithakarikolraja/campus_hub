const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        authorName: { type: String, required: true },
        content: { type: String, required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        comments: { type: Number, default: 0 }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Post', postSchema);
