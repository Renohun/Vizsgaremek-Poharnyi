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
            method: 'POST',
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
    const value = await POSTreq('http://127.0.0.1:3000/api/sutiJelenlete');
    //console.log(value.message);
    //Ha be van jelentkezve
    if (value.message) {
        document.getElementById('regisztracio').setAttribute('hidden', '');
        document.getElementById('belepes').setAttribute('hidden', '');
        document.getElementById('sajatKoktelKeszites').removeAttribute('hidden');
        document.getElementById('dropdownMenu').removeAttribute('hidden');
        //blob:http://127.0.0.1:3000/c420e19f-6ac3-4d77-ab30-6d7bb123149d
        //blob:http://127.0.0.1:3000/9ec0786f-0748-4b20-99eb-f7841d0defc8
        const koktelKep = await POSTKepLekeres(`http://127.0.0.1:3000/api/Koktelok/KepLekeres`);
        document.getElementById('Profile').setAttribute('src', URL.createObjectURL(koktelKep));
    } else {
        document.getElementById('regisztracio').removeAttribute('hidden');
        document.getElementById('belepes').removeAttribute('hidden');
        document.getElementById('sajatKoktelKeszites').setAttribute('hidden', '');
        document.getElementById('dropdownMenu').setAttribute('hidden', '');
    }
});
