function getUsers() {
    setLoading(true);
    const url = 'http://localhost:3000/auth/users/getUsers';
    fetch(url, {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(async function (data) {
        return await data.json();
    }).then(function (users) {
        for(let user of users) {
            printUser(user);
        }
        setLoading(false);
    });
}

getUsers();


function printUser(user) {
    let users = document.getElementById('usersContainer');

    let html = '' +
        '<form class="settings-user-container">\n' +
        '                    <div class="container-flex">\n' +
        '                        <div class="rounded-input-with-label">\n' +
        '                            <label>Name</label>\n' +
        `                            <input id="name-${user.userID}" value="${user.name}" type="text">\n` +
        '                        </div>\n' +
        '                        <div class="rounded-input-with-label">\n' +
        '                            <label>Email</label>\n' +
        `                            <input id="email-${user.userID}" value="${user.email}" type="text">\n` +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="container-flex">\n' +
        '                        <div class="rounded-select-with-label">\n' +
        '                            <label>Role</label>\n' +
        `                            <select id="role-${user.userID}">\n` +
        '                              <option value="user">User</option>\n' +
        '                              <option value="worker">Worker</option>\n' +
        '                              <option value="implPartner">Implementation Partner</option>\n';
    if(user.adminRole) {
        html += '<option value="admin">Admin</option>\n';
    }
    if(user.superAdminRole) {
        html += '<option value="superAdmin">Super admin</option>\n';
    }
    html +='                            </select>\n' +
        '                        </div>\n' +
        '                        <div class="rounded-input-with-label">\n ' +
        '                            <label>Company name</label>\n' +
        `                            <input readonly id="companyName-${user.userID}" value="${user.companyName}" type="text">\n` +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="container-flex" style="justify-content: end">\n' +
        `                        <button class="accent-button" onclick="submitUser('${user.userID}')" type="button">Update</button>\n` +
        '                    </div>\n' +
        '                </form>';

    html = html.replace(`value="${user.role}"`, `value="${user.role}" selected`);

    users.innerHTML += html;
}

async function submitUser(userID) {
    setLoading(true);
    let user = {
        name: document.getElementById('name-' + userID).value,
        role: document.getElementById('role-' + userID).value,
        email: document.getElementById('email-' + userID).value,
        userID: userID
    };
    console.log('Submit ' + user.email);
    const url = 'http://localhost:3000/auth/users/change';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify(user),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(async function (data) {
        setLoading(false);
        window.location.href = '/settings/users.html';
        return await data.json();
    });
}