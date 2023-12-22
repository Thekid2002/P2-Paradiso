import { queryThis } from './db.js';
import { generateToken } from '../services/authentication/token.js';
import { checkIfInvited } from './invitee.js';

export { getAllEvents, getEventsWhere, deleteEvent, updateEvent, insertEvent, setupEventTable, getEventParticipantsByEventID,
    setupCompaniesEventsTable, getEventInviteesByEventID, getCompanyByEventID, getEventById, getEventsByCompanyInvitedOrPublic };

/**
 * Gets all the events from the database
 */
async function getAllEvents(userID) {
    try {
        let sql = `SELECT * FROM EVENTILOPE.Events
            INNER JOIN EVENTILOPE.CompaniesEvents ON Events.eventID = CompaniesEvents.eventID
            INNER JOIN EVENTILOPE.Companies ON Companies.companyID = CompaniesEvents.companyID;`;
        let events = await queryThis(sql);
        if(userID) {
            for (let event of events) {
                event.invited = await checkIfInvited(event.eventID, userID);
            }
        }
        return events;
    }catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * Get a specific event by id
 * @param eventID of the event
 */
async function getEventById(eventID) {
    try {
        let sql = `SELECT *
                   FROM EVENTILOPE.Events
                            INNER JOIN EVENTILOPE.CompaniesEvents ON Events.eventID = CompaniesEvents.eventID
                            INNER JOIN EVENTILOPE.Companies ON CompaniesEvents.companyID = Companies.companyID
                   WHERE Events.eventID = "${eventID}";`;
        let event = await queryThis(sql);
        event = event[0];
        return event;
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function getEventsByCompanyInvitedOrPublic(companyID, userID) {
    try {
        let events = await getAllEvents();
        for (let event of events) {
            event.invited = await checkIfInvited(event.eventID, userID);
        }
        events = events.filter(function (event) {
            return event.companyID === companyID || event.visibility === 'public' || event.invited;
        });
        return events;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function getEventsWhere(columns, parameters) {
    try {
        let sql = `SELECT ${columns ? `${columns}` : '*'} FROM EVENTILOPE.Events
            INNER JOIN EVENTILOPE.CompaniesEvents ON Events.eventID = CompaniesEvents.eventID
            INNER JOIN EVENTILOPE.Companies ON Companies.companyID = CompaniesEvents.companyID
             ${parameters ? `WHERE ${parameters}` : ''};`;
        return await queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * This function gets invitees no matter if they participate or not
 * @param eventID
 * @returns {Promise<unknown>}
 */
async function getEventInviteesByEventID(eventID) {
    try {
        let sql = `SELECT Users.role, Users.authenticated, Users.name, Users.email, Users.userID, UsersEvents.eventID, UsersEvents.participates
                   FROM EVENTILOPE.Users
                            INNER JOIN EVENTILOPE.UsersEvents ON Users.userID = UsersEvents.userID
                   WHERE UsersEvents.eventID = "${eventID}";`;
        return queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * This function gets participants, so invitees who have chosen to participate
 * @param event
 * @returns {Promise<unknown>}
 */
async function getEventParticipantsByEventID(eventID) {
    try {
        let sql = `SELECT Users.role, Users.name, Users.email, Users.userID, UsersEvents.eventID
                   FROM EVENTILOPE.Users
                            INNER JOIN EVENTILOPE.UsersEvents ON Users.userID = UsersEvents.userID
                   WHERE UsersEvents.eventID = "${eventID}" AND UsersEvents.participates=1;`;
        return queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function getCompanyByEventID(eventID) {
    try {
        let sql = `SELECT *
                   FROM EVENTILOPE.CompaniesEvents
                   WHERE eventID = "${eventID}"`;
        let company = await queryThis(sql);
        return company[0];
    }catch (e) {
        console.error(e);
        return false;
    }
}

async function updateEvent(event) {
    try {
        let sql = `UPDATE EVENTILOPE.Events
                   SET title="${event.title}",
                       description="${event.description}",
                       imageUrl="${event.imageUrl}",
                       price="${event.price}",
                       location="${event.location}",
                       startDateTime="${event.startDateTime}",
                       endDateTime="${event.endDateTime}",
                           visibility="${event.visibility}"
                       WHERE eventID = "${event.eventID}";`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function insertEvent(event, companyID) {
    try {
        let eventID = await generateToken(12);
        let sql = `INSERT INTO EVENTILOPE.Events (eventID, title, description, imageUrl, price, location, startDateTime, endDateTime, visibility)
                   VALUES ("${eventID}","${event.title}", "${event.description}", "${event.imageUrl}", "${event.price}",
                           "${event.location}", "${event.startDateTime}", "${event.endDateTime}", "${event.visibility}");`;
        let companySql = `INSERT INTO EVENTILOPE.CompaniesEvents (companyID, eventID) VALUES ("${companyID}", "${eventID}")`;
        await queryThis(sql);
        return await queryThis(companySql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function deleteEvent(event) {
    try {
        let companiesEventsSql = `DELETE FROM EVENTILOPE.CompaniesEvents WHERE eventID="${event.eventID}";`;
        let usersEventsSql = `DELETE FROM EVENTILOPE.UsersEvents WHERE eventID="${event.eventID}";`;
        let eventsVenueCateringEntertainmentSql = `DELETE FROM EVENTILOPE.EventsVenueCateringEntertainment WHERE eventID="${event.eventID}"`;
        let scheduleSql = `DELETE FROM EVENTILOPE.Schedule WHERE eventID="${event.eventID}"`;
        let sql = `DELETE FROM EVENTILOPE.Events WHERE eventID="${event.eventID}";`;
        await queryThis(companiesEventsSql);
        await queryThis(eventsVenueCateringEntertainmentSql);
        await queryThis(scheduleSql);
        await queryThis(usersEventsSql);
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

/**
* Creates the event table for the event database
*/
async function setupEventTable() {
    try {
        let sql = 'CREATE TABLE IF NOT EXISTS EVENTILOPE.Events(eventID varchar(20), title MEDIUMTEXT, ' +
            'description MEDIUMTEXT, imageUrl MEDIUMTEXT, price MEDIUMTEXT, location MEDIUMTEXT, startDateTime MEDIUMTEXT, endDateTime MEDIUMTEXT,' +
            ' visibility MEDIUMTEXT, primary key (eventID));';
        await queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}


/**
 * Creates the event table for the event database
 */
async function setupCompaniesEventsTable() {
    try {
        let sql = 'CREATE TABLE IF NOT EXISTS EVENTILOPE.CompaniesEvents(id int NOT NULL AUTO_INCREMENT, eventID VARCHAR(20), ' +
            'companyID VARCHAR(20),' +
            'PRIMARY KEY (id),' +
            'FOREIGN KEY (companyID) REFERENCES Companies(companyID),' +
            'FOREIGN KEY (eventID) REFERENCES Events(eventID));';
        await queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}