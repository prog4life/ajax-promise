'use strict';

const http = require('http');
const router = require('./router');

const server = http.createServer();

server.on('request', (req, res) => {
    console.log('Request received');

    req.on('error', err => console.error(err));
    res.on('error', err => console.error(err));

    router.route(req, res);

}).listen(process.env.PORT || 3000, process.env.IP || 'localhost', () => {
    // let servInfo = server.address();
    // console.log(`Server is listening at ${servInfo.address}:${servInfo.port}`);
    console.log(`Server is listening at ${process.env.IP}:${process.env.PORT}`);
});
