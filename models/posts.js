const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    postBody:{
        type:String,
        required:true
    }
})

PostsSchema.statics.updatePost = async (data, postId) => {
    try{
      const post = await Post.findById({_id:postId})
      
      if(!post) throw new Error('can\'t find this user')
      dataKeys = Object.keys(data)

      dataKeys.forEach((key) => {
          post[key] = data[key]
      })


      return await post.save() 

    } catch(e){

      return new Promise((resolve, reject) => {
          reject(e)
      })
    }
}

PostsSchema.statics.deletePost = async (postId) => {
    try{
       const User = require('./users') 
       const post = await Post.findById({_id: postId})

       if(!post) throw new Error('this post isn\'t found')
       

       const user = await User.findById({_id: post.userId})

       if(!user) throw new Error('this user isn\'t found')


       user.posts = user.posts.filter((post) => {
           return post.postId != postId 
       })
       
       await Post.deleteOne({_id: post._id})
       return await user.save()


    } catch(e){
        return new Promise((resolve, reject) => {
            reject(e)
        })
    }
}

PostsSchema.statics.readPosts = async (userId) => {
    try{
        const posts = await Post.find({userId})
        if(!posts.length) throw new Error('this post isn\'t found')
        return new Promise((resolve, reject) => {
            resolve(posts)
        })
    } catch(e){
        return new Promise((resolve, reject) => {
            reject(e)
        })
    }
}

const Post = mongoose.model('Post', PostsSchema)

module.exports = Post