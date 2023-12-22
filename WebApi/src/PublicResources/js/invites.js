function removeInvitee(userID) {
    let eventID = window.location.search;
    eventID = eventID.split('=')[1];
    let url = 'http://localhost:3000/participation/unInvite';
    setLoading(true);
    fetch(url, {
        mode: 'cors',
        method: 'DELETE',
        cache: 'default',
        body: JSON.stringify({ eventID, userID }),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function(res) {
        return res.json();
    }).then(function (data) {
        if(data.success) {
            setLoading(false);
            location.reload();
        }else{
            document.getElementById('emailError').innerHTML = data.error;
            console.log(data.error);
            setLoading(false);
        }
    });
}

function getInvites() {
    let url = 'http://localhost:3000/participation/getInvites/' + window.location.search;
    fetch(url, {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (invitees) {
        return invitees.json();
    }).then(function (invitees) {
        printInvitees(invitees);
    });
}

getInvites();
async function addRow() {
    setLoading(true);
    let eventID = window.location.search;
    eventID = eventID.split('=')[1];
    let email = document.getElementById('email').value;
    let url = 'http://localhost:3000/participation/invite';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify({ email: email, eventID: eventID }),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function(res) {
        return res.json();
    }).then(function (data) {
        if(data.success) {
            setLoading(false);
            location.reload();
        }else{
            document.getElementById('emailError').innerHTML = data.error;
            console.log(data.error);
            setLoading(false);
        }
    });
}

function printInvitees(invitees) {
    console.log(invitees);
    let table = document.getElementById('inviteesTable');
    let text = '';
    for (let user of invitees) {
        text +=
            `<tr>
            <td>${user.userID}</td>
            <td>${user.email}</td>
            <td>${user.participates ? 'yes' : 'no'}</td>
            <td>${user.authenticated ? 'yes' : 'no'}</td>
            <td>
                <button onclick="removeInvitee('${user.userID}')">Delete</button>
            </td>
        </tr>`;
    }
    table.innerHTML += text;
}
