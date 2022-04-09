'use strict';

const stream = require('stream');
const fs = require('fs');
const papaparse = require('papaparse');

//
// Open a streaming CSV file for output.
//
function openCsvOutputStream(outputFilePath) {

    let firstOutput = true;
    const fileOutputStream = fs.createWriteStream(outputFilePath); // Create stream for writing the output file.

    const csvOutputStream = new stream.Writable({ objectMode: true }); // Create stream for writing data records, note that 'object mode' is enabled.
    csvOutputStream._write = (chunk, encoding, callback) => { // Handle writes to the stream.
        const outputCSV = papaparse.unparse([chunk], {
            quotes: false, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true,
            newline: "\r\n",
            skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
            columns: null //or array of strings
        });
        fileOutputStream.write(outputCSV + "\n");
        firstOutput = false;
        callback();
    };

    csvOutputStream.on("finish", () => { // When the CSV stream is finished, close the output file stream.
        console.log('finished');
        function printMemoryUsage() {
            var info = process.memoryUsage();
            function mb(v) {
                return (v / 1024 / 1024).toFixed(2) + 'MB';
            }
            console.log('rss=%s, heapTotal=%s, heapUsed=%s', mb(info.rss), mb(info.heapTotal), mb(info.heapUsed));
        }
        printMemoryUsage()
        fileOutputStream.end();
        console.timeEnd('quick')
    });
    return csvOutputStream;
};

module.exports = openCsvOutputStream;