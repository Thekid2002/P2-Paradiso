import { editEvent, newEvent, removeEvent } from '../services/event.js';
import { errorResponse, jsonResponse, locationResponse } from '../server.js';
import querystring from 'querystring';
import { getEventById, getEventInviteesByEventID, getEventParticipantsByEventID } from '../models/event.js';

export { eventRouter };

/**
 * Receives all routes from the main router that contain event
 */
async function eventRouter(req, res) {
    let pathname = req.url.path.split('/event')[1];

    if(pathname.includes('/getEvent')) {
        let id = querystring.parse(req.url.query).id;

        if(!id) {
            errorResponse(res, 500, 'No Id');
            return;
        }

        let event = await getEventById(id);
        let invitees = await getEventInviteesByEventID(id);
        invitees = invitees.filter(invitee => invitee.userID = req.headers.authorization.userID);
        if(event.companyID !== req.headers.authorization.companyID && event.visibility !== 'public' &&
            req.headers.authorization.role !== 'admin' && invitees.length === 0) {
            errorResponse(res, 500, 'Not authorized');
            return;
        }

        let participants = await getEventParticipantsByEventID(event.eventID);
        event.participants = participants.length;
        jsonResponse(res, event);
        return;
    }
    let role = req.headers.authorization.role;
    if(role !== 'implPartner' && role !== 'admin' && role !== 'superAdmin') {
        return errorResponse(res, 500, 'Not Authorized');
    }

    if(pathname.includes('/updateEvent')) {
        editEvent(req, res);
        return;
    }

    if(pathname.includes('/deleteEvent')) {
        removeEvent(req, res);
        return;
    }

    if(pathname.includes('/createEvent')) {
        newEvent(req, res);
        return;
    }
}