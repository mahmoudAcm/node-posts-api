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
    },
    posts:[{
        postId:String
    }]
})

UserSchema.statics.UserPosted = async (userId, postId) => {
    try{
        const user = await User.findById({_id: userId})
        if(!user){
            throw new Error('This user isn\'t found')
        }

        user.posts.push({postId})
        await user.save()
   } catch(e){
        return new Promise((resolve, reject) => {
            reject(e)
        })
   }
}

UserSchema.statics.updateUser = async (userId, data) => {
    try{
    const user = await User.findById({_id: userId})
    if(!user){
        throw new Error('This user isn\'t found')
    }

    dataKeys = Object.keys(data)

    dataKeys.forEach((key) => {
        user[key] = data[key]
    });

      return await user.save()

    } catch(e){
        return new Promise((resolve, reject) => {
            reject(e)
        })
    }

}

UserSchema.statics.deleteUser = async (userId) => {
    try{
        const user = await User.findById({_id: userId}) 
        if(!user) throw new Error('This user isn\'t found')

        await Post.deleteMany({userId})

        await User.deleteOne({_id: userId})


    } catch(e){
        return new Promise((resolve, reject) => {
            reject(e)
        })
    }
}

const User = mongoose.model('User', UserSchema)

module.exports = User