function goToBrowse() {
    window.location.href = '/browse.html';
}

async function participateInEvent() {
    let id = window.location.search;
    if(id) {
        id = id.replace('?id=', '');
        console.log(id);
        const url = 'http://localhost:3000/participation/participate';
        await fetch(url, {
            mode: 'cors',
            method: 'POST',
            cache: 'default',
            body: JSON.stringify(id),
            headers: {
                Authorization: localStorage.getItem('token')
            }
        });
    }
    location.reload();
}

async function stopParticipatingInEvent() {
    let id = window.location.search;
    if(id) {
        id = id.replace('?id=', '');
        console.log(id);
        const url = 'http://localhost:3000/participation/stopParticipating';
        await fetch(url, {
            mode: 'cors',
            method: 'POST',
            cache: 'default',
            body: JSON.stringify(id),
            headers: {
                Authorization: localStorage.getItem('token')
            }
        });
    }
    location.reload();
}

async function getEvent() {
    let id = window.location.search;
    if(id.includes('?id')) {
        console.log(id);
        const url = 'http://localhost:3000/event/';
        await fetch(url + 'getEvent/' + id, {
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

function printEvent(event) {
    document.getElementById('title').innerHTML += event.title;
    document.getElementById('price').innerHTML += event.price;
    document.getElementById('location').innerHTML += event.location;
    document.getElementById('description').innerHTML += event.description;
    event.startDateTime = event.startDateTime.replaceAll('-', '/');
    event.endDateTime = event.endDateTime.replaceAll('-', '/');
    event.startDateTime = event.startDateTime.replace('T', ' - ');
    event.endDateTime = event.endDateTime.replace('T', ' - ');
    document.getElementById('startDateTime').innerHTML += event.startDateTime;
    document.getElementById('endDateTime').innerHTML += event.endDateTime;
    document.getElementById('participants').innerHTML += event.participants;
    document.getElementById('eventImg').style.backgroundImage = `url("${event.imageUrl}")`;
}

async function getSeeMoreButtons() {
    let id = window.location.search;
    console.log(id);
    const url = 'http://localhost:3000/dialog/seeMoreButtons';
    await fetch(url + id, {
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
        document.getElementById('seeMoreButtons').innerHTML=buttons;
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
}

getSeeMoreButtons();