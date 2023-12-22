let pages = ['signup', 'createCompany', 'joinCompany', 'verify' ];
let activePage = 0;
let id = window.location.search;
if(id) {
    activePage = Number(id.split('=')[1]);
}

let createCompanySelect = document.getElementById('createCompanySelect');
if(createCompanySelect) {
    createCompanySelect.onchange = function () {
        goToPage(pages[2]);
    };
}

let joinCompanySelect = document.getElementById('joinCompanySelect');
if(joinCompanySelect) {
    joinCompanySelect.onchange = function () {
        goToPage(pages[1]);
    };
}

user = sessionStorage.getItem('user');
if(user) {
    user = JSON.parse(user);
    console.log(user);
}

function goToPage(page) {
    activePage = page;
    window.location.href = '/authentication/' + activePage + '.html';
}

async function fetchSignup(user, nextPage) {
    setLoading(true);
    let url = 'http://localhost:3000/auth/users/signup';
    await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(user)
    }).then(function(data) {
        return data.json();
    }).then(function (data) {
        if(data.success) {
            goToPage(nextPage);
            setLoading(false);
        }else{
            if(!data.errorType) {
                data.errorType='email';
            }
            document.getElementById(data.errorType + 'Error').innerHTML = data.error;
            console.log(data.error);
            setLoading(false);
        }
    });
}

function goToPreviousPage() {
    goToPage(pages[0]);
}

async function createUser() {
    let user = {};
    user.name = document.getElementById('name').value;
    user.companyOrPrivate = document.getElementById('companyOrPrivate').value;
    user.email = document.getElementById('email').value;
    user.password = document.getElementById('password').value;
    sessionStorage.setItem('user', JSON.stringify(user));
    if(user.companyOrPrivate === 'private') {
        fetchSignup(user, pages[3]);
    } else{
        fetchSignup(user, pages[1]);
    }
}

async function createCompany() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    user.createOrJoinCompany='createCompany';
    user.companyName=document.getElementById('companyName').value;
    sessionStorage.setItem('user', JSON.stringify(user));
    fetchSignup(user, pages[3]);
}

async function joinCompany() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    user.createOrJoinCompany='joinCompany';
    user.companyID=document.getElementById('companyID').value;
    fetchSignup(user, pages[3]);
}

async function verifyUser() {
    const url = 'http://localhost:3000/auth/users/verify';
    let user = {
        'email': document.getElementById('email').value,
        'password': document.getElementById('password').value,
        'token': document.getElementById('token').value
    };
    console.log(user);
    await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache:'default',
        body: JSON.stringify(user)
    }).then(function(data) {
        return data.json();
    }).then(function (data) {
        if(data.success) {
            window.location.href = '/authentication/login.html';
        }else{
            if(!data.errorType) {
                data.errorType='email';
            }
            document.getElementById(data.errorType + 'Error').innerHTML = data.error;
            console.log(data.error);
        }
    });
}