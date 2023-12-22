const form = document.getElementById('loginForm');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    loginUser();
});


function goToBrowse() {
    window.location.href = '/browse.html';
}

async function loginUser() {
    await setLoading(true);
    const url = 'http://localhost:3000/auth/';
    let user = {};
    user.email = document.getElementById('email').value;
    user.password = document.getElementById('password').value;
    await fetch(url + 'login', {
        'method': 'POST',
        'mode': 'cors',
        'body': JSON.stringify(user)
    }).then(function (data) {
        return data.json();
    }).then(function (data) {
        if (data.token) {
            localStorage.setItem('token', data.token);
            goToBrowse();
            setLoading(false);
        } else {
            if (!data.errorType) {
                data.errorType = 'email';
            }
            document.getElementById(data.errorType + 'Error').innerHTML = data.error;
            console.log(data.error);
            setLoading(false);
        }
    });
}