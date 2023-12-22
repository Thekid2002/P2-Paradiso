import { readFile } from '../server.js';
import { getAllEvents, getEventsByCompanyInvitedOrPublic, getEventsWhere } from '../models/event.js';

export { getBrowse };

async function getBrowse(role, search, companyID, visibility, userID) {
    let events;
    switch (role) {
        case 'superAdmin':
            events = await getAllEvents(userID);
            break;
        case 'admin':
        case 'implPartner':
        case 'worker':
            events = await getEventsByCompanyInvitedOrPublic(companyID, userID);
            break;
        case 'user':
            events = await getEventsByCompanyInvitedOrPublic('nullll', userID);
            break;
        default:
            events = await getEventsWhere('*', 'visibility="public"');
            break;
    }
    search = search.toLowerCase();
    events = events.filter(function (event) {
        return event.title.toLowerCase().includes(search) || event.price.toLowerCase().includes(search) ||
            event.eventID.includes(search) || event.location.toLowerCase().includes(search) || event.startDateTime.includes(search) ||
            event.companyID.includes(search) || event.companyName.toLowerCase().includes(search);
    });
    if (visibility === 'public' || visibility === 'private') {
        events = events.filter(function (event) {
            return event.visibility === visibility;
        });
    }
    if (visibility === 'invited') {
        events = events.filter(function (event) {
            return event.invited;
        });
    }
    await addBrowseButtons(role, events, companyID);
    return events;
}

/**
 * Adds the buttons for browse view
 */
async function addBrowseButtons(role, events, companyID) {
    if(!events) {
        return Error;
    }
    let adminButtons = await readFile('/browseButtons/admin-buttons.html');
    let workerButtons = await readFile('/browseButtons/worker-buttons.html');
    let defaultButtons = await readFile('/browseButtons/default-buttons.html');
    switch (role) {
        case 'superAdmin':
            await events.forEach(function (event) {
                event.buttons = adminButtons.replaceAll('${event.id}', event.eventID);
            });
            break;
        case 'admin':
        case 'implPartner':
            await events.forEach(function (event) {
                if(event.companyID === companyID) {
                    event.buttons = adminButtons.replaceAll('${event.id}', event.eventID);
                }else{
                    event.buttons = defaultButtons.replaceAll('${event.id}', event.eventID);
                }
            });
            break;
        case 'worker':
            await events.forEach(function (event) {
                event.buttons = workerButtons.replaceAll('${event.id}', event.eventID);
            });
            break;
        default:
            await events.forEach(function (event) {
                event.buttons = defaultButtons.replaceAll('${event.id}', event.eventID);
            });
            break;
    }
    return events;
}