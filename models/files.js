const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
   postId:{
       type:mongoose.Schema.Types.ObjectId,
       required:true,
       ref:'Post'
   },
   filename:{
       type:String,
       required:true 
   },
   file:{
    type:Buffer,
    required:true
   }
}, 
{
   timestamps:true
})

const File = mongoose.model('File', fileSchema)

module.exports = File