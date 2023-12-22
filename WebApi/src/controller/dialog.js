import { checkUserParticipation } from '../services/participation.js';
import { errorResponse, fileResponse } from '../server.js';
import querystring from 'querystring';

export { dialogRouter };

async function dialogRouter(req, res) {
    let pathname = req.url.path.split('/dialog')[1];

    if(pathname.includes('/header')) {
        switch (req.headers.authorization.role) {
            default:
                fileResponse('/header/default-header.html', res);
                break;
            case 'user':
                fileResponse('/header/user-header.html', res);
                break;
            case 'worker':
                fileResponse('/header/worker-header.html', res);
                break;
            case 'implPartner':
                fileResponse('/header/implPartner-header.html', res);
                break;
            case 'superAdmin':
            case 'admin':
                fileResponse('/header/admin-header.html', res);
                break;
        }
    }

    if(pathname.includes('/settingsRouting')) {
        switch (req.headers.authorization.role) {
            case 'implPartner':
                fileResponse('/settings-routing/implPartner-settings.html', res);
                break;
            case 'admin':
            case 'superAdmin':
                fileResponse('/settings-routing/admin-settings.html', res);
                break;
            default:
                errorResponse(res, 500, 'Not authorized');
                break;
        }
    }

    if(pathname.includes('/createEditEventButtons')) {
        let isEdit = JSON.parse(req.body);
        if(isEdit) {
            fileResponse('/createEditEventButtons/editButtons.html', res);
        }
        else{
            fileResponse('/createEditEventButtons/createButtons.html', res);
        }
    }

    if (pathname.includes('/seeMoreButtons')) {
        if (!req.headers.authorization.userID) {
            console.log('not logged in buttons');
            fileResponse('/seeMoreButtons/missing-login-buttons.html', res);
            return;
        }
        if (await checkUserParticipation(querystring.parse(req.url.query).id, req.headers.authorization.userID)) {
            console.log('already participating buttons');
            fileResponse('/seeMoreButtons/participating-buttons.html', res);
            return;
        }
        console.log('Default buttons');
        fileResponse('/seeMoreButtons/default-buttons.html', res);

    }


}