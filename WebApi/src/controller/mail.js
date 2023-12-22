import { google, Auth } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { authenticate } from '@google-cloud/local-auth';

export { sendEmail, authorize };

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'src/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'src/credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.promises.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.promises.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token
    });
    await fs.promises.writeFile(TOKEN_PATH, payload);
}
/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Sends an email message.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} to Email address of the receiver.
 * @param {string} subject Subject of the email.
 * @param {string} message Plain text message body of the email.
 * @return {Promise<string>} Message ID of the sent email.
 */
async function sendEmail(auth, to, subject, message) {
    const gmail = google.gmail({ version: 'v1', auth });
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        `To: ${to}`,
        `Subject: ${utf8Subject}`,
        'Content-Type: text/html; charset=utf-8',
        'from: paradisotestinfo@gmail.com',
        '',
        message
    ];
    const encodedMessage = Buffer.from(messageParts.join('\n')).toString('base64');
    const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage
        }
    });
    return res.data.id;
}

authorize();