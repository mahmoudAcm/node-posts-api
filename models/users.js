const mongoose = require('mongoose')
const Post = require('./posts')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        required: true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps: true
})

UserSchema.virtual('posts', {
    ref: 'Post',
    localField:'_id',
    foreignField:'userId'
})

const User = mongoose.model('User', UserSchema)

module.exports = User