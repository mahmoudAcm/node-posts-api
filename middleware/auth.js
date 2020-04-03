const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req, res, next) => {
    try{
      const token = req.header('Authorization').replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.tokenKey)
      const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

      if(!user){
        throw new Error('') 
      }

      req.user = user 
      req.token = token 
      
      next()
    } catch(e){
      res.status(500).send(e.message)  
    }
}

module.exports = auth