const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
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

UserSchema.pre('save', async function(next){
    const user = this 
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User