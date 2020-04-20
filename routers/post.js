const express = require('express')
const Post = require('../models/posts')
const User = require('../models/users')
const auth = require('../middleware/auth')

const app = new express.Router()

app.post('/post', auth, async (req, res) => {
    try{
        const post = new Post({
            ...req.body,
            userId:req.user._id
        })
        await post.save() 
        res.send(post)
    } catch(e){
        res.send(e.message)  
    }
})


app.get('/posts', auth, async (req, res) => {
    try{
        const user = req.user

        const sort = {} 

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(":")
            sort[parts[0]] = parts[1] === 'desc'? -1 : 1
        }

        await user.populate({
            path:'posts',
            options: {
                sort
            }
        }).execPopulate() ;
        res.send(user.posts)
    } catch(e){
        res.send(e.message)
    }
})

app.get('/posts/:id', auth, async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const sort = {} 

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(":")
            sort[parts[0]] = parts[1] === 'desc'? -1 : 1
        }

        await user.populate({
            path: 'posts',
            options: {
                sort
            }
        }).execPopulate()
        res.send(user.posts)
    } catch(e){
        res.send(e.message)
    }
})

app.patch('/posts/:id', auth, async (req, res) => { 
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


app.delete('/posts/:id', auth, async (req, res) => {
    try{ 
       await Post.deleteOne({_id: req.params.id})
       res.send('deleted')
    } catch(e){
        res.send(e.message)
    }
})

module.exports = app