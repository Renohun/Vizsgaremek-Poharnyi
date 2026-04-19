async function POSTreq(url) {
    try {
        const data = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (data.ok) {
            return await data.json();
        } else {
            throw new Error('Hiba tortent a POST-nal');
        }
    } catch (err) {
        throw new Error(err);
    }
}

async function POSTKepLekeres(url) {
    try {
        const ertek = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'image/jpeg' }
        });
        if (ertek.ok) {
            return ertek.blob();
        } else {
            console.log('hiba');
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const value = await POSTreq('/api/sutiJelenlete');
    const response = await POSTreq('/api/jogosultsagEll');
    console.log(document.getElementById('adminPanelHref'));

    if (response.message == false) {
        document.getElementById('adminPanelHref').setAttribute('hidden', '');
    } else {
        document.getElementById('adminPanelHref').removeAttribute('hidden');
    }

    //console.log(value.message);
    //Ha be van jelentkezve
    if (value.message) {
        document.getElementById('regisztracio').setAttribute('hidden', '');
        document.getElementById('belepes').setAttribute('hidden', '');
        document.getElementById('sajatKoktelKeszites').removeAttribute('hidden');
        document.getElementById('dropdownMenu').removeAttribute('hidden');

        const koktelKep = await POSTKepLekeres(`/api/Koktelok/KepLekeres`);
        document.getElementsByClassName('profil')[0].setAttribute('src', URL.createObjectURL(koktelKep));
    } else {
        document.getElementById('regisztracio').removeAttribute('hidden');
        document.getElementById('belepes').removeAttribute('hidden');
        document.getElementById('sajatKoktelKeszites').setAttribute('hidden', '');
        document.getElementById('dropdownMenu').setAttribute('hidden', '');
    }
});
