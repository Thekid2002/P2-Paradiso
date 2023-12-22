import { queryThis } from './db.js';

export { setupUserCompanyTable, setupCompanyTable, getAllCompanies, getCompanyAndUserFromUser, getAllUsersAndCompanies, getCompanyByCompanyId, updateCompany };

async function getCompanyAndUserFromUser(user) {
    try {
        let sql = `SELECT Users.role, Users.name, Users.email, Users.userID, UsersCompanies.companyID, Companies.companyName
            FROM EVENTILOPE.Users
            INNER JOIN EVENTILOPE.UsersCompanies ON Users.userID = UsersCompanies.userID
            INNER JOIN EVENTILOPE.Companies ON UsersCompanies.companyID = Companies.companyID
                WHERE UsersCompanies.userID = "${user.userID}";`;
        return await queryThis(sql);
    }
    catch (e) {
        console.error(e);
        return false;
    }
}

async function getAllUsersAndCompanies() {
    try {
        let sql = `SELECT Users.role, Users.name, Users.email, Users.userID, UsersCompanies.companyID, Companies.companyName
            FROM EVENTILOPE.Users
            LEFT JOIN EVENTILOPE.UsersCompanies ON Users.userID = UsersCompanies.userID
            LEFT JOIN EVENTILOPE.Companies ON UsersCompanies.companyID = Companies.companyID;`;
        return await queryThis(sql);
    }
    catch (e) {
        console.error(e);
        return false;
    }
}

async function getAllCompanies() {
    try {
        let companySql = 'SELECT * FROM EVENTILOPE.Companies';
        return await queryThis(companySql);
    }
    catch (e) {
        console.error(e);
        return false;
    }
}

async function getCompanyByCompanyId(companyID) {
    try {
        let sql = `SELECT *
                   FROM EVENTILOPE.Companies
                   WHERE companyID = "${companyID}"`;
        return await queryThis(sql);
    }catch (e) {
        console.error(e);
        return false;
    }
}

async function joinCompany(user, companyId) {

}
async function setupCompanyTable() {
    try {
        let sql = `CREATE TABLE IF NOT EXISTS EVENTILOPE.Companies(companyName MEDIUMTEXT, authenticated TINYINT,
            CompanyID VARCHAR(255), CompanyEditorID VARCHAR(255), primary key (CompanyID));`;
        await queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Sets up the tables in the client database
 */
async function setupUserCompanyTable() {
    try {
        let sql = 'CREATE TABLE IF NOT EXISTS EVENTILOPE.' +
            'UsersCompanies (' +
            '  id INT NOT NULL AUTO_INCREMENT,' +
            '  userID VARCHAR(255),' +
            '  companyID VARCHAR(255),' +
            '  PRIMARY KEY (id),' +
            '  FOREIGN KEY (userID) REFERENCES Users(userID),' +
            '  FOREIGN KEY (companyID) REFERENCES Companies(companyID)' +
            ');';
        await queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function updateCompany(company) {
    try {
        let sql = `UPDATE EVENTILOPE.Companies 
                    SET companyName="${company.companyName}",
                        CompanyEditorID="${company.companyEditorID}"
                    WHERE CompanyID="${company.companyID}";`;
        return await queryThis(sql);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}