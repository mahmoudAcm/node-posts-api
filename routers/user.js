const express = require('express')
const multer = require('multer')
const User = require('../models/users')
const Post = require('../models/posts')
const auth = require('../middleware/auth')

const app = new express.Router()

app.post('/signUp',  async (req, res) => {
    try{
      const user = new User(req.body)
      await user.save()  
      const token = await user.generateAuthToken()
      res.send({user, token})
    } catch(e){
      res.status(404).send(e.message) 
    }
})

app.post('/login', async (req, res) => {
    try{
       const user = await User.findByCredentials(req.body.email, req.body.password) 
       const token = await user.generateAuthToken()
       res.send({user, token})
    } catch(e){
       res.status(404).send(e.message)
    }
})

app.post('/logout', auth, async (req, res) => {
    try{
      const user = req.user 
      user.tokens = user.tokens.filter((token) => {
          return token.token !== req.token
      })
      await user.save()
    } catch(e){
      res.status(404).send(e.message)
    }
})

app.patch('/users', auth, async (req, res) => {
    try{
      const user = req.user 
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

app.delete('/users', auth, async (req, res) => {
   try{
      const id = req.user._id 

      if(!req.user) throw new Error('can\'t find this user') 
      
      await User.deleteOne({_id: id}) 
      await Post.deleteMany({userId: id}) ;

     res.send(req.user) 
   } catch(e){
     res.status(404).send(e.message)
   }
})

const uploadAvatar = multer({
  limits:{
    fileSize:3000000
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
      return cb(new Error('Please upload an image'))
    }

    cb(undefined, true)
  }
})

//adding avatar 
app.post('/users/avatar',auth, uploadAvatar.single('avatar'), async (req, res) => {
  try{
    const user = req.user
    if(!user) throw new Error('can\'t find this user')

    user.avatar = req.file.buffer 

    await user.save()

    res.send()

  } catch(e){
    res.send(e.message)
  }
}, (error, req, res, next) => {
   res.status(400).send(error.message)
})

app.delete('/users/avatar', auth, async (req, res) => {
  try{
    
    const user = req.user
    if(!user) throw new Error('can\'t find this user')

    user.avatar = undefined 

    await user.save()

    res.send()

  } catch(e){
    res.send(e.message)
  }
})

module.exports = app