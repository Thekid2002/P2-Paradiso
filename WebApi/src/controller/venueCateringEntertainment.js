import querystring from 'querystring';
import { changeVenue, getCatering, changeVenCatEnt, getVenCatEnt, changeCatering, changeEntertainment, getEntertainment,
    getVenues, newVenue, newCatering, newEntertainment } from '../services/venueCateringEntertainment.js';

export { venCatEntRouter };

async function venCatEntRouter(req, res) {
    let pathname = req.url.path.split('/venCatEnt')[1];

    if(pathname.includes('/getVenue')) {
        getVenues(res);
    }

    if(pathname.includes('/getCatering')) {
        getCatering(res);
    }

    if(pathname.includes('/getEntertainment')) {
        getEntertainment(res);
    }

    if(pathname.includes('/getVenCatEnt')) {
        let eventID = querystring.parse(req.url.query).id;
        getVenCatEnt(res, eventID);
    }

    if(pathname.includes('/changeVenCatEnt')) {
        let venCatEnt = JSON.parse(req.body);
        changeVenCatEnt(res, venCatEnt);
    }

    if (pathname.includes('/changeVenue')) {
        await changeVenue(req, res);
    }

    if (pathname.includes('/changeCatering')) {
        await changeCatering(req, res);
    }

    if (pathname.includes('/changeEntertainment')) {
        await changeEntertainment(req, res);
    }

    if (pathname.includes('/newVenue')) {
        await newVenue(req, res);
    }

    if (pathname.includes('/newCatering')) {
        await newCatering(req, res);
    }

    if (pathname.includes('/newEntertainment')) {
        await newEntertainment(req, res);
    }
}
