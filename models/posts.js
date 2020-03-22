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

const Post = mongoose.model('Post', PostsSchema)

module.exports = Post