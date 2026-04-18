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

async function PATCHfetch(url) {
    try {
        const data = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
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

async function atvitelKoktelra() {
    const id = this.dataset.id;
    await PATCHfetch(`/api/Koktelok/nepszeruseg/${id}`);
    window.location.href = `/Koktel/${id}`;
}

function koktelRendereles(koktelok) {
    const DOMsor = document.getElementById('koktelSor');
    console.log(koktelok.koktelokAdat);
    DOMsor.innerHTML = '';
    koktelok.koktelokAdat.forEach((koktel) => {
        if (koktel != null) {
            const divMB = document.createElement('div');
            divMB.classList.add('col-12', 'col-sm-6', 'col-md-6', 'col-lg-6', 'col-xl-3', 'col-xxl-3', 'mb-1');
            DOMsor.appendChild(divMB);

            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card', 'h-100', 'shadow-sm');
            divMB.appendChild(cardDiv);

            let imgTag = document.createElement('img');
            imgTag.setAttribute('alt', koktel.KoktelCim);
            imgTag.classList.add('img-fluid', 'rounded');
            //console.log(koktel.KoktélID);

            (async () => {
                const koktelKep = await GETKepLekeres(
                    `/api/AdatlapLekeres/KepLekeres/${koktel.BoritoKepUtvonal}`
                );
                imgTag.setAttribute('src', URL.createObjectURL(koktelKep));
            })();

            cardDiv.appendChild(imgTag);
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'justify-content-between');
            cardDiv.appendChild(cardBody);

            let cim = document.createElement('h4');
            cim.innerText = koktel.KoktelCim;
            cardBody.appendChild(cim);

            if (koktel.ertekeles == 0) {
                let ertekeles = document.createElement('span');
                ertekeles.innerText = 'Nincs meg ertekeles!';
                cardBody.appendChild(ertekeles);
            } else {
                let csillagert = Math.ceil(koktel.ertekeles);
                let csillagok = '';
                for (let i = 0; i < csillagert; i++) {
                    csillagok += '★';
                }
                for (let i = 0; i < 5 - csillagert; i++) {
                    csillagok += '☆';
                }
                csillagok += '(' + Math.round(koktel.ertekeles * 10) / 10 + ')';

                let ertekelesElement = document.createElement('span');
                ertekelesElement.innerText = 'Értékelés: ' + csillagok;
                cardBody.appendChild(ertekelesElement);
            }

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
            let i = 0;
            //console.log(koktel.osszetevok[0].Osszetevő);
            //itt legeneral 3 vagy annal kevesebb osszeteveot
            while (i != koktel.osszetevok.length && i < 3) {
                //console.log(koktel.osszetevok);
                //console.log(koktel.osszetevok[i]);

                let liOsszetevo = document.createElement('li');
                //console.log(koktel.osszetevok[i].Osszetevő);

                liOsszetevo.innerText = koktel.osszetevok[i].Osszetevő;
                uLista.appendChild(liOsszetevo);
                i++;
            }
            if (koktel.osszetevok.length > 3) {
                const extraOssz = document.createElement('li');
                extraOssz.innerText = 'és további ' + (koktel.osszetevok.length - 3) + ' Összetevő...';
                uLista.appendChild(extraOssz);
            } else if (koktel.osszetevok.length <= 3) {
                for (let j = -1; j < 3 - i; j++) {
                    const extraUres = document.createElement('div');
                    extraUres.style.height = '20px';
                    extraUres.style.width = '240px';
                    uLista.appendChild(extraUres);
                }
            }

            cardText.appendChild(uLista);

            const tovabbBtn = document.createElement('input');
            tovabbBtn.setAttribute('type', 'button');
            tovabbBtn.setAttribute('value', 'Tovább a Receptre');
            tovabbBtn.classList.add('btn', 'btn-secondary', 'w-100');
            tovabbBtn.dataset.id = koktel.KoktélID;
            cardBody.appendChild(tovabbBtn);
            tovabbBtn.addEventListener('click', atvitelKoktelra);
        }
    });
    let oszlopokSzama = 0;
    console.log(koktelok.koktelokAdat.length);

    for (let i = 0; i < koktelok.koktelokAdat.length; i++) {
        if (koktelok.koktelokAdat[i] != null) {
            oszlopokSzama += 1;
        }
    }

    console.log(oszlopokSzama);

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
        const jelvenyek = await GETfetch('/api/Koktelok/Jelvenyek');
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
        const koktelok = await GETfetch('/api/Koktelok/lekeres');
        //console.log(koktelok);

        koktelRendereles(koktelok);
    })();

    document.getElementById('szuresInditas').addEventListener('click', async () => {
        try {
            const OBJ = {
                nev: document.getElementById('searchBar').value,
                erosseg: document.getElementById('Erősség').value,
                ize: document.getElementById('Alap').value,
                allergenek: document.getElementById('Allergének').value,
                alkoholosE: document.getElementById('AlkoholosE').value,
                rendezes: document.getElementById('Rendezés').value
            };

            const data = await POSTfetch('/api/Koktelok/lekeres/parameteres', OBJ);
            koktelRendereles(data);
        } catch (err) {
            console.error(err);
        }
    });

    document.getElementById('Searchbtn').addEventListener('click', async () => {
        try {
            const keresettKoktelNeve = document.getElementById('searchBar').value;
            if (keresettKoktelNeve.length > 0) {
                const koktelok = await GETfetch(`/api/Koktelok/lekeres/${keresettKoktelNeve}`);
                koktelRendereles(koktelok);
            } else {
                const koktelok = await GETfetch('/api/Koktelok/lekeres');
                //console.log(koktelok);
                koktelRendereles(koktelok);
            }
        } catch (err) {
            console.error(err);
        }
    });
});
