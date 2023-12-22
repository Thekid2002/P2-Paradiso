getData();
async function getData() {
    setLoading(true);
    await fetch('http://localhost:3000/venCatEnt/getVenCatEnt/' + window.location.search, {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (res) {
        return res.json();
    }).then(function (res) {
        res = res[0];
        console.log(res);
        if (res) {
            selectedVenue = res.venueID;
            selectedEntertainment = res.entertainmentID;
            selectedCatering = res.cateringID;
        }
        getVenCatEnt();
        setLoading(false);
    });
}
async function getVenCatEnt() {
    setLoading(true);
    await fetch('http://localhost:3000/venCatEnt/getVenue', {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (res) {
        return res.json();
    }).then(function (res) {
        console.log(res);
        printVenueCards(res);
        setLoading(false);
    });

    setLoading(true);
    await fetch('http://localhost:3000/venCatEnt/getEntertainment', {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (res) {
        return res.json();
    }).then(function (res) {
        console.log(res);
        printEntertainmentCards(res);
        setLoading(false);
    });

    setLoading(true);
    await fetch('http://localhost:3000/venCatEnt/getCatering', {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (res) {
        return res.json();
    }).then(function (res) {
        console.log(res);
        printCateringCards(res);
        setLoading(false);
    });
}
let selectedVenue = undefined;
let selectedCatering = undefined;
let selectedEntertainment = undefined;

function printVenueCards(cards, id) {
    let container = document.getElementById('venueContainer');
    let html = '';

    for (let card of cards) {
        card.id = card.venueID;
        html += `<div onclick="switchVenue(${card.id})" id="${'venue-' + card.id}" class="centered-large-image" style="background-image: url('${card.imageUrl}')">\n` +
            '        <div>\n' +
            `            <h2>${card.name}</h2>\n` +
            `            <p>${card.description}</p>\n` +
            `${card.location ? '<p>Location: ' + card.location + '</p>\n' : ''}` +
            `            <p>Price: ${card.price}</p>\n`;
        if(card.id === selectedVenue) {
            html += '<i class="material-icons selected">check</i>';
        }
        html +=
        '        </div>\n' +
            '    </div>';
        container.innerHTML = html;
    }
}

function printCateringCards(cards, id) {
    let container = document.getElementById('cateringContainer');
    let html = '';

    for (let card of cards) {
        card.id = card.cateringID;
        html += `<div onclick="switchCatering(${card.id})" id="${'catering-' + card.id}" class="centered-large-image" style="background-image: url('${card.imageUrl}')">\n` +
            '        <div>\n' +
            `            <h2>${card.name}</h2>\n` +
            `            <p>${card.description}</p>\n` +
            `${card.location ? '<p>Location: ' + card.location + '</p>\n' : ''}` +
            `            <p>Price: ${card.price}</p>\n`;
        if(card.id === selectedCatering) {
            html += '<i class="material-icons selected">check</i>';
        }
        html +=
            '        </div>\n' +
            '    </div>';
        container.innerHTML = html;
    }
}

function printEntertainmentCards(cards, id) {
    let container = document.getElementById('entertainmentContainer');
    let html = '';

    for (let card of cards) {
        card.id = card.entertainmentID;
        html += `<div onclick="switchEntertainment(${card.id})" id="${'entertainment-' + card.id}" class="centered-large-image" style="background-image: url('${card.imageUrl}')">\n` +
            '        <div>\n' +
            `            <h2>${card.name}</h2>\n` +
            `            <p>${card.description}</p>\n` +
            `${card.location ? '<p>Location: ' + card.location + '</p>\n' : ''}` +
            `            <p>Price: ${card.price}</p>\n`;
        if(card.id === selectedEntertainment) {
            html += '<i class="material-icons selected">check</i>';
        }
        html +=
            '        </div>\n' +
            '    </div>';
        container.innerHTML = html;
    }
}


async function switchVenue(venueID) {
    let container = document.getElementById('venueContainer');
    container.innerHTML = container.innerHTML.replace('<i class="material-icons selected">check</i>', '');
    if(venueID !== selectedVenue) {
        selectedVenue = venueID;
        let card = document.getElementById('venue-' + venueID);
        let html = card.innerHTML;
        html = html.replace('</div>', '<i class="material-icons selected">check</i>\n </div>');
        card.innerHTML = html;
    }else{
        selectedVenue = undefined;
    }
}

async function switchCatering(cateringID) {
    let container = document.getElementById('cateringContainer');
    container.innerHTML = container.innerHTML.replace('<i class="material-icons selected">check</i>', '');
    if(cateringID !== selectedCatering) {
        selectedCatering = cateringID;
        let card = document.getElementById('catering-' + cateringID);
        let html = card.innerHTML;
        html = html.replace('</div>', '<i class="material-icons selected">check</i>\n </div>');
        card.innerHTML = html;
    }else{
        selectedCatering = undefined;
    }
}

async function switchEntertainment(entertainmentID) {
    let container = document.getElementById('entertainmentContainer');
    container.innerHTML = container.innerHTML.replace('<i class="material-icons selected">check</i>', '');
    if(entertainmentID !== selectedEntertainment) {
        selectedEntertainment = entertainmentID;
        let card = document.getElementById('entertainment-' + entertainmentID);
        let html = card.innerHTML;
        html = html.replace('</div>', '<i class="material-icons selected">check</i>\n </div>');
        card.innerHTML = html;
    }else {
        selectedEntertainment = undefined;
    }
}

async function saveVenCatEnt() {
    setLoading(true);
    let eventID = window.location.search.split('=')[1];
    let venCatEnt = { eventID: eventID,
        selectedCatering: selectedCatering,
        selectedVenue: selectedVenue,
        selectedEntertainment };
    fetch('http://localhost:3000/venCatEnt/changeVenCatEnt', {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(venCatEnt),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (res) {
        return res.json();
    }).then(function(res) {
        console.log(res);
        setLoading(false);
        window.location.reload();
    });
}
