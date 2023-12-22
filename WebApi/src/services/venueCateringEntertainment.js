import { errorResponse, jsonResponse, successResponse } from '../server.js';
import { insertVenCatEnt, selectVenCatEntByEventID, updateVenCatEnt } from '../models/venueCateringEntertainment.js';
import { insertVenueData, selectAllVenues, updateVenue } from '../models/venue.js';
import { insertEntertainmentData, selectAllEntertainment, updateEntertainment } from '../models/entertainment.js';
import { insertCateringData, selectAllCatering, updateCatering } from '../models/catering.js';

export { getVenues, getEntertainment, getCatering, changeVenue, changeVenCatEnt, getVenCatEnt, changeCatering, changeEntertainment,
    newVenue, newCatering, newEntertainment };

async function getVenues(res) {
    jsonResponse(res, await selectAllVenues());
}

async function getEntertainment(res) {
    jsonResponse(res, await selectAllEntertainment());
}

async function getCatering(res) {
    jsonResponse(res, await selectAllCatering());
}

async function changeVenCatEnt(res, venCatEnt) {
    let prevVenCatEnt = await selectVenCatEntByEventID(venCatEnt.eventID);
    if(prevVenCatEnt.length) {
        await updateVenCatEnt(venCatEnt) ? successResponse(res, 'Successfully updated venCatEnt') :
            errorResponse(res, 500, 'Failed to update venCatEnt');
        return;
    }else {
        await insertVenCatEnt(venCatEnt) ? successResponse(res, 'Successfully added venCatEnt') :
            errorResponse(res, 500, 'Failed to add venCatEnt');
    }
}

async function getVenCatEnt(res, eventID) {
    jsonResponse(res, await selectVenCatEntByEventID(eventID));
}

async function changeVenue(req, res) {
    let venue = JSON.parse(req.body);
    await updateVenue(venue) ? successResponse(res, 'Updated venue') :
        errorResponse(res, 500, 'Failed to update venue');
}

async function changeCatering(req, res) {
    let catering = JSON.parse(req.body);
    await updateCatering(catering) ? successResponse(res, 'Updated catering') :
        errorResponse(res, 500, 'Failed to update catering');
}

async function changeEntertainment(req, res) {
    let entertainment = JSON.parse(req.body);
    await updateEntertainment(entertainment) ? successResponse(res, 'Updated entertainment') :
        errorResponse(res, 500, 'Failed to update entertainment');
}

async function newVenue(req, res) {
    let newVenue = JSON.parse(req.body);
    await insertVenueData(newVenue) ? successResponse(res, 'Created new venue') :
        errorResponse(res, 500, 'Failed to create new venue');
}

async function newCatering(req, res) {
    let newCatering = JSON.parse(req.body);
    await insertCateringData(newCatering) ? successResponse(res, 'Created new catering') :
        errorResponse(res, 500, 'Failed to create new catering');
}

async function newEntertainment(req, res) {
    let newEntertainment = JSON.parse(req.body);
    await insertEntertainmentData(newEntertainment) ? successResponse(res, 'Created new entertainment') :
        errorResponse(res, 500, 'Failed to create new entertainment');
}
