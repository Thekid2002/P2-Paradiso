import { startServer } from './app.js';
import { eventRouter } from './controller/event.js';
import { fileResponse, locationResponse } from './server.js';
import * as url from 'url';
import { dialogRouter } from './controller/dialog.js';
import { browseRouter } from './controller/browse.js';
import { participationRouter } from './controller/participation.js';
import { signupRouter } from './controller/signup.js';
import { authRouter } from './controller/authentication/authentication.js';
import { verifyToken } from './services/authentication/authentication.js';
import { companyRouter } from './controller/company.js';
import { scheduleRouter } from './controller/schedule.js';
import { dashboardRouter } from './controller/dashboard.js';
import { venCatEntRouter } from './controller/venueCateringEntertainment.js';

export { processReq };

startServer();

/**
 * Gets the user from the request by the token
 */
async function getUserFromRequest(req, res) {
    await verifyToken(req, req.headers.authorization);
    return true;
}

/**
 * Processes the request after the API receives it, works as primary router
 */
async function processReq(req, res) {
    console.log('\n' + req.method + ' ' + req.url);

    await getUserFromRequest(req, res);

    req.url = url.parse(req.url);

    let routeUrl = req.url.path.split('/')[1];
    req.url.path = req.url.path.split('/?')[0];

    req.url.path = req.url.path.replace('?', '');

    if(routeUrl === '') {
        locationResponse(res, '/browse.html');
        return;
    }

    if(routeUrl === 'event') {
        eventRouter(req, res);
        return;
    }

    if(routeUrl === 'auth') {
        authRouter(req, res);
        return;
    }

    if(routeUrl === 'dialog') {
        dialogRouter(req, res);
        return;
    }

    if(routeUrl === 'company') {
        companyRouter(req, res);
        return;
    }

    if(routeUrl === 'schedule') {
        scheduleRouter(req, res);
        return;
    }

    if(routeUrl === 'browse') {
        browseRouter(req, res);
        return;
    }

    if(routeUrl === 'participation') {
        participationRouter(req, res);
        return;
    }

    if(routeUrl === 'signup') {
        signupRouter(req, res);
        return;
    }

    if(routeUrl === 'dashboard') {
        dashboardRouter(req, res);
        return;
    }

    if(routeUrl === 'venCatEnt') {
        venCatEntRouter(req, res);
        return;
    }

    fileResponse(req.url.path, res);
}