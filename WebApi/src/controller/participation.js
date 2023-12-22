import { inviteUserIDToEvent, participateInEvent, unInviteUserIDToEvent } from '../services/participation.js';
import { stopParticipatingInEvent } from '../services/participation.js';
import path from 'path';
import { getEventInviteesByEventID, getEventParticipantsByEventID } from '../models/event.js';
import querystring from 'querystring';
import { jsonResponse } from '../server.js';

export { participationRouter };

async function participationRouter(req, res) {
    let pathname = req.url.path.split('/participation')[1];

    if(pathname.includes('/getInvites')) {
        let eventID= querystring.parse(req.url.query).id;
        jsonResponse(res, await getEventInviteesByEventID(eventID));
    }

    if(pathname.includes('/invite')) {
        let body = JSON.parse(req.body);
        await inviteUserIDToEvent(res, body.eventID, body.email);
    }

    if(pathname.includes('/unInvite')) {
        let body = JSON.parse(req.body);
        await unInviteUserIDToEvent(res, body.eventID, body.userID);
    }

    if(pathname.includes('/participate')) {
        await participateInEvent(req, res);
        return;
    }

    if (pathname.includes('/stopParticipating')) {
        await stopParticipatingInEvent(req, res);
        return;
    }

}