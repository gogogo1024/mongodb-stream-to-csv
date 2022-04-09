var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
const openCsvOutputStream = require('./toolkit/openCsvOutputStream');

(async () => {
    console.time('quick')
    const connection = await MongoClient.connect(url)
    var dbo = connection.db("stream");
    const cursor = await dbo.collection("data").find()
    cursor.stream().pipe(openCsvOutputStream("output.csv"))
        .on('complete', data => {
            console.log(data)
        })

})()
