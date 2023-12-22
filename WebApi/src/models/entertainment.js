import { queryThis } from './db.js';

export { setupEntertainmentTable, insertEntertainmentData, selectAllEntertainment, updateEntertainment, selectEntertainmentByEntertainmentID };

async function selectAllEntertainment() {
    try {
        let sql = 'SELECT * FROM EVENTILOPE.Entertainments';
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function selectEntertainmentByEntertainmentID(entertainmentID) {
    try {
        let sql = `SELECT * FROM EVENTILOPE.Entertainments WHERE entertainmentID="${entertainmentID}"`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function insertEntertainmentData(entertainment) {
    try {
        let sql = `INSERT INTO EVENTILOPE.Entertainments( imageUrl, name, description, price)
            VALUES ("${entertainment.imageUrl}", "${entertainment.name}", "${entertainment.description}", "${entertainment.price}")`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function updateEntertainment(entertainment) {
    console.log(entertainment);
    try {
        let sql = `UPDATE EVENTILOPE.Entertainments 
                    SET name="${entertainment.name}",
                        imageUrl="${entertainment.imageUrl}",
                        description="${entertainment.description}",
                        price="${entertainment.price}"
                    WHERE entertainmentID="${entertainment.entertainmentID}";`;
        return await queryThis(sql);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
async function setupEntertainmentTable() {
    try{
        let sql = `CREATE TABLE IF NOT EXISTS EVENTILOPE.Entertainments( entertainmentID INT NOT NULL AUTO_INCREMENT, imageUrl MEDIUMTEXT,
            name  VARCHAR(255), description MEDIUMTEXT, price VARCHAR(45), PRIMARY KEY (entertainmentID));`;
        return await queryThis(sql);
    } catch (e) {
        console.log(e);
        return false;
    }
}