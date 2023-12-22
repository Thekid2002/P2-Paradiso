async function getEntertainment() {
    fetch('http://localhost:3000/venCatEnt/getEntertainment', {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (entertainments) {
        return entertainments.json();
    }).then(function(entertainments) {
        console.log(entertainments);
        for (let entertainment of entertainments) {
            printEntertainment(entertainment);
        }
        printNewEntertainment();
    });
}
getEntertainment();

function printEntertainment(entertainment) {
    let entertainments = document.getElementById('entertainmentContainer');
    let html =
        `<form class="settings-user-container">\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Entertainment</label>\n
                   <input id="entertainmentName-${entertainment.entertainmentID}" value="${entertainment.name}" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n
                   <label>Entertainment ID</label>\n
                   <input id="entertainmentID-${entertainment.entertainmentID}" value="${entertainment.entertainmentID}" type="text" readonly>\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Price</label>\n
                   <input id="entertainmentPrice-${entertainment.entertainmentID}" value="${entertainment.price}" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n 
                   <label>Image URL</label>\n
                   <input id="entertainmentImageUrl-${entertainment.entertainmentID}" value="${entertainment.imageUrl}" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Description</label>\n
                   <input id="entertainmentDescription-${entertainment.entertainmentID}" value="${entertainment.description}" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex" style="justify-content: end">\n
               <button class="accent-button" onclick="changeEntertainment('${entertainment.entertainmentID}')" type="button">Update</button>\n 
           </div>\n
       </form>`;

    entertainments.innerHTML += html;
}

function printNewEntertainment() {
    let entertainments = document.getElementById('entertainmentContainer');
    let html =
        `<form class="settings-user-container">\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Entertainment</label>\n
                   <input id="newEntertainmentName" value="" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n
                   <label>Entertainment ID</label>\n
                   <input id="newEntertainmentID" value="" type="text" readonly>\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Price</label>\n
                   <input id="newEntertainmentPrice" value="" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Description</label>\n
                   <input id="newEntertainmentDescription" value="" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Image URL</label>\n
                   <input id="newEntertainmentImageUrl" value="" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex" style="justify-content: end">\n
               <button class="accent-button" onclick="newEntertainment()" type="button">Create</button>\n 
           </div>\n
       </form>`;

    entertainments.innerHTML += html;
}

async function changeEntertainment(entertainmentID) {
    setLoading(true);
    let entertainment = {
        name: document.getElementById('entertainmentName-' + entertainmentID).value,
        price: document.getElementById('entertainmentPrice-' + entertainmentID).value,
        description: document.getElementById('entertainmentDescription-' + entertainmentID).value,
        imageUrl: document.getElementById('entertainmentImageUrl-' + entertainmentID).value,
        entertainmentID: entertainmentID
    };

    const url = 'http://localhost:3000/venCatEnt/changeEntertainment';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(entertainment),
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


async function newEntertainment() {
    setLoading(true);
    let newEntertainment = {
        name: document.getElementById('newEntertainmentName').value,
        price: document.getElementById('newEntertainmentPrice').value,
        description: document.getElementById('newEntertainmentDescription').value,
        imageUrl: document.getElementById('newEntertainmentImageUrl').value,
        venueID: document.getElementById('newEntertainmentID').value
    };

    const url = 'http://localhost:3000/venCatEnt/newEntertainment';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(newEntertainment),
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