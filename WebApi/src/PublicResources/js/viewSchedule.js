function checkboxChange(activityID) {
    let url = 'http://localhost:3000/schedule/check/' + window.location.search;
    let checked = document.getElementById('complete-'+activityID);
    checked = checked.checked;
    let eventID = window.location.search.split('=')[1];
    fetch(url, {
        mode: 'cors',
        method: 'POST',
        cache: 'default',
        body: JSON.stringify({ eventID, activityID, checked }),
        headers: {
            Authorization: localStorage.getItem('token')
        }
    });
}

function getSchedule() {
    setLoading(true);
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
        setLoading(false);
    });
}

getSchedule();

function printSchedule(schedule) {
    console.log(schedule);
    let table = document.getElementById('scheduleTable');
    let text = '';
    for (let row of schedule) {
        console.log(row);
        text +=
            `<tr>
            <td>${row.activity}</td>
            <td>${row.time}</td>
            <td> <input id="complete-${row.activityID}" type="checkbox" ${row.completed ? 'checked' : ''} 
                    class="default-checkbox" onchange="checkboxChange('${row.activityID}')"></td>
        </tr>`;
    }
    table.innerHTML += text;
}