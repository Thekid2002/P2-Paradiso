async function getRouting() {
    setLoading(true);
    const url = 'http://localhost:3000/dialog/settingsRouting';
    fetch(url, {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(function (response) {
        return response.text();
    }).then(function (html) {
        setLoading(false);
        let search = window.location.href.split('/').pop().split('.html')[0];
        html = html.replace(`id="${search}"`, `id="${search}" style="background-color: var(--lightPink);`);
        let routing = document.getElementById('routing');
        routing.innerHTML = html;
    }).catch(function (err) {
        setLoading(false);
        console.warn('Something went wrong.', err);
    });
}

getRouting();