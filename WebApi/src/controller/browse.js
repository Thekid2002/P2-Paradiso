import { jsonResponse } from '../server.js';
import { getBrowse } from '../services/browse.js';
import querystring from 'querystring';

export { browseRouter };

/**
 * Receives all routes from the main router that contain browse
 */
async function browseRouter(req, res) {
    let pathname = req.url.path.split('/browse')[1];

    if(pathname.includes('/get')) {
        let query = querystring.parse(req.url.query);
        let reqUser = req.headers.authorization;
        jsonResponse(res, await getBrowse(reqUser.role, query.search,
            reqUser.companyID, query.visibility, reqUser.userID));
    }

}