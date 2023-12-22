import { errorResponse, successResponse } from '../server.js';
import { deleteEvent, getEventById, insertEvent, updateEvent } from '../models/event.js';

export { removeEvent, editEvent, newEvent, cleanEventData };

/**
 * Updates a given event with the new data
 */
async function editEvent(req, res) {
    let event = JSON.parse(req.body);
    if (!await cleanEventData(res, event)) {
        return;
    }
    let checkEvent = await getEventById(event.eventID);

    if(checkEvent.companyID !== req.headers.authorization.companyID && req.headers.authorization.role !== 'superAdmin') {
        errorResponse(res, 500, 'Not authorized');
        return;
    }

    await updateEvent(event) ? successResponse(res, 'Updated event') :
        errorResponse(res, 500, 'Could not update event');
}

/**
 * Creates a new event with the given data
 */
async function newEvent(req, res) {
    let event = JSON.parse(req.body);
    console.log(event);
    if (!await cleanEventData(res, event)) {
        return;
    }
    await insertEvent(event, req.headers.authorization.companyID) ? successResponse(res, 'Created event') :
        errorResponse(res, 500, 'Could not create event');
}

async function cleanEventData (res, event) {
    let letters = /^[0-9a-zA-ZåÅæÆøØ#/>!=?'(). ]+$/;
    if (!event.title || !event.title.trim().match(letters)) {
        errorResponse(res, 500, 'Fill out all fields', 'title');
        return false;
    }

    if (!event.price || isNaN(event.price) || !event.price.match(letters)) {
        errorResponse(res, 500, 'Price must be a number', 'price');
        return false;
    }

    if (!event.location || !event.location.trim().match(letters)) {
        errorResponse(res, 500, 'Fill out all fields', 'location');
        return false;
    }

    if (!event.description || !event.description.trim().match(letters)) {
        errorResponse(res, 500, 'Fill out all fields', 'description');
        return false;
    }

    if (!event.startDateTime) {
        errorResponse(res, 500, 'Invalid start time', 'startDateTime');
        return false;
    }

    if (event.visibility !== 'public' && event.visibility !== 'private') {
        errorResponse(res, 500, 'Event must be either private or public', 'visibility');
        return false;
    }

    if (event.endDateTime && event.startDateTime >= event.endDateTime) {
        errorResponse(res, 500, 'Invalid end time. Time must be after start time', 'endDateTime');
        return false;
    }

    return true;
}

/**
 * Deletes an event with a given id
 */
async function removeEvent(req, res) {
    let event = { eventID: JSON.parse(req.body) };

    let checkEvent = await getEventById(event.eventID);

    if(checkEvent.companyID !== req.headers.authorization.companyID && req.headers.authorization.role !== 'superAdmin') {
        errorResponse(res, 500, 'Not authorized');
        return;
    }

    await deleteEvent(event) ? successResponse(res, 'Deleted event') :
        errorResponse(res, 500, 'Could not delete event');
}

