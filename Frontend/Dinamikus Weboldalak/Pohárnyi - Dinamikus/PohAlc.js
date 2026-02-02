async function GETfetch(url) {
    try {
        const data = await fetch(url);

        if (data.ok) {
            return await data.json();
        } else {
            throw new err('Hiba tortent a fetch-el');
        }
    } catch (err) {
        throw new Error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        //Jelvenyek avagy rendezesek lekerese
        const jelvenyek = await GETfetch('http://127.0.0.1:3000/api/Koktelok/Jelvenyek');
        console.log(jelvenyek);

        //koktelok lekeredezese
        const koktelok = await GETfetch('http://127.0.0.1:3000/api/Koktelok/lekeres');
        console.log(koktelok);
    })();
});
