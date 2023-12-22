function getScripts(scripts) {
    scripts.forEach(url => fetchScript(url));
}

function fetchScript(url) {
    fetch('http://localhost:3000' + url, {
        mode: 'cors',
        method: 'GET',
        cache: 'default',
        headers: {
            Authorization : localStorage.getItem('token')
        }
    }).then(async function(response) {
        return await response.text();
    }).then(script => {
        const scriptEl = document.createElement('script');
        scriptEl.setAttribute('src', URL.createObjectURL(new Blob([script], { type: 'text/javascript' })));
        document.head.appendChild(scriptEl);
    });
}


