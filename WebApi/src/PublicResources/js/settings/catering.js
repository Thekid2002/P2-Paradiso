async function getCatering() {
    fetch('http://localhost:3000/venCatEnt/getCatering', {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (caterings) {
        return caterings.json();
    }).then(function(caterings) {
        console.log(caterings);
        for (let catering of caterings) {
            printCatering(catering);
        }
        printNewCatering();
    });
}
getCatering();

function printCatering(catering) {
    let caterings = document.getElementById('cateringsContainer');
    let html =
        `<form class="settings-user-container">\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Catering</label>\n
                   <input id="cateringName-${catering.cateringID}" value="${catering.name}" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n
                   <label>Catering ID</label>\n
                   <input id="cateringID-${catering.cateringID}" value="${catering.cateringID}" type="text" readonly>\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Price</label>\n
                   <input id="cateringPrice-${catering.cateringID}" value="${catering.price}" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n 
                   <label>Image URL</label>\n
                   <input id="cateringImageUrl-${catering.cateringID}" value="${catering.imageUrl}" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Description</label>\n
                   <input id="cateringDescription-${catering.cateringID}" value="${catering.description}" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex" style="justify-content: end">\n
               <button class="accent-button" onclick="changeCatering('${catering.cateringID}')" type="button">Update</button>\n 
           </div>\n
       </form>`;

    caterings.innerHTML += html;
}

function printNewCatering() {
    let caterings = document.getElementById('cateringsContainer');
    let html =
        `<form class="settings-user-container">\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Catering</label>\n
                   <input id="newCateringName" value="" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n
                   <label>Catering ID</label>\n
                   <input id="newCateringID" value="" type="text" readonly>\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Price</label>\n
                   <input id="newCateringPrice" value="" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Description</label>\n
                   <input id="newCateringDescription" value="" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Image URL</label>\n
                   <input id="newCateringImageUrl" value="" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex" style="justify-content: end">\n
               <button class="accent-button" onclick="newCatering()" type="button">Create</button>\n 
           </div>\n
       </form>`;

    caterings.innerHTML += html;
}

async function changeCatering(cateringID) {
    setLoading(true);
    let catering = {
        name: document.getElementById('cateringName-' + cateringID).value,
        price: document.getElementById('cateringPrice-' + cateringID).value,
        description: document.getElementById('cateringDescription-' + cateringID).value,
        imageUrl: document.getElementById('cateringImageUrl-' + cateringID).value,
        cateringID: cateringID
    };

    const url = 'http://localhost:3000/venCatEnt/changeCatering';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(catering),
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


async function newCatering() {
    setLoading(true);
    let newCatering = {
        name: document.getElementById('newCateringName').value,
        price: document.getElementById('newCateringPrice').value,
        description: document.getElementById('newCateringDescription').value,
        imageUrl: document.getElementById('newCateringImageUrl').value,
        venueID: document.getElementById('newCateringID').value
    };

    const url = 'http://localhost:3000/venCatEnt/newCatering';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(newCatering),
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