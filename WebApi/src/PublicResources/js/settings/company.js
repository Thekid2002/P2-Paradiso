function getCompany() {
    const url = 'http://localhost:3000/company/get';
    setLoading(true);
    fetch(url, {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        body: JSON.stringify(),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (companies) {
        return companies.json();
    }).then(function (companies) {
        for(let company of companies) {
            printCompany(company);
        }
        setLoading(false);
    });
}
getCompany();

function printCompany(company) {
    let companies = document.getElementById('companyContainer');
    let html =
        `<form class="settings-user-container">\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Company name</label>\n
                   <input id="companyName-${company.CompanyID}" value="${company.companyName}" type="text">\n 
               </div>\n
               <div class="rounded-input-with-label">\n
                   <label>Company ID</label>\n
                   <input id="companyID-${company.CompanyID}" value="${company.CompanyID}" type="text" readonly>\n 
               </div>\n
           </div>\n
           <div class="container-flex">\n
               <div class="rounded-input-with-label">\n
                   <label>Authenticated</label>\n
                   <input id="authenticated-${company.CompanyID}" value="${company.authenticated}" type="text" readonly>\n 
               </div>\n
               <div class="rounded-input-with-label">\n 
                   <label>Company editor ID</label>\n
                   <input id="companyEditorID-${company.CompanyID}" value="${company.CompanyEditorID}" type="text">\n 
               </div>\n
           </div>\n
           <div class="container-flex" style="justify-content: end">\n
               <button class="accent-button" onclick="changeCompany('${company.CompanyID}')" type="button">Update</button>\n 
           </div>\n
       </form>`;

    companies.innerHTML += html;
}

async function changeCompany(companyID) {
    setLoading(true);
    let company = {
        companyName: document.getElementById('companyName-' + companyID).value,
        authenticated: document.getElementById('authenticated-' + companyID).value,
        companyEditorID: document.getElementById('companyEditorID-' + companyID).value,
        companyID: companyID
    };

    const url = 'http://localhost:3000/company/change';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(company),
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