import { errorResponse, jsonResponse, successResponse } from '../../server.js';
import { queryThis } from '../../models/db.js';
import { generateToken } from './token.js';
import { authorize, sendEmail } from '../../controller/mail.js';
import { companyAlreadyCreated, createCompany, setCompanyUser } from '../company.js';
import {
    createUser,
    createUserAndCreateCompany,
    createUserAndJoinCompany,
    getAllUsers,
    getAllUsersInCompany,
    getAllUsersInCompanyNotSuperAdmin,
    getAllUsersInCompanyNotAdminOrSuperAdmin,
    getUsersWhere,
    updateUser,
    updateUserAndCreateCompany,
    updateUserAndJoinCompany
} from '../../models/user.js';
import { sendForgotPasswordEmail } from './authentication.js';
import { getAllUsersAndCompanies } from '../../models/company.js';

export { loginUser, createUserWithCompany, cleanUserData, mailAlreadySignedUp, verifyUser,
    changeUser, forgotPassword, createUserWithoutCompany, getUsersPage };


async function getUsersPage(res, role, companyID) {
    let users;
    switch (role) {
        case 'implPartner':
            users = await getAllUsersInCompanyNotAdminOrSuperAdmin(companyID);
            for (let user of users) {
                user.adminRole = 0;
                user.superAdminRole = 0;
            }
            jsonResponse(res, users);
            break;
        case 'admin':
            users = await getAllUsersInCompanyNotSuperAdmin(companyID);
            for (let user of users) {
                user.adminRole = 1;
                user.superAdminRole = 0;
            }
            jsonResponse(res, users);
            break;
        case 'superAdmin':
            users = await getAllUsersAndCompanies();
            for (let user of users) {
                user.adminRole = 1;
                user.superAdminRole = 1;
            }
            jsonResponse(res, users);
            break;
    }
}

/**
 * Sends the user an email with their password
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function forgotPassword(req, res) {
    try {
        let user = JSON.parse(req.body);
        user.email = user.email.toLowerCase();
        user = await mailAlreadySignedUp(user);
        if(!user) {
            errorResponse(res, 500, 'Email does not exist');
            return ;
        }
        console.log(user);
        await sendForgotPasswordEmail(user, user.email);
        successResponse(res, `Send email to ${user.email}`);
    }catch (e) {
        errorResponse(res, 500, 'Something went wrong');
    }
}

/**
 * Checks the data and logs in the user and returns token
 */
async function loginUser(req, res) {
    let loginUser = JSON.parse(req.body);
    loginUser.email = loginUser.email.toLowerCase();
    let checkUser = await mailAlreadySignedUp(loginUser);
    if (!checkUser) {
        errorResponse(res, 500, 'Mail does not exist', 'email');
        return;
    }

    if (checkUser.authenticated !== 1) {
        errorResponse(res, 500, 'User not authenticated');
        return;
    }

    if (loginUser.password !== checkUser.password) {
        errorResponse(res, 500, 'Password is incorrect', 'password');
        return;
    }

    let token = await generateToken(50);
    let date = Date.now();
    let sql = `UPDATE EVENTILOPE.Users
               SET token="${token}",
                   lastLogin="${date}",
                   loggedIn="1"
               WHERE email="${checkUser.email}"`;

    await queryThis(sql);
    jsonResponse(res, { 'token': token });
}

/**
 * Verifies user with a given user and returns a token
 */
async function verifyUser(req, res) {
    let verifyUser = JSON.parse(req.body);
    verifyUser.email = verifyUser.email.toLowerCase();
    const user= await mailAlreadySignedUp(verifyUser);
    if(user.authenticated === 1) {
        errorResponse(res, 500, 'Already verified');
        return;
    }

    if (user === false) {
        errorResponse(res, 500, 'Mail does not exit', 'email');
        return;
    }

    if (user.password !== verifyUser.password) {
        console.log(user.password + ' ' + verifyUser.password);
        errorResponse(res, 500, 'Password not correct', 'password');
        return;
    }

    if(user.token !== verifyUser.token) {
        console.log(user.token + ' ' + verifyUser.token);
        errorResponse(res, 500, 'Token not correct', 'token');
        return;
    }

    let sql = `UPDATE EVENTILOPE.Users
               SET authenticated = true
               WHERE email = "${user.email}"`;

    await queryThis(sql);
    successResponse(res, 'Signed up');
}

async function createUserWithoutCompany(user, res) {
    user = await cleanUserData(user, res);
    if(!user) {
        return;
    }
    user.role = 'user';
    console.log(user);

    if (!user.createdUser) {
        createUser(user);
    } else {
        updateUser(user);
    }

    await sendAuthenticationEmail(user, user.email, user.token);
    successResponse(res, 'Successfully created user without company');
}

