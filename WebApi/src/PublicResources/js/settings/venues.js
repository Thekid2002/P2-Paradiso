async function getVenue() {
    fetch('http://localhost:3000/venCatEnt/getVenue', {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (venues) {
        return venues.json();
    }).then(function(venues) {
        console.log(venues);
        for (let venue of venues) {
            printVenue(venue);
        }
        printNewVenue();
    });
}
getVenue();

function printVenue(venue) {
    let venues = document.getElementById('venuesContainer');
    let html =
        `<form class="settings-user-container">\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Venue</label>\n
                   <input id="venueName-${venue.venueID}" value="${venue.name}" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n
                   <label>Venue ID</label>\n
                   <input id="venueID-${venue.venueID}" value="${venue.venueID}" type="text" readonly>\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Price</label>\n
                   <input id="venuePrice-${venue.venueID}" value="${venue.price}" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n 
                   <label>Location</label>\n
                   <input id="venueLocation-${venue.venueID}" value="${venue.location}" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Description</label>\n
                   <input id="venueDescription-${venue.venueID}" value="${venue.description}" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Image URL</label>\n
                   <input id="venueImageUrl-${venue.venueID}" value="${venue.imageUrl}" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex" style="justify-content: end">\n
               <button class="accent-button" onclick="changeVenue('${venue.venueID}')" type="button">Update</button>\n 
           </div>\n
       </form>`;

    venues.innerHTML += html;
}

function printNewVenue() {
    let venues = document.getElementById('venuesContainer');
    let html =
        `<form class="settings-user-container">\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Venue</label>\n
                   <input id="newVenueName" value="" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n
                   <label>Venue ID</label>\n
                   <input id="newVenueID" value="" type="text" readonly>\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Price</label>\n
                   <input id="newVenuePrice" value="" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n 
                   <label>Location</label>\n
                   <input id="newVenueLocation" value="" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Description</label>\n
                   <input id="newVenueDescription" value="" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Image URL</label>\n
                   <input id="newVenueImageUrl" value="" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex" style="justify-content: end">\n
               <button class="accent-button" onclick="newVenue()" type="button">Create</button>\n 
           </div>\n
       </form>`;

    venues.innerHTML += html;
}

async function changeVenue(venueID) {
    setLoading(true);
    let venue = {
        name: document.getElementById('venueName-' + venueID).value,
        price: document.getElementById('venuePrice-' + venueID).value,
        location: document.getElementById('venueLocation-' + venueID).value,
        description: document.getElementById('venueDescription-' + venueID).value,
        imageUrl: document.getElementById('venueImageUrl-' + venueID).value,
        venueID: venueID
    };

    const url = 'http://localhost:3000/venCatEnt/changeVenue';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(venue),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (data) {
        return data.json();
    }).then(function (data) {
        if(data.success) {
            setLoading(false);
            location.reload();
        }else{
            console.log(data.error);
            setLoading(false);
        }
    });
}


async function newVenue() {
    setLoading(true);
    let newVenue = {
        name: document.getElementById('newVenueName').value,
        price: document.getElementById('newVenuePrice').value,
        location: document.getElementById('newVenueLocation').value,
        description: document.getElementById('newVenueDescription').value,
        imageUrl: document.getElementById('newVenueImageUrl').value,
        venueID: document.getElementById('newVenueID').value
    };

    const url = 'http://localhost:3000/venCatEnt/newVenue';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(newVenue),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (data) {
        return data.json();
    }).then(function (data) {
        if(data.success) {
            setLoading(false);
            location.reload();
        }else{
            console.log(data.error);
            setLoading(false);
        }
    });
}
