const express = require('express')
const multer = require('multer')
const File = require('../models/files')
const Post = require('../models/posts')

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

app.post('/file/:id', file.single('file'), async (req, res) => {
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

module.exports = app