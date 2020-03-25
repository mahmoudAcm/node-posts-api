const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    postBody:{
        type:String,
        required:true
    }
}, {
    timestamps:true
})

const Post = mongoose.model('Post', PostsSchema)

module.exports = Post