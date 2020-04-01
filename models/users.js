const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
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
    },
    avatar:{
        type:Buffer
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps: true
})

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token =  jwt.sign({ _id: user._id.toString() }, process.env.tokenKey)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
   const user = await User.findOne({email})
   if(!user) throw new Error('please check the email') 

   const isMatch = await bcrypt.compare(password, user.password) 

   if(!isMatch) throw new Error('please check the password')
    
   return user ;
}

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