const express = require('express')
const path = require('path')
require('./db/mongoose')
const userRouter = require('./routers/user')
const postRouter = require('./routers/post')
const fileRouter = require('./routers/file')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))
app.use(userRouter)
app.use(postRouter)
app.use(fileRouter)

app.listen(port, () => {
    console.log('listing up on port ' + port + '.')
})
