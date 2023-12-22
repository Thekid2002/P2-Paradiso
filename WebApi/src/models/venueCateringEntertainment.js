import { queryThis } from './db.js';

export { insertVenCatEnt, setupEventsVenueCateringEntertainmentTable, selectVenCatEntByEventID, updateVenCatEnt };


async function updateVenCatEnt(venCatEnt) {
    try {
        let sql = `UPDATE EVENTILOPE.EventsVenueCateringEntertainment SET
                    eventID="${venCatEnt.eventID}"
                         , venueID=${venCatEnt.selectedVenue ? venCatEnt.selectedVenue : 'NULL' }
            , cateringID=${venCatEnt.selectedCatering ? venCatEnt.selectedCatering : 'NULL' }
            , entertainmentID= ${venCatEnt.selectedEntertainment ? venCatEnt.selectedEntertainment  : 'NULL' }
            WHERE eventID="${venCatEnt.eventID}"`;
        return await  queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function insertVenCatEnt(venCatEnt) {
    try {
        let sql = `INSERT INTO EVENTILOPE.EventsVenueCateringEntertainment (eventID, venueID, cateringID, entertainmentID)
                   VALUES("${venCatEnt.eventID}"
                       ${venCatEnt.selectedVenue ? ',"' + venCatEnt.selectedVenue +'"' : ', NULL' }
                       ${venCatEnt.selectedCatering ? ',"' + venCatEnt.selectedCatering +'"' : ', NULL'}
                       ${venCatEnt.selectedEntertainment ? ',"' + venCatEnt.selectedEntertainment +'"' : ', NULL'})`;
        return await  queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function selectVenCatEntByEventID(eventID) {
    try {
        let sql = `SELECT * FROM EVENTILOPE.EventsVenueCateringEntertainment WHERE eventID="${eventID}" `;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * Creates the event table for the event database
 */
async function setupEventsVenueCateringEntertainmentTable() {
    try {
        let sql = `CREATE TABLE IF NOT EXISTS EVENTILOPE.EventsVenueCateringEntertainment(
            id int NOT NULL AUTO_INCREMENT,
            eventID VARCHAR(20),
            venueID int,
            cateringID int,
            entertainmentID int,
            PRIMARY KEY (id),
            FOREIGN KEY (eventID) REFERENCES Events(eventID),
            FOREIGN KEY (venueID) REFERENCES Venues(venueID),
            FOREIGN KEY (cateringID) REFERENCES Catering(cateringID),
            FOREIGN KEY (entertainmentID) REFERENCES Entertainments(entertainmentID));`;
        await queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}