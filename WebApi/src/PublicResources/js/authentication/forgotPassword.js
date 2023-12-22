
function goToLogin() {
    window.location.href = '/authentication/login.html';
}

async function forgotPassword() {
    setLoading(true);
    let user = {
        'email': document.getElementById('email').value
    };
    const url = 'http://localhost:3000/auth/forgotPassword';
    await fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(user)
    }).then(function(data) {
        return data.json();
    }).then(function (data) {
        if(data.success) {
            goToLogin();
            setLoading(false);
        }else{
            document.getElementById('emailError').innerHTML = data.error;
            console.log(data.error);
            setLoading(false);
        }
    });
}
