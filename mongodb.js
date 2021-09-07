// const { MongoClient, ObjectId } = require('mongodb')

// const id = new ObjectId();
// console.log(id);
// console.log(id.getTimestamp());

// const connectionURL = `mongodb+srv://togadiya:togadiya@cluster0.uvacu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

// MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (errror, client) => {
//     if (errror) {
//         return console.log(`Error : ${errror}`);
//     }
//     const db = client.db('task-manager');

//     // db.collection('user').insertMany([{
//     //     name: 'Nayan',
//     //     age: '19'
//     // }, {
//     //     name: 'Shakti',
//     //     age: '19'
//     // }], (error, result) => {
//     //     if (error) {
//     //         return console.log(`Error : ${error}`)
//     //     }

//     //     console.log(result, result.ops);
//     // })
// });