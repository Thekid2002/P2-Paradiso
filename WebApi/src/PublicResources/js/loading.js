async function setLoading(loading) {
    let loadingElement = document.getElementById('loading');
    console.log(loadingElement);
    if(!loadingElement) {
        loadingElement = await document.createElement('div');
        loadingElement.innerHTML = '<div class="spinner"></div>';
        loadingElement.id = 'loading';
        loadingElement.className = 'loading';
        document.body.append(loadingElement);
    }
    console.log(loadingElement);
    if (loading) {
        loadingElement.style.display = 'block';
    } else {
        loadingElement.style.display = 'none';
    }
}