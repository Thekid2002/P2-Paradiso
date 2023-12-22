import { queryThis } from '../models/db.js';
import { errorResponse, readFile, successResponse } from '../server.js';
import { getEventInviteesByEventID } from '../models/event.js';
import { insertInvitee, removeInvitee } from '../models/invitee.js';
import { createUser, deleteUserByUserID, getUsersWhere } from '../models/user.js';
import { generateToken } from './authentication/token.js';

export { setupUsersEventsTable, participateInEvent, checkUserParticipation, stopParticipatingInEvent,
    inviteUserIDToEvent, unInviteUserIDToEvent };

async function inviteUserIDToEvent(res, eventID, email) {
    let user = await getUsersWhere('*', `email="${email}"`);
    user = user[0];
    if(!user) {
        user = {};
        user.email = email;
        user.userID = await generateToken(12);
        await createUser(user);
    }

    let invitees = await getEventInviteesByEventID(eventID);
    if(invitees.find(invitee => invitee.userID === user.userID)) {
        errorResponse(res, 500, 'Already invited');
        return;
    }

    await insertInvitee(user.userID, eventID, 0) ? successResponse(res, 'Successfully invited user') :
        errorResponse(res, 500, 'Failed to invite user');
}

async function unInviteUserIDToEvent(res, eventID, userID) {
    let invitees = await getEventInviteesByEventID(eventID);
    if(invitees.find(invitee => invitee.userID === userID)) {
        await removeInvitee(userID, eventID) ? successResponse(res, 'Successfully removed user') :
            errorResponse(res, 500, 'Failed to remove user');
        return;
    }
    errorResponse(res, 500, 'Not invited');
}

async function participateInEvent(req, res) {
    let event = { eventID: JSON.parse(req.body) };
    let user = req.headers.authorization;
    try {
        let invitees = await getEventInviteesByEventID(event.eventID);
        let sql;
        if(invitees.find(invitee => invitee.userID === user.userID)) {
            sql = `UPDATE EVENTILOPE.UsersEvents SET participates=1
                              WHERE userID="${user.userID}" AND eventID="${event.eventID}";`;
        }else{
            sql = `INSERT INTO EVENTILOPE.UsersEvents (userID, eventID, participates)
                       VALUES ("${user.userID}", "${event.eventID}", 1);`;
        }
        await queryThis(sql) ? successResponse(res, 'Participated in event!') :
            errorResponse(res, 500, 'Could not participate in event');
    } catch (e) {
        console.log(e);
    }
}

async function stopParticipatingInEvent(req, res) {
    let event = { eventID: JSON.parse(req.body) };
    let user = req.headers.authorization;
    try {
        let sql = `UPDATE EVENTILOPE.UsersEvents SET participates=0
                              WHERE userID="${user.userID}" AND eventID="${event.eventID}";`;
        await queryThis(sql) ? successResponse(res, 'Stopped participating in event!') :
            errorResponse(res, 500, 'Failed to stop participating in event');
    } catch (e) {
        console.log(e);
    }
}

async function checkUserParticipation(eventID, userID) {
    let userEventParticipation = await getUserEventParticipationByEventID(eventID);

    for (let userEventParticipate of userEventParticipation) {
        if (userEventParticipate.participates === 1 && userID === userEventParticipate .userID) {
            return true;
        }
    }
    return false;
}

async function getUserEventParticipationByEventID(eventID) {
    let sql = `SELECT * FROM EVENTILOPE.UsersEvents WHERE eventID="${eventID}";`;
    return await queryThis(sql);
}


async function setupUsersEventsTable() {
    try {
        let sql = 'CREATE TABLE IF NOT EXISTS EVENTILOPE.UsersEvents (' +
            '  id INT NOT NULL AUTO_INCREMENT,' +
            '  userID VARCHAR(20),' +
            '  eventID VARCHAR(20),' +
            '  participates TINYINT,' +
            '  PRIMARY KEY (id),' +
            '  FOREIGN KEY (userID) REFERENCES Users(userID),' +
            '  FOREIGN KEY (eventID) REFERENCES Events(eventID)' +
            ');';
        await queryThis(sql);
    } catch (e) {
        console.error(e);
    }
}