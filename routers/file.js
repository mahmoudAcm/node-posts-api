const express = require('express')
const multer = require('multer')
const File = require('../models/files')
const Post = require('../models/posts')
const auth = require('../middleware/auth')

const app = new express.Router()

const file = multer({
    limits:{
        fileSize: 100000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpeg|jpg|pdf|txt|docx|doc)/)){
            cb(new Error('You should upload image or text file'))
        }

        cb(undefined, true)
    }
})

app.post('/file/:id', auth, file.single('file'), async (req, res) => {
    try{
      const post = await Post.findById(req.params.id)   
      if(!post) throw new Error('this post isn\'t found') 
      const FileData = req.file  

      req.body = {
            postId: req.params.id,
            filename: FileData.originalname,
            file: FileData.buffer
      }

      const PostFile = new File(req.body)

      await PostFile.save()

      res.send(PostFile)

    } catch (e){
      res.status(404).send(e.message)  
    }
}, (err, req, res, next) => {
    res.send(400).send(err.message)
})

app.get('/files/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        await post.populate('files').execPopulate() 
        res.send(post.files)    
    } catch(e){
        res.status(404).send(e.message)
    }
})

app.delete('/files/:id', auth, async (req, res) => {
    try{
        const file = await File.findById(req.params.id)
        if(!file) throw new Error('this file is\'t found')

        await file.deleteOne({_id: req.params.id})

        res.send('removed')

    } catch(e){
        res.status(404).send(e.message)
    }
})

module.exports = app