'use strict';

const fs = require('fs');
const path = require('path');

function readSendFile(pathname, res, mime) {
    let filePath = path.join(__dirname, pathname);
    let data = [];                                                // v.1
    // let data = '';                                               // v.0

    res.statusCode = 200;
    res.setHeader('Content-Type', mime);
    res.on('finish', () => {
        console.log('res-on-finish in readSendFile ');
    });

    // let rs = fs.createReadStream(path, 'utf-8');                 // v.0
    let rs = fs.createReadStream(filePath);                           // v.1
    rs.on('error', (error) => {

        if (pathname === '/public/favicon.ico') {
            res.end('It could be favicon');

        } else {
            res.statusCode = 404;  // or 500
            // res.writeHead(404);
            res.end('Not found');
            console.error('File reading error, sent 404: ' + error);
        }
    // }).pipe(res);                                                     // v.2
    });

    rs.on('data', (chunk) => {
        data.push(chunk);                                            // v.1
        // data += chunk;                                              // v.0
    })
    .on('end', () => {
        data = Buffer.concat(data).toString();                       // v.1
        res.writeHead(200, {'Content-Type': mime + '; charset=utf-8'});
        res.end(data, 'utf-8', () => {         // probably utf-8 is default
          console.log(`"${filePath}" sent`);
        });
    })
    .on('close', () => {
        console.log(`rs-on-close in readSendFile`);
    });

    // .on('open', (fd) => {                                             // v.3
    //     res.writeHead(200, {'Content-Type': mime});
    //     rs.pipe(res)
    //     .on('close', () => {
    //         underlying connection was terminated before response.end() was
    //         called or able to flush
    //     })
    //     .on('finish', () => {
    //         Emitted when the response has been sent. This event is emitted
    //         when the last segment of the response headers and body have been
    //         passed to the operating system for transmission over the network.
    //         After this, no more events will be emitted on the res object.
    //     });
    // });


// Previous version with fs.readFile

    // fs.readFile(path, 'utf-8', (err, data) => {
    //     if (err) {

    //         if (pathname !== '/favicon.ico') {

    //             res.writeHead(404);
    //             res.end('Not found');
    //             console.error('File reading error, sent 404: ' + err);

    //         } else {
    //             // res.writeHead(200, {'Content-Type': mime} );
    //             // res.end();
    //             // console.log('"favicon.ico" requested');
    //         }

    //         return;
    //     }
    //     res.writeHead(200, {'Content-Type': mime + '; charset=utf-8'});
    //     res.end(data, 'utf-8', () => {         // probably utf-8 is default
    //       console.log(`"${filePath}" sent`);
    //     });
    // });
}

exports.readSend = readSendFile;
