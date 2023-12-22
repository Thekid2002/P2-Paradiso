import { queryThis } from './db.js';

export { setupVenuesTable, insertVenueData, selectAllVenues, updateVenue, selectVenueByVenueID };


async function selectAllVenues() {
    try {
        let sql = 'SELECT * FROM EVENTILOPE.Venues';
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function selectVenueByVenueID(venueID) {
    try {
        let sql = `SELECT * FROM EVENTILOPE.Venues WHERE venueID="${venueID}"`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function insertVenueData(venue) {
    try {
        let sqpl = `INSERT INTO EVENTILOPE.Venues( imageUrl, name, description, price, location)
            VALUES ("${venue.imageUrl}", "${venue.name}", "${venue.description}", "${venue.price}", "${venue.location}")`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function updateVenue(venue) {
    console.log(venue);
    try {
        let sql = `UPDATE EVENTILOPE.Venues 
                    SET name="${venue.name}",
                        imageUrl="${venue.imageUrl}",
                        description="${venue.description}",
                        price="${venue.price}",
                        location="${venue.location}"
                    WHERE venueID="${venue.venueID}";`;
        return await queryThis(sql);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

async function setupVenuesTable() {
    try{
        let sql = `CREATE TABLE IF NOT EXISTS EVENTILOPE.Venues( venueID INT NOT NULL AUTO_INCREMENT, imageUrl MEDIUMTEXT, name VARCHAR(255),
            description MEDIUMTEXT, price VARCHAR(45), location VARCHAR(255), PRIMARY KEY (venueID));`;
        return await queryThis(sql);
    } catch (e) {
        console.log(e);
        return false;
    }
}