function deleteActivity(activityID) {
    let eventID = window.location.search;
    eventID = eventID.split('=')[1];
    let url = 'http://localhost:3000/schedule/delete';
    setLoading(true);
    fetch(url, {
        mode: 'cors',
        method: 'DELETE',
        cache: 'default',
        body: JSON.stringify({ eventID, activityID }),
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
            document.getElementById('activityError').innerHTML = data.error;
            console.log(data.error);
            setLoading(false);
        }
    });
}

function getSchedule() {
    let url = 'http://localhost:3000/schedule/get/' + window.location.search;
    fetch(url, {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (schedule) {
        return schedule.json();
    }).then(function (schedule) {
        printSchedule(schedule);
    });
}

getSchedule();
async function addRow() {
    setLoading(true);
    let eventID = window.location.search;
    eventID = eventID.split('=')[1];
    let activity = document.getElementById('activity');
    let time = document.getElementById('time');
    let url = 'http://localhost:3000/schedule/add';
    await fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify({ activity: activity.value, time: time.value, eventID: eventID }),
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
            document.getElementById('activityError').innerHTML = data.error;
            console.log(data.error);
            setLoading(false);
        }
    });
}

function printSchedule(schedule) {
    console.log(schedule);
    let table = document.getElementById('scheduleTable');
    let text = '';
    for (let row of schedule) {
        text +=
        `<tr>
            <td>
                <select>
                <option value="null">None</option>`;
        for (let user of row.users) {
            if(user.userID === row.worker) {
                text +=  `<option selected value="${user.userID}">${user.name}</option>`;
            }else {
                text += `<option value="${user.userID}">${user.name}</option>`;
            }
        }
        text +=  `</select>
            </td>
            <td>${row.activity}</td>
            <td>${row.time}</td>
            <td>${row.completed}</td>
            <td>
                <button onclick="deleteActivity(${row.activityID})">Delete</button>
            </td>
        </tr>`;
    }
    table.innerHTML += text;
}
