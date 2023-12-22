import { queryThis } from './db.js';

export { setupCateringTable, insertCateringData, selectAllCatering, updateCatering, selectCateringByCateringID };

async function selectAllCatering() {
    try {
        let sql = 'SELECT * FROM EVENTILOPE.Catering';
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function selectCateringByCateringID(cateringID) {
    try {
        let sql = `SELECT * FROM EVENTILOPE.Catering WHERE cateringID=${cateringID}`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function insertCateringData(catering) {
    try {
        let sql = `INSERT INTO EVENTILOPE.Catering( imageUrl, name, description, price)
            VALUES ("${catering.imageUrl}", "${catering.name}", "${catering.description}", "${catering.price}")`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function updateCatering(catering) {
    console.log(catering);
    try {
        let sql = `UPDATE EVENTILOPE.Catering 
                    SET name="${catering.name}",
                        imageUrl="${catering.imageUrl}",
                        description="${catering.description}",
                        price="${catering.price}"
                    WHERE cateringID="${catering.cateringID}";`;
        return await queryThis(sql);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
async function setupCateringTable() {
    try{
        let sql = `CREATE TABLE IF NOT EXISTS EVENTILOPE.Catering( cateringID INT NOT NULL AUTO_INCREMENT, imageUrl MEDIUMTEXT,
            name VARCHAR(255), description MEDIUMTEXT, price VARCHAR(45), PRIMARY KEY (cateringID));`;
        return await queryThis(sql);
    } catch (e) {
        console.log(e);
        return false;
    }
}