/**
 * Verifies the input data and sends the user a mail with a token to verify
 */
async function createUserWithCompany(user, res) {
    user = await cleanUserData(user, res);
    if(!user) {
        return;
    }
    console.log(user);

    let company = await cleanCompanyData(user, res);

    if(company === false) {
        return;
    }

    if(user.createOrJoinCompany === 'createCompany') {
        user.role = 'admin';
        if (!user.createdUser) {
            createUserAndCreateCompany(user, company);
        } else {
            updateUserAndCreateCompany(user, company);
        }
    }
    else {
        user.role = 'worker';
        if (!user.createdUser) {
            createUserAndJoinCompany(user, company);
        } else {
            updateUserAndJoinCompany(user, company);
        }
    }

    await sendAuthenticationEmail(user, user.email, user.token);
    successResponse(res, 'Successfully created user with company');
}

/**
 * Checks if a mail is in the database
 * @param checkUser user whos mail to check
 */
async function mailAlreadySignedUp(checkUser) {
    let users = await getAllUsers();

    for (let user of users) {
        if (user.email === checkUser.email) {
            return user;
        }
    }
    return false;
}

/**
 * Sets up the tables in the authentication database
 */


/**
 * Cleans all the user data
 * @param user the user to clean
 */
async function cleanUserData(user, res) {
    user.email = user.email.toLowerCase();

    if (!user.name || !user.email || !user.companyOrPrivate || !user.password) {
        errorResponse(res, 500, 'Fill out all fields');
        return false;
    }

    if (!(user.companyOrPrivate === 'private' || user.companyOrPrivate === 'company')) {
        errorResponse(res, 500, 'You need to choose company or private', 'companyOrPrivate');
        return false;
    }

    if (!user.email.includes('@')) {
        errorResponse(res, 500, 'Not a correct email', 'email');
        return false;
    }

    let checkUser = await mailAlreadySignedUp(user);
    if(checkUser !== false) {
        user.createdUser = checkUser;

        if(checkUser.authenticated) {
            errorResponse(res, 500, 'Mail already signed up', 'email');
            return false;
        }
    }

    if(checkUser === false) {
        user.userID = await generateToken(12);
    }else{
        user.userID = checkUser.userID;
    }

    user.token = await generateToken(6);

    user.name = user.name.replace(/\s+/g, ' ');
    return user;
}

async function cleanCompanyData(user, res) {
    let company = {
        companyOrPrivate: user.companyOrPrivate,
        createOrJoinCompany: user.createOrJoinCompany,
        companyName: user.companyName,
        companyID: user.companyID
    };

    if(!company.createOrJoinCompany) {
        successResponse(res,  'You have to choose to create or join company');
        return false;
    }

    if (company.createOrJoinCompany === 'createCompany' && !company.companyName) {
        errorResponse(res, 500, 'You have to give a company name', 'companyName');
        return false;
    }

    if (company.createOrJoinCompany === 'joinCompany' && !company.companyID) {
        errorResponse(res, 500, 'You have to give a company id', 'companyId');
        return false;
    }

    if(company.createOrJoinCompany === 'createCompany') {
        let checkCompany = await companyAlreadyCreated(company);

        if(checkCompany !== false) {
            company.createdCompany = checkCompany;

            if(checkCompany.authenticated) {
                errorResponse(res, 500, 'Company already created', 'companyName');
                return false;
            }
        }
    }else if(company.createOrJoinCompany === 'joinCompany') {
        let checkCompany = await companyAlreadyCreated(company);
        if(checkCompany === false) {
            errorResponse(res, 500, 'Company does not exist', 'companyID');
            return false;
        }
        await setCompanyUser(company, user);
    }

    return company;
}

/**
 * Updates the users email, name and role.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function changeUser(req, res) {
    let user = JSON.parse(req.body);
    await updateUser(user) ? successResponse(res, 'Updated user') :
        errorResponse(res, 500, 'Failed to update user');
}

/**
 * Send the authentication token via mail
 * @param user User to receive mail
 * @param receiver of the mail
 * @param token to send
 */
async function sendAuthenticationEmail(user, receiver, token) {
    await authorize().then(auth => {
        const subject = 'Please verify your email for Eventify';
        const message = `<h1>Hello ${user.name}!</h1>` +
            '<h2> Verify by clicking the link</h2>' +
            '<p>Go to the website below and input this token:</p>' +
            '<h2>' + token + '</h2>' +
            '<a href="http://localhost:3000/verifyEmail.html">' +
            'Click here to verify</a>' +
            '<br><br>Best regards' +
            '<br><b>Eventify team</b>';
        sendEmail(auth, receiver, subject, message)
            .then(id => console.log(`Message sent with ID: ${id}`))
            .catch(console.error);
    }).catch(console.error);
}