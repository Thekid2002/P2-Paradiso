import { queryThis } from './db.js';

export { createScheduleTable, insertActivity, getScheduleByEventId, deleteActivityByActivityAndEvent, updateActivity };

async function deleteActivityByActivityAndEvent(activityID, eventID) {
    try {
        let sql = `DELETE
                   FROM EVENTILOPE.Schedule
                   WHERE eventID = "${eventID}"
                     AND activityID = "${activityID}"`;
        return await queryThis(sql);
    }catch (e) {
        console.error(e);
        return false;
    }
}

async function getScheduleByEventId(eventID) {
    try {
        let sql = `SELECT * FROM EVENTILOPE.Schedule WHERE eventID="${eventID}"`;
        return await queryThis(sql);
    } catch (e) {
        console.error(e);
    }
}

async function createScheduleTable() {
    try {
        let sql = 'CREATE TABLE IF NOT EXISTS EVENTILOPE.Schedule (' +
            '  activityID INT NOT NULL AUTO_INCREMENT,' +
            '  activity VARCHAR(100),' +
            '  activityWorker VARCHAR(20),' +
            '  time VARCHAR(20),' +
            '  completed TINYINT,' +
            '  eventID VARCHAR(20),' +
            '  FOREIGN KEY (activityWorker) REFERENCES Users(userID),' +
            '  FOREIGN KEY (eventID) REFERENCES Events(eventID),' +
            '  PRIMARY KEY (activityID));';
        await queryThis(sql);
    } catch (e) {
        console.error(e);
    }
}

async function insertActivity(activity, time, eventID) {
    try {
        let sql = `INSERT INTO EVENTILOPE.Schedule (activity, time, eventID, completed) 
VALUES ("${activity}", "${time}", "${eventID}", 0);`;
        return await queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function updateActivity(eventID, activityID, completed) {
    try {
        let sql = `UPDATE EVENTILOPE.Schedule SET completed="${completed ? 1 : 0}" WHERE eventID="${eventID}"
            AND activityID="${activityID}";`;
        return await queryThis(sql);
    }catch (e) {
        console.error(e);
        return false;
    }
}