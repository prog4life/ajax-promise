'use strict';

const url = require('url');
const path = require('path');
const mimetypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.ico': 'img/x-icon',
    '.json': 'application/json'
};

let mime = 'text/html';

const routes = {};
routes['/'] = routeStart;
routes['/store'] = routeStore;

const fileHandler = require('./file-handler');
const queryHandler = require('./query-handler');

function route(req, res) {

    let urlObj = url.parse(req.url, true);  // true flag for query as object
    let pathname = urlObj.pathname;
    let reqQuery = urlObj.query;                    // url query part as object
    // let reqQueryStr = url.parse(req.url).query;  // url query part as string

    // console.log(`req.url: ${req.url}`);
    // console.log('pathname: ', pathname);
    // console.log('reqQuery: %o', reqQuery);

    // let lastSlashPos = pathname.lastIndexOf('/');

    // cut slash at the end, if present:
    // if (lastSlashPos === pathname.length - 1 && pathname !== '/') {

    //     pathname = pathname.substring(0, lastSlashPos);
    // }

    let pathnamePart;
    let absPath = path.join(__dirname, pathname);
    let ext = path.extname(absPath);

    // get part of pathname, without filename and extension
    pathnamePart = (ext !== '')
        ? path.dirname(pathname)
        : pathname;

    if (routes[pathnamePart]) {

        routes[pathnamePart](reqQuery, res, pathname, ext);

    } else {
        res.statusCode = 400;
        res.end('Bad request', () => console.log('400 was sent'));
    }

// urlObj:
// {
//   protocol: null,
//   slashes: null,
//   auth: null,
//   host: null,
//   port: null,
//   hostname: null,
//   hash: null,
//   search: '?food=kj',
//   query: { food: 'kj' },
//   pathname: '/store',
//   path: '/store?food=kj',
//   href: '/store?food=kj' }

}

function routeStart(query, res, pathname, ext) {
    if (ext !== '') {
        mime = mimetypes[ext] || 'text/plain';
        pathname = '/public/' + pathname;
    } else {
        mime = 'text/html';
        pathname = '/public/index.html';
    }

    fileHandler.readSend(pathname, res, mime);
}

function routeStore(query, res) {
    if ('food' in query) {
        queryHandler.handle(query, res);
    } else {
        res.statusCode = 400;
        res.end('Bad request, no food data in query', () =>
            console.log('400 was sent, no food data in query'));
    }
}

exports.route = route;
