import { getDashboardByEventID } from '../services/dashboard.js';
import querystring from 'querystring';

export { dashboardRouter };


async function dashboardRouter(req, res) {
    let pathname = req.url.path.split('/dashboard')[1];

    if(pathname.includes('/getDashboard')) {
        let eventID = querystring.parse(req.url.query).id;
        getDashboardByEventID(res, eventID, req.headers.authorization.role, req.headers.authorization.companyID);
    }

}