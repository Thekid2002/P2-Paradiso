async function getBrowse() {
    let visibility = document.getElementById('privateOrPublic').value;
    let search = document.getElementById('search').value;
    let url = 'http://localhost:3000/browse/get';
    if(!search) {
        search = '';
    }
    if(!visibility) {
        visibility = '';
    }
    url += '/?search=' + search;
    url += '&visibility=' + visibility;
    fetch(url, {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (response) {
        return response.json();
    }).then(function (events) {
        printEvents(events);
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
}

getBrowse();

async function printEvents(events) {
    let body = '';
    for (let event of events) {
        event.startDateTime = event.startDateTime.replaceAll('-', '/');
        event.endDateTime = event.endDateTime.replaceAll('-', '/');
        event.startDateTime = event.startDateTime.replace('T', ' - ');
        event.endDateTime = event.endDateTime.replace('T', ' - ');
        let i = events.indexOf(event);
        body += `
            <div class="eventLine">
              <div class="eventImg" style="background-image: url('${event.imageUrl}')">
              </div>
              <div class="eventDescription">
                <h2 style="${event.invited ? 'color: var(--blue)': ''}" id="eventName${i}">${event.title}${event.invited ? ' - You are Invited!': ''}</h2>
                <p id="eventDescription${i}">${event.description}</p>
                <div class="eventData">
                  <a></a>
                  <i class="material-icons">location_on</i>
                  <p id="eventLocation">${event.location}</p>
                  <i class="material-icons">paid</i>
                  <p id="eventPrice">${event.price},-</p>
                  <i class="material-icons">schedule</i>
                  <p id="eventTime">${event.startDateTime}</p>
                  <i class="material-icons">domain</i>
                  <p id="eventCompany">${event.companyName}</p>
                </div>
                <div class="eventButtons">
                  ${event.buttons}
                </div>
              </div>
            </div>
          `;
    }

    document.getElementById('eventBody').innerHTML = body;
}