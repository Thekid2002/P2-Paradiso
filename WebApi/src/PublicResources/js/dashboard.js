function goToBrowse() {
    window.location.href = '/browse.html';
}

async function getDashboard() {
    let eventID = window.location.search;
    if(eventID.includes('?id')) {
        console.log(eventID);
        const url = 'http://localhost:3000/dashboard/';
        await fetch(url + 'getDashboard/' + eventID, {
            mode: 'cors',
            method: 'GET',
            cache: 'default',
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then(async function (response) {
            return await response.json();
        }).then(async function (dashboard) {
            printDashboard(dashboard);
            console.log(dashboard.income);
        }).catch(function (err) {
            console.warn('Something went wrong.', err);
        });
    }
}
getDashboard();

function printDashboard(dashboard) {
    document.getElementById('eventTitle').innerHTML += dashboard.event.title;
    document.getElementById('participants').innerHTML += dashboard.participants.length;
    document.getElementById('eventImg').style.backgroundImage = `url("${dashboard.event.imageUrl}")`;
    document.getElementById('income').innerHTML += dashboard.income;
    document.getElementById('price').innerHTML += dashboard.event.price;
    document.getElementById('venue').innerHTML += dashboard.venue.name;
    document.getElementById('venuePrice').innerHTML += dashboard.venue.price;
    document.getElementById('catering').innerHTML += dashboard.catering.name;
    document.getElementById('cateringPrice').innerHTML += dashboard.catering.price;
    document.getElementById('entertainment').innerHTML += dashboard.entertainment.name;
    document.getElementById('entertainmentPrice').innerHTML += dashboard.entertainment.price;
    document.getElementById('total').innerHTML += (Number(dashboard.income) - (Number(dashboard.entertainment.price) +
        Number(dashboard.catering.price) + Number(dashboard.venue.price)));
    let table = document.getElementById('participantTable');
    let text = '';
    for (let participant of dashboard.participants) {
        text +=
            `<tr>
                <td>${participant.name}</td>
                <td>${participant.email}</td>
            </tr>`;
    }
    table.innerHTML += text;

}