const express = require('express')
const User = require('../models/users')

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
      const updatedUser = await User.updateUser(req.params.id, req.body)
      res.send(updatedUser)
    } catch(e){
      res.send(e.message)  
    }
})

module.exports = app