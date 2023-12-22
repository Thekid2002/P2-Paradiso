import { deleteActivityByActivityAndEvent, getScheduleByEventId, insertActivity, updateActivity } from '../models/schedule.js';
import { getAllUsers, getAllUsersInCompany } from '../models/user.js';
import { errorResponse, jsonResponse, successResponse } from '../server.js';
import { getCompanyByEventID } from '../models/event.js';

export { getSchedule, createActivity, deleteActivity, checkSchedule };

async function getSchedule(res, role, companyID, eventID) {
    let schedule = await getScheduleByEventId(eventID);
    let users;

    switch (role) {
        case 'admin': case 'superAdmin':
            users = await getAllUsers();
            break;
        case 'implPartner':
            users = await getAllUsersInCompany(companyID);
            break;
        default :
            errorResponse(res, 500, 'Not authorized');
            return;

    }
    for (let activity of schedule) {
        activity.users = users;
    }

    jsonResponse(res, schedule);
}

async function checkSchedule(res, eventID, activityID, checked) {
    await updateActivity(eventID, activityID, checked) ? successResponse(res, 'Successfully updated activity') :
        errorResponse(res, 500, 'Failed to update activity');
}

async function createActivity(res, activity, time, eventID, role, companyID) {
    if(!activity || !time || !eventID) {
        errorResponse(res, 500, 'Need activity, time and eventID to create activity');
        return;
    }

    if(role !== 'admin' && role !== 'implPartner' && role !== 'superAdmin') {
        errorResponse(res, 500, 'Not authorized');
        return;
    }

    let company = await getCompanyByEventID(eventID);

    if((role === 'implPartner' || role === 'admin') && companyID !== company.companyID) {
        errorResponse(res, 500, 'Not authorized');
        return;
    }

    await insertActivity(activity, time, eventID) ?  successResponse(res, 'Successfully inserted activity') :
        errorResponse(res, 500, 'Failed to insert activity');
}

async function deleteActivity(res, activityID, eventID, role, companyID) {

    if(!activityID || !eventID) {
        errorResponse(res, 500, 'Need activityID and eventID to delete activity');
        return;
    }

    if(role !== 'admin' && role !== 'implPartner') {
        errorResponse(res, 500, 'Not authorized');
        return;
    }

    let company = await getCompanyByEventID(eventID);

    if(role === 'implPartner' && companyID !== company.companyID) {
        errorResponse(res, 500, 'Not authorized');
        return;
    }

    await deleteActivityByActivityAndEvent(activityID, eventID) ?
        successResponse(res, 'Successfully deleted activity') :
        errorResponse(res, 500, 'Failed to delete activity');
}