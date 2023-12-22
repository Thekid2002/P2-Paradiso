import { getAllUsers } from '../../models/user.js';
import { generateToken } from './token.js';
import { queryThis } from '../../models/db.js';
import { successResponse } from '../../server.js';
import { authorize, sendEmail } from '../../controller/mail.js';
import { getCompanyAndUserFromUser } from '../../models/company.js';
export { verifyToken, logOutToken, sendForgotPasswordEmail };
/**
 * Verifies a given token
 * @param loginToken the token to verify
 */
async function verifyToken(req, loginToken) {
    let users = await getAllUsers();
    for (let user of users) {
        //Checking that the token is correct and that the user last login is less or equal to 24 hours ago
        let lastLogin= Number(user.lastLogin);
        //console.log(user.token + ' ' + loginToken);
        if (user.token === loginToken && lastLogin >= (Date.now()-86400000)) {
            //console.log('lastLogin ' + new Date(lastLogin) + ' and max login ' + new Date(Date.now()-86400000));
            let company = await getCompanyAndUserFromUser(user);
            company = company.pop();
            if(company) {
                user.companyName = company.companyName;
                user.companyID = company.companyID;
            }
            req.headers.authorization = user;
            return true;
        }
    }
    return false;
}

/**
 * Logs out a given token, so that the user has to login
 */
async function logOutToken(req, res) {
    let logOutToken = req.headers.authorization.token;
    let token = await generateToken(50);
    console.log('LogoutToken:' + logOutToken + ' token: ' + token);
    let sql = `UPDATE EVENTILOPE.Users
               SET token="${token}",
                   loggedIn="0"
               WHERE token = "${logOutToken}"`;
    await queryThis(sql);
    successResponse(res, 'Logged out');
}

/**
 * Send the password via mail
 * @param user User to receive mail
 * @param receiver of the mail
 * @param token to send
 */
async function sendForgotPasswordEmail(user, receiver) {
    await authorize().then(auth => {
        const subject = 'Forgot password from eventify';
        const message = `<h1>Hello ${user.name}!</h1>` +
            '<h2>You have requested your password</h2>' +
            `<p>Here it is "${user.password}"</p>` +
            '<br><br>Best regards' +
            '<br><b>Eventify team</b>';
        sendEmail(auth, receiver, subject, message)
            .then(id => console.log(`Message sent with ID: ${id}`))
            .catch(console.error);
    }).catch(console.error);
}