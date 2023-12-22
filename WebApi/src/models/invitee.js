import { queryThis } from './db.js';

export { insertInvitee, checkIfInvited, removeInvitee };

async function insertInvitee(userID, eventID, participates) {
    try {
        let sql = `INSERT INTO EVENTILOPE.UsersEvents (userID, eventID, participates)
                   VALUES ("${userID}", "${eventID}", ${participates});`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function checkIfInvited(eventID, userID) {
    try {
        let sql = `SELECT * FROM EVENTILOPE.UsersEvents WHERE eventID="${eventID}" AND userID="${userID}";`;
        let invited = await queryThis(sql);
        if(invited[0]) {
            return true;
        }
        return false;
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function removeInvitee(userID, eventID) {
    try {
        let sql = `DELETE FROM EVENTILOPE.UsersEvents WHERE userID="${userID}" AND eventID="${eventID}";`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}