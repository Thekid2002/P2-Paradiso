import path from 'path';
import fs from 'fs';

export { errorResponse, locationResponse, successResponse, jsonResponse, htmlResponse, fileResponse, readFile };

/**
 * Responds the request with a success response and a message
 * @param res
 * @param message the success message
 */
function successResponse(res, message) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ success: message }));
    res.end('\n');
}

/**
 * Responds the request with an error response and a reason
 * @param res
 * @param code often 500 for error
 * @param reason the reason for the error
 * @param errorType the type of the error (the field that the error applies to)
 */
function errorResponse(res, code, reason, errorType) {
    console.log(reason);
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ error: reason, errorType: errorType }));
    res.end('\n');
}

/**
 * Responds the request with a json response
 * @param res
 * @param obj the obj to JSONify
 */
function jsonResponse(res, obj) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(obj));
    res.end('\n');
}

/**
 * Responds the request with a html response
 * @param res
 * @param htmlString to respond with
 */
function htmlResponse(res, htmlString) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(htmlString);
    res.end('\n');
}

/**
 * Responds the request with a location change
 * @param res
 * @param location the location the client shall go to
 */
function locationResponse(res, location) {
    res.statusCode = 301;
    res.setHeader('Location', location);
    res.end();
}

/**
 * Responds the request with a file
 * @param filename the file to respon with
 * @param res
 */
function fileResponse(filename, res) {
    const sPath= securePath(filename);
    console.log('Reading:'+sPath);
    fs.readFile(sPath, (err, data) => {
        if (err) {
            console.error(err);
            errorResponse(res, 404, String(err));
        }else {
            res.statusCode = 200;
            res.setHeader('Content-Type', guessMimeType(filename));
            res.write(data);
            res.end('\n');
        }
    });
}

async function readFile(filename) {
    const sPath=securePath(filename);
    console.log('Reading:'+sPath);
    try {
        let data = await fs.promises.readFile(sPath);
        return data.toString();
    }catch (err) {
        console.error(err);
        throw err;
    }

}

//A helper function that converts filename suffix to the corresponding HTTP content type
//better alternative: use require('mmmagic') library
function guessMimeType(fileName) {
    const fileExtension=fileName.split('.').pop().toLowerCase();
    const ext2Mime ={ //Aught to check with IANA spec
        'txt': 'text/txt',
        'html': 'text/html',
        'ico': 'image/ico', // CHECK x-icon vs image/vnd.microsoft.icon
        'js': 'text/javascript',
        'json': 'application/json',
        'css': 'text/css',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'wav': 'audio/wav',
        'mp3': 'audio/mpeg',
        'svg': 'image/svg+xml',
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/msword'
    };
    //incomplete
    return (ext2Mime[fileExtension]||'text/plain');
}

const publicResources = 'src/PublicResources/';
//secture file system access as described on
//https://nodejs.org/en/knowledge/file-system/security/introduction/
const rootFileSystem = process.cwd();

/**
 * Makes sure that the file path is a secure path
 * @param userPath path to secure
 */
function securePath(userPath) {
    if(userPath.includes('.html')) {
        userPath = '/html' + userPath;
    }

    if (userPath.indexOf('\0') !== -1) {
        // could also test for illegal chars: if (!/^[a-z0-9]+$/.test(filename)) {return undefined;}
        return undefined;

    }
    userPath = path.normalize(userPath).replace(/^(\.\.(\/|\\|$))+/, '');
    userPath= publicResources+userPath;

    let p= path.join(rootFileSystem, path.normalize(userPath));
    //console.log("The path is:"+p);
    return p;
}