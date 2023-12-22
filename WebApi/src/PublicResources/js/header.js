function getHeader() {
    setLoading(true);
    const url = 'http://localhost:3000/dialog/header';
    fetch(url, { mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        } }).then(function (response) {
        return response.text();
    }).then(function (html) {
        document.getElementById('header').innerHTML = html;
        setLoading(false);
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
        setLoading(false);
    });
}

getHeader();

function goToBrowse() {
    window.location.href = '/browse.html';
}

async function logOut() {
    const url = 'http://localhost:3000/auth/logout';
    fetch(url, {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function () {
        goToBrowse();
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
}