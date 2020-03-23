const express = require('express')
const Post = require('../models/posts')
const User = require('../models/users')

const app = new express.Router()

app.post('/post/:id', async (req, res) => {
    try{
      req.body.userId = req.params.id 

      const post = new Post(req.body)
      
      await User.UserPosted(req.params.id, post._id)

      await post.save()
      res.send(post)

    } catch(e){
        res.send(e.message)  
    }
})


app.get('/posts/:id', async (req, res) => {
    try{
        const posts = await Post.readPosts(req.params.id)
        res.send(posts)
    } catch(e){
        res.send(e.message)
    }
})
 
app.patch('/posts/:id', async (req, res) => { 
    try{
       await Post.updatePost(req.body, req.params.id)
       res.send('the post has been updated successfully!')
    } catch(e){
       res.send(e.message)
    }
})


app.delete('/posts/:id', async (req, res) => {
    try{ 
        const user = await Post.deletePost(req.params.id)
        res.send(user)
    } catch(e){
        res.send(e.message)
    }
})

module.exports = app