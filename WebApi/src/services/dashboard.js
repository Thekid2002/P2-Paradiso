import { getEventById, getEventParticipantsByEventID } from '../models/event.js';
import { jsonResponse } from '../server.js';
import { selectVenCatEntByEventID } from '../models/venueCateringEntertainment.js';
import { selectVenueByVenueID } from '../models/venue.js';
import { selectCateringByCateringID } from '../models/catering.js';
import { selectEntertainmentByEntertainmentID } from '../models/entertainment.js';

export { getDashboardByEventID };

async function getDashboardByEventID(res, eventID) {
    let dashboard = {};
    dashboard.event = await getEventById(eventID);
    dashboard.participants = await getEventParticipantsByEventID(eventID);
    dashboard.income = dashboard.participants.length * dashboard.event.price;
    dashboard.venCatEnt = await selectVenCatEntByEventID(eventID);
    dashboard.venCatEnt = dashboard.venCatEnt[0];
    if(dashboard.venCatEnt) {
        dashboard.venue = await selectVenueByVenueID(dashboard.venCatEnt.venueID);
        dashboard.venue = dashboard.venue[0] ? dashboard.venue[0] : { name: 'none', price: '0' };
        dashboard.catering = await selectCateringByCateringID(dashboard.venCatEnt.cateringID);
        dashboard.catering = dashboard.catering[0] ? dashboard.catering[0] : { name: 'none', price: '0' };
        dashboard.entertainment = await selectEntertainmentByEntertainmentID(dashboard.venCatEnt.entertainmentID);
        dashboard.entertainment = dashboard.entertainment[0] ? dashboard.entertainment[0] : { name: 'none', price: '0' };
    }else {
        dashboard.venue = { name: 'none', price: '0' };
        dashboard.catering = { name: 'none', price: '0' };
        dashboard.entertainment = { name: 'none', price: '0' };
    }
    jsonResponse(res, dashboard);
}
