const express = require('express')
const User = require('../models/users')
const Post = require('../models/posts')

const app = new express.Router()

app.post('/signUp',  async (req, res) => {
    try{
      const user = new User(req.body)
      await user.save()  
      res.send(user)
    } catch(e){
      res.status(404).send(e.message) 
    }
})

app.patch('/users/:id', async (req, res) => {
    try{
      const user = await User.findById(req.params.id)
      const keys = Object.keys(req.body)
       
      if(!user) throw new Error('can\'t find this user')

      keys.forEach((key) => {
          user[key] = req.body[key]
      }) 
   
      await user.save() 

      res.send(user)

    } catch(e){
      res.send(e.message)  
    }
})

app.delete('/users/:id', async (req, res) => {
   try{
      const user = await User.findById(req.params.id) 
      if(!user) throw new Error('can\'t find this user') 
      
      await User.deleteOne({_id: req.params.id}) 
      await Post.deleteMany({userId: req.params.id}) ;

     res.send(user) 
   } catch(e){
     res.send(e.message)
   }
})

module.exports = app