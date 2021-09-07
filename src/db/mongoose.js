const mongoose = require('mongoose')

const connectionURL = `mongodb+srv://togadiya:togadiya@cluster0.uvacu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(console.log('MONGOOSE connection is succesfully !'))
    .catch(error => console.log(`MONGOOSE can't connect to database ! Error : ${error}`));