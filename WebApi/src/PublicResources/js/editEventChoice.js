

function goToCreateEditEvent() {
    let eventID = window.location.search;
    window.location.href='/createEditEvent.html/' + eventID;
}

function goToCreateSchedule() {
    let eventID = window.location.search;
    window.location.href='/createEditSchedule.html/' + eventID;
}

function goToInvites() {
    let eventID = window.location.search;
    window.location.href='/invites.html/' + eventID;
}

function goToDashboard() {
    let eventID = window.location.search;
    window.location.href='/dashboard.html/' + eventID;
}

function goToVenueCateringEntertainment() {
    let eventID = window.location.search;
    window.location.href='/venueCateringEntertainment.html/' + eventID;
}