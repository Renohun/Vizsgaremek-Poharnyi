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

async function POSTfetch(url, obj) {
    try {
        const data = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        });

        if (data.ok) {
            return await data.json();
        } else {
            throw new Error('Hiba tortent a POST fetchnel');
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
        console.log(jelvenyek.data);

        const erossegSelect = document.getElementById('Erősség');
        for (let i = 0; i < jelvenyek.data.erosseg.length; i++) {
            let optionTag = document.createElement('option');
            optionTag.innerText = jelvenyek.data.erosseg[i].JelvényNeve;
            erossegSelect.appendChild(optionTag);
        }

        const koktelIzek = document.getElementById('Alap');
        for (let i = 0; i < jelvenyek.data.izek.length; i++) {
            let optionTag = document.createElement('option');
            optionTag.innerText = jelvenyek.data.izek[i].JelvényNeve;
            koktelIzek.appendChild(optionTag);
        }

        const allergenSelect = document.getElementById('Allergének');
        for (let i = 0; i < jelvenyek.data.allergenek.length; i++) {
            let optionTag = document.createElement('option');
            optionTag.innerText = jelvenyek.data.izek[i].JelvényNeve;
            allergenSelect.appendChild(optionTag);
        }

        //koktelok lekeredezese
        const koktelok = await GETfetch('http://127.0.0.1:3000/api/Koktelok/lekeres');
        console.log(koktelok);
    })();

    document.getElementById('szuresInditas').addEventListener('click', async () => {
        try {
            const OBJ = {
                erosseg: document.getElementById('Erősség').value,
                ize: document.getElementById('Alap').value,
                allergenek: document.getElementById('Allergének').value,
                rendezes: document.getElementById('Rendezés').value
            };

            const data = await POSTfetch('http://127.0.0.1:3000/api/Koktelok/lekeres/parameteres', OBJ);
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    });

    document.getElementById('Searchbtn').addEventListener('click', async () => {
        try {
            const keresettKoktelNeve = document.getElementById('searchBar').value;
            if (keresettKoktelNeve.length > 0) {
                const koktelok = await GETfetch(`http://127.0.0.1:3000/api/Koktelok/lekeres/${keresettKoktelNeve}`);
                console.log(koktelok);
            } else {
                alert('Nem adott meg nevet!');
            }
        } catch (err) {
            console.error(err);
        }
    });
});
