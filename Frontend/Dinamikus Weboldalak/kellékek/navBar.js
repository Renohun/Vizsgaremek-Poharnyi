async function GETreq(url) {
    try {
        const data = await fetch(url, {
            method: 'GET',
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

async function GETKepLekeres(url) {
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
    const value = await GETreq('/api/sutiJelenlete');
    const response = await GETreq('/api/jogosultsagEll');

    if (response.message == false) {
        document.getElementsByClassName('adminPanelHref')[0].setAttribute('hidden', '');
        document.getElementsByClassName('adminPanelHref')[1].setAttribute('hidden', '');
    } else {
        document.getElementsByClassName('adminPanelHref')[0].removeAttribute('hidden');
        document.getElementsByClassName('adminPanelHref')[1].removeAttribute('hidden');
    }

    //console.log(value.message);
    //Ha be van jelentkezve
    if (value.message) {
        document.getElementById('regisztracio').setAttribute('hidden', '');
        document.getElementById('belepes').setAttribute('hidden', '');
        document.getElementById('sajatKoktelKeszites').removeAttribute('hidden');
        document.getElementById('dropdownMenuMini').children[0].removeAttribute('hidden');
        document.getElementById('dropdownMenuBig').children[0].removeAttribute('hidden');

        const koktelKep = await GETKepLekeres(`/api/NavBar/KepLekeres`);
        document.getElementsByClassName('profil')[0].setAttribute('src', URL.createObjectURL(koktelKep));
    } else {
        document.getElementById('regisztracio').removeAttribute('hidden');
        document.getElementById('belepes').removeAttribute('hidden');
        document.getElementById('sajatKoktelKeszites').setAttribute('hidden', '');
        document.getElementById('dropdownMenu').setAttribute('hidden', '');
    }
});
