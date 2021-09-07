const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task');
require('./config/passport')
const passport = require('passport' )

const app = express()
const port = process.env.PORT || 3000

app.use(passport.initialize())

app.use(passport.session())
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// app.listen(3001, () => {
//     console.log(`Server is up on port 3001`);
// })

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname,'../','cert','key.pem')),
    cert: fs.readFileSync(path.join(__dirname,'../','cert','cert.pem'))
},app)

sslServer.listen(port,()=>console.log(`Server is up on port ${port}`));