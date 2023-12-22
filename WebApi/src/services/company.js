import { queryThis } from '../models/db.js';
import { generateToken } from './authentication/token.js';
import { getAllCompanies, getCompanyByCompanyId, updateCompany } from '../models/company.js';
import { errorResponse, successResponse } from '../server.js';
export { createCompany, setCompanyUser, companyAlreadyCreated, getCompanies, changeCompany };

async function getCompanies(role, companyID) {
    switch (role) {
        case 'superAdmin':
            return await getAllCompanies();
        case 'admin':
        case 'implPartner':
            return await getCompanyByCompanyId(companyID);
    }
    return false;
}

async function companyAlreadyCreated(company) {
    let companies = await getAllCompanies();
    for (let checkCompany of companies) {
        if(checkCompany.name === company.name) {
            return checkCompany;
        }
    }
    return false;
}

/**
 * Creates a new company
 * @param company
 */
async function createCompany(company) {
    try {
        company.companyID = await generateToken(12);
        let companySql = `INSERT INTO EVENTILOPE.Companies (companyName, companyID)
                          VALUES ("${company.companyName}", "${company.companyID}");`;
        return await queryThis(companySql);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

async function setCompanyUser(company, user) {
    try {
        let companyUserSql = `INSERT INTO EVENTILOPE.UsersCompanies (userID, companyID)
                              VALUES ("${user.userID}", "${company.companyID}");`;
        return await queryThis(companyUserSql);
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function changeCompany(req, res) {
    let company = JSON.parse(req.body);
    await updateCompany(company) ? successResponse(res, 'Updated company') :
        errorResponse(res, 500, 'Failed to update company');
}
