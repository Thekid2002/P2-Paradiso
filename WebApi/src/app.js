import http from 'http';

import { processReq } from './router.js';
import { errorResponse } from './server.js';
import { setupDatabases } from './controller/database.js';

export { startServer };

const server = http.createServer(requestHandler);
const hostname = '127.0.0.1';
const port = 3000;

/**
 * Prehandles the request and checks if it is a preflight
 */
async function requestHandler(req, res) {
    try {
        let preflight = await processPreflight(req, res);

        if(preflight) {
            return;
        }

        await parseBody(req, res);
        await processReq(req, res);
    } catch (e) {
        console.log(e);
        errorResponse(res, 500, '');
    }
}

/**
 * This processes the request and returns true if it is a preflight
 */
async function processPreflight(req, res) {
    /** CORS **/
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if(req.method==='OPTIONS') {
        res.statusCode = 204;
        res.end();
        return true;
    }
    return false;
}

/**
 * Parses the body of the request
 */
async function parseBody(req, res) {
    let body = '';
    for await (let chunk of req) {
        body += chunk;
    }
    req.body = body;
}

/**
 * Starts the server and sets up all databases
 */
function startServer() {
    setupDatabases();
    /* start the server */
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}