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

//Strat: ket function les
//Egyik: az api lekerest intezi, apinak odaadjuk a szuresi paramatereket - ez a vegpont egy teljesen uj lesz - a func vegen fogjuk meghivni a masik functiot
//Masik: ez parameterul kapja az elozo function visszateresi erteket - ami a szurt kokteleok lesznek - majd ez alapjan fogja oket rendeleni, de ezzel mar nem lesz gond
//Hetvege a hataridom, addigra illene vegeznem, nem kene ezt mar tovabb huznom

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
