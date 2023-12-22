import querystring from 'querystring';
import { createActivity, getSchedule, deleteActivity, checkSchedule } from '../services/schedule.js';

export { scheduleRouter };

async function scheduleRouter(req, res) {
    let pathname = req.url.path.split('/schedule')[1];


    if(pathname === '/add') {
        let activity = JSON.parse(req.body);
        await createActivity(res, activity.activity, activity.time, activity.eventID, req.headers.authorization.role, req.headers.authorization.companyID);
    }

    if(pathname === '/get') {
        let eventID = querystring.parse(req.url.query).id;
        await getSchedule(res, req.headers.authorization.role, req.headers.authorization.companyID, eventID);
    }

    if(pathname === '/check') {
        let activity = JSON.parse(req.body);
        await checkSchedule(res, activity.eventID, activity.activityID, activity.checked);
        console.log(activity);
    }

    if(pathname === '/delete') {
        let body = JSON.parse(req.body);
        await deleteActivity(res, body.activityID, body.eventID, req.headers.authorization.role, req.headers.authorization.companyID);
    }
}