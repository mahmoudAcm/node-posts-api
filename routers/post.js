const express = require('express')
const Post = require('../models/posts')
const User = require('../models/users')
const auth = require('../middleware/auth')

const app = new express.Router()

app.post('/post/:id', async (req, res) => {
    try{
        const post = new Post({
            ...req.body,
            userId:req.params.id
        })
        await post.save() 
        res.send(post)
    } catch(e){
        res.send(e.message)  
    }
})


app.get('/posts/:id', auth, async (req, res) => {
    try{
        console.log(req.user)
        const user = await User.findById(req.params.id) 
        if(!user) throw new Error('can\'t find this user') 
        await user.populate('posts').execPopulate() ;
        res.send(user.posts)
    } catch(e){
        res.send(e.message)
    }
})

app.patch('/posts/:id', async (req, res) => { 
    try{
       const post = await Post.findById(req.params.id)
       const keys = Object.keys(req.body) 

       if(!post) throw Error('Can\'t find this post')

       keys.forEach((key) => {
           post[key] = req.body[key]
       })

       await post.save() 
       res.send(post)
        
    } catch(e){
       res.send(e.message)
    }
})


app.delete('/posts/:id', async (req, res) => {
    try{ 
       await Post.deleteOne({_id: req.params.id})
       res.send('deleted')
    } catch(e){
        res.send(e.message)
    }
})

module.exports = app