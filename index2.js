var XLSXWriter = require('xlsx-writestream');
var fs = require('fs');

var writer = new XLSXWriter('mySpreadsheet.xlsx', {} /* options */);

var writeStream = fs.createWriteStream('mySpreadsheet.xlsx')

// After instantiation, you can grab the readStream at any time.
writer.getReadStream().pipe(writeStream);

// Optional: Adjust column widths
writer.defineColumns([
    { width: 30 }, // width is in 'characters'
    { width: 10 }
]);

// Add some rows
writer.addRow({
    "Name": "Bob",
    "Location": "Sweden"
});
writer.addRow({
    "Name": "Alice",
    "Location": "France"
});

// Add a row with a hyperlink
writer.addRow({
    "Name": { value: "Bill", hyperlink: "http://www.thegatesnotes.com" },
    "Location": "Seattle, Washington"
});

// Finalize the spreadsheet. If you don't do this, the readstream will not end.
writer.finalize();
writeStream.on('finish', function () {
    // finish
});

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
const openCsvOutputStream = require('./toolkit/openCsvOutputStream');

(async () => {
    console.time('quickExcel')
    const connection = await MongoClient.connect(url)
    const dbo = connection.db("stream");
    const cursor = await dbo.collection("data").find()
    cursor.stream().pipe(openCsvOutputStream("output.csv"))
        .on('complete', data => {
            console.log(data)
        })

})()
