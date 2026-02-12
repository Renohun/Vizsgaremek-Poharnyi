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

function atvitelKoktelra() {
    const id = this.dataset.id;
    window.location.href = `http://127.0.0.1:3000/Koktel/${id}`;
}

function koktelRendereles(koktelok) {
    const DOMsor = document.getElementById('koktelSor');
    console.log(koktelok.koktelokAdat);
    DOMsor.innerHTML = ""
    koktelok.koktelokAdat.forEach((koktel) => {
        if (koktel != null) {
            const divMB = document.createElement('div');
            divMB.classList.add('col-8', 'col-sm-7', 'col-md-6', 'col-lg-6', 'col-xl-3', 'col-xxl-3', 'mb-1');
            DOMsor.appendChild(divMB);

            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card', 'h-100');
            divMB.appendChild(cardDiv);

            let imgTag = document.createElement('img');
            imgTag.setAttribute('alt', koktel.KoktelCim);
            //console.log(koktel.KoktélID);

            (async () => {
                const koktelKep = await POSTKepLekeres(
                    `http://127.0.0.1:3000/api/AdminPanel/KepLekeres/${koktel.KoktélID}`
                );
                imgTag.setAttribute('src', URL.createObjectURL(koktelKep));
            })();

            cardDiv.appendChild(imgTag);
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            cardDiv.appendChild(cardBody);

            let cim = document.createElement('h4');
            cim.innerText = koktel.KoktelCim;
            cardBody.appendChild(cim);

            let ertekeles = document.createElement('span');
            ertekeles.innerText = 'Értékelés: ' + koktel.ertekeles;
            cardBody.appendChild(ertekeles);

            const cardText = document.createElement('div');
            cardText.classList.add('card-text');
            cardBody.appendChild(cardText);

            const jelvenyDiv = document.createElement('div');
            cardText.appendChild(jelvenyDiv);

            koktel.jelvenyek.forEach((jelveny) => {
                if (jelveny.JelvenyKategoria == 'ízek') {
                    let jelvenyDOM = document.createElement('span');
                    jelvenyDOM.classList.add('badge', 'text-bg-success', 'me-1');
                    jelvenyDOM.innerText = jelveny.JelvényNeve;
                    jelvenyDiv.appendChild(jelvenyDOM);
                } else if (jelveny.JelvenyKategoria == 'Allergének') {
                    let jelvenyDOM = document.createElement('span');
                    jelvenyDOM.classList.add('badge', 'text-bg-warning', 'me-1');
                    jelvenyDOM.innerText = jelveny.JelvényNeve;
                    jelvenyDiv.appendChild(jelvenyDOM);
                } else if (jelveny.JelvenyKategoria == 'Erősség') {
                    let jelvenyDOM = document.createElement('span');
                    jelvenyDOM.classList.add('badge', 'text-bg-danger', 'me-1');
                    jelvenyDOM.innerText = jelveny.JelvényNeve;
                    jelvenyDiv.appendChild(jelvenyDOM);
                }
            });
            let osszetevoDOM = document.createElement('span');
            osszetevoDOM.innerText = 'Összetevők';
            cardText.appendChild(osszetevoDOM);

            const uLista = document.createElement('ul');
            cardText.classList.add('h-100');
            let i = 0;
            //console.log(koktel.osszetevok[0].Osszetevő);

            while (i != koktel.osszetevok.length && i < 3) {
                //console.log(koktel.osszetevok);
                //console.log(koktel.osszetevok[i]);

                let liOsszetevo = document.createElement('li');
                //console.log(koktel.osszetevok[i].Osszetevő);

                liOsszetevo.innerText = koktel.osszetevok[i].Osszetevő;
                uLista.appendChild(liOsszetevo);
                i++;
            }
            //console.log(i);

            if (koktel.osszetevok.length > 3) {
                const li = document.createElement('li');
                li.innerText = `és ${koktel.osszetevok.length - 3} további...`;
                uLista.appendChild(li);
            }
            cardText.appendChild(uLista);

            const tovabbBtn = document.createElement('input');
            tovabbBtn.setAttribute('type', 'button');
            tovabbBtn.setAttribute('value', 'Tovább a Receptre');
            tovabbBtn.classList.add('btn', 'btn-secondary', 'w-100');
            tovabbBtn.dataset.id = koktel.KoktélID;
            cardText.appendChild(tovabbBtn);
            tovabbBtn.addEventListener('click', atvitelKoktelra);
        }
    });
    let oszlopokSzama = koktelok.koktelokAdat.length;
    while (oszlopokSzama % 4 != 0) {
        let ujOszlop = document.createElement('div');
        ujOszlop.classList.add('col-8', 'col-sm-7', 'col-md-6', 'col-lg-6', 'col-xl-3', 'col-xxl-3', 'mb-1');
        DOMsor.appendChild(ujOszlop);
        oszlopokSzama++;
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
        //console.log(jelvenyek.data);

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
            optionTag.innerText = jelvenyek.data.allergenek[i].JelvényNeve;
            allergenSelect.appendChild(optionTag);
        }

        //koktelok lekeredezese
        const koktelok = await GETfetch('http://127.0.0.1:3000/api/Koktelok/lekeres');
        //console.log(koktelok);

        koktelRendereles(koktelok);
    })();

    document.getElementById('szuresInditas').addEventListener('click', async () => {
        try {
            const OBJ = {
                erosseg: document.getElementById('Erősség').value,
                ize: document.getElementById('Alap').value,
                allergenek: document.getElementById('Allergének').value,
                alkoholosE: document.getElementById('AlkoholosE').value,
                rendezes: document.getElementById('Rendezés').value
            };

            const data = await POSTfetch('http://127.0.0.1:3000/api/Koktelok/lekeres/parameteres', OBJ);
            koktelRendereles(data);
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
