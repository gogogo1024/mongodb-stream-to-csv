const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
const openCsvOutputStream = require('./toolkit/openCsvOutputStream');

(async () => {
    console.time('quick')
    const connection = await MongoClient.connect(url)
    const dbo = connection.db("stream");
    const cursor = await dbo.collection("data").find(
        {
            deviceId: { $in: ["1", "2", "3"] }
        })
    cursor.stream().pipe(openCsvOutputStream("output.csv"))
        .on('complete', data => {
            console.log(data)
        })

})()
