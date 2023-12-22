import { getCompanies, changeCompany } from '../services/company.js';
import { jsonResponse } from '../server.js';

export { companyRouter };

/**
 * Receives all routes from the main router that contain auth
 */
async function companyRouter(req, res) {
    let pathname = req.url.path.split('/company')[1];

    if(pathname.includes('/get')) {
        jsonResponse(res, await getCompanies(req.headers.authorization.role, req.headers.authorization.companyID));
        return;
    }
    if(req.headers.authorization.role !== 'worker') {
        if (pathname.includes('/change')) {
            await changeCompany(req, res);
        }
    }
}