function goToBrowse() {
    window.location.href = '/browse.html';
}

async function getEvent() {
    let eventID = window.location.search;
    if(eventID.includes('?id')) {
        console.log(eventID);
        const url = 'http://localhost:3000/event/';
        await fetch(url + 'getEvent/' + eventID, {
            mode: 'cors',
            method: 'GET',
            cache: 'default',
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then(async function (response) {
            return await response.json();
        }).then(async function (event) {
            printEvent(event);
        }).catch(function (err) {
            console.warn('Something went wrong.', err);
        });
    }
}
getEvent();

async function getButtons() {
    let id = window.location.search;
    console.log(id);
    const url = 'http://localhost:3000/dialog/createEditEventButtons';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(id.includes('?id')),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(async function (response) {
        return await response.text();
    }).then(async function (buttons) {
        document.getElementById('createEditEventButtons').innerHTML=buttons;
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
}
getButtons();

function printEvent(event) {
    document.getElementById('title').value = event.title;
    document.getElementById('description').value = event.description;
    document.getElementById('price').value = event.price;
    document.getElementById('location').value = event.location;
    document.getElementById('startDateTime').value = event.startDateTime;
    document.getElementById('endDateTime').value = event.endDateTime;
    document.getElementById('url').value = event.imageUrl;
    let visibilityDropdown = document.getElementById('visibility');
    for (let option of visibilityDropdown.options) {
        if(option.value === event.visibility) {
            option.selected = true;
        }
    }
}

async function saveEvent() {
    let id = window.location.search;
    const url = 'http://localhost:3000/event/updateEvent';
    let event = {};
    event.title = document.getElementById('title').value;
    event.description = document.getElementById('description').value;
    event.price =  document.getElementById('price').value;
    event.location = document.getElementById('location').value;
    event.startDateTime = document.getElementById('startDateTime').value;
    event.endDateTime = document.getElementById('endDateTime').value;
    event.visibility = document.getElementById('visibility').value;
    event.imageUrl = document.getElementById('url').value;
    event.eventID = id.split('=')[1];
    fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(event),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function(data) {
        return data.json();
    }).then(function(data) {
        console.log(data);
        if (!data.error) {
            goToBrowse();
        }
        else {
            if(!data.errorType) {
                data.errorType='title';
            }
            document.getElementById(data.errorType + 'Error').innerHTML = data.error;
            console.log(data.error);
        }
    });
}


async function newEvent() {
    const url = 'http://localhost:3000/event/createEvent';
    let event = {};
    event.title = document.getElementById('title').value;
    event.description = document.getElementById('description').value;
    event.price = document.getElementById('price').value;
    event.location = document.getElementById('location').value;
    event.startDateTime = document.getElementById('startDateTime').value;
    event.endDateTime = document.getElementById('endDateTime').value;
    event.visibility = document.getElementById('visibility').value;
    event.imageUrl = document.getElementById('url').value;
    console.log(event);
    fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(event),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (data) {
        return data.json();
    }).then(function (data) {
        console.log(data);
        if (!data.error) {
            goToBrowse();
        } else {
            if (!data.errorType) {
                data.errorType = 'title';
            }
            document.getElementById(data.errorType + 'Error').innerHTML = data.error;
            console.log(data.error);
        }
    });
}

async function removeEvent() {
    let id = window.location.search;
    id = id.split('=')[1];
    const url = 'http://localhost:3000/event/deleteEvent/';
    fetch(url + id, {
        mode: 'cors',
        method: 'DELETE',
        cache: 'default',
        body: JSON.stringify(id),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function(res) {
        return res.text();
    }.then(function (res) {
        if (res.success) {
            goToBrowse();
        } else {
            console.log(res);
        }
    }));
}
