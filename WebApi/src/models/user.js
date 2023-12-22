import { queryThis } from './db.js';
import { createCompany, setCompanyUser } from '../services/company.js';
import { generateToken } from '../services/authentication/token.js';

export { getAllUsers, getUsersWhere, createUserAndCreateCompany, updateUserAndCreateCompany, setupUsersTable, updateUser,
    createUserAndJoinCompany, updateUserAndJoinCompany, createUser, getAllUsersInCompany, deleteUserByUserID,
    getAllUsersInCompanyNotSuperAdmin, getAllUsersInCompanyNotAdminOrSuperAdmin };

async function getAllUsers() {
    try {
        let sql = 'SELECT * FROM EVENTILOPE.Users;';
        return await queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function getUsersWhere(columns, parameters) {
    try {
        let sql = `SELECT ${columns ? `${columns}` : '*'} FROM EVENTILOPE.Users ${parameters ? `WHERE ${parameters}` : ''};`;
        return await queryThis(sql);
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function updateUser(user) {
    try {
        let sql = `UPDATE EVENTILOPE.Users 
                    SET`;
        if(!user.token) {
            user.token = await generateToken(50);
        }
        sql += ` token="${user.token}",`;
        sql += user.name ? ` name="${user.name}"` : '';
        sql += user.email ? `, email="${user.email}"` : '';
        sql += user.role ? `, role="${user.role}"` : '';
        sql += user.loggedIn ? `, loggedIn="${user.loggedIn}"` : '';
        sql += user.password ? `, password="${user.password}"` : '';
        sql += user.authenticated ? `, authenticated="${user.authenticated}"` : '';
        sql += user.companyOrPrivate ? `, companyOrPrivate="${user.companyOrPrivate}" ` : ' ';
        sql += `WHERE userID="${user.userID}";`;
        return  await queryThis(sql);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

async function getAllUsersInCompanyNotSuperAdmin(companyID) {
    try {
        let sql = `SELECT Users.role, Users.userID, Users.name, Users.email, UsersCompanies.companyID, Companies.companyName
                FROM EVENTILOPE.Users
                INNER JOIN EVENTILOPE.UsersCompanies ON Users.userID = UsersCompanies.userID
                INNER JOIN EVENTILOPE.Companies ON UsersCompanies.companyID = Companies.companyID
                WHERE UsersCompanies.companyID = "${companyID}" AND Users.role<>"superAdmin";`;
        return await queryThis(sql);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

async function getAllUsersInCompanyNotAdminOrSuperAdmin(companyID) {
    try {
        let sql = `SELECT Users.role, Users.userID, Users.name, Users.email, UsersCompanies.companyID, Companies.companyName
                FROM EVENTILOPE.Users
                INNER JOIN EVENTILOPE.UsersCompanies ON Users.userID = UsersCompanies.userID
                INNER JOIN EVENTILOPE.Companies ON UsersCompanies.companyID = Companies.companyID
                WHERE UsersCompanies.companyID = "${companyID}" AND Users.role<>"admin" AND Users.role<>"superAdmin";`;
        return await queryThis(sql);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

async function getAllUsersInCompany(companyID) {
    try {
        let sql = `SELECT Users.role, Users.userID, Users.name, Users.email, UsersCompanies.companyID, Companies.companyName
                FROM EVENTILOPE.Users
                INNER JOIN EVENTILOPE.UsersCompanies ON Users.userID = UsersCompanies.userID
                INNER JOIN EVENTILOPE.Companies ON UsersCompanies.companyID = Companies.companyID
                WHERE UsersCompanies.companyID = "${companyID}";`;
        return await queryThis(sql);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

async function deleteUserByUserID(userID) {
    try {
        let sql = `DELETE
                   FROM EVENTILOPE.Users
                   WHERE userID = "${userID}";`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        return false;
    }

}

async function createUser(user) {
    try {
        let date = Date.now();

        let sql = `INSERT INTO EVENTILOPE.Users (name, companyOrPrivate, email, password, token,
                                                 signupDate, authenticated, userID, role)
                   VALUES ("${user.name}", "${user.companyOrPrivate}", "${user.email}",
                           "${user.password}", "${user.token}", "${date}", 0, "${user.userID}", "${user.role}");`;
        return await queryThis(sql);
    }catch (e) {
        console.log(e);
        await deleteUserByUserID(user.userID);
        return false;
    }
}

async function createUserAndCreateCompany(user, company) {
    await createUser(user);

    await createCompany(company, user);

    await setCompanyUser(company, user);
}

async function updateUserAndCreateCompany(user, company) {

    await updateUser(user);

    await createCompany(company, user);

    await setCompanyUser(company, user);
}

async function createUserAndJoinCompany(user, company) {
    await createUser(user);

    await setCompanyUser(company, user);
}

async function updateUserAndJoinCompany(user, company) {
    await updateUser(user);

    await setCompanyUser(company, user);
}

async function setupUsersTable() {
    try {
        let sql = 'CREATE TABLE IF NOT EXISTS EVENTILOPE.Users(userID VARCHAR(20), name MEDIUMTEXT, role VARCHAR(255),' +
            ' email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, token VARCHAR(255), lastLogin VARCHAR(255),' +
            ' loggedIn TINYINT, companyOrPrivate VARCHAR(20), authenticated TINYINT NULL DEFAULT NULL, signupDate VARCHAR(255),' +
            ' primary key (UserID));';
        await queryThis(sql);
    } catch (e) {
        console.error(e);
    }
}

