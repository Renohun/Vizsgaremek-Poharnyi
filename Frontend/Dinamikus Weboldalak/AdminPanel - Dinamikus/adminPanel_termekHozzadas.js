async function POSTfetch(url, obj) {
    try {
        const req = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        });
        if (req.ok) {
            return await req.json();
        } else {
            throw new Error('Hiba tortent: ' + req.status);
        }
    } catch (err) {
        throw new Error('Hiba tortent: ' + err);
    }
}
async function POSTkepFeltoltes(url, obj) {
    try {
        const req = await fetch(url, {
            method: 'POST',
            body: obj
        });
        if (req.ok) {
            return await req.json();
        } else {
            throw new Error('Hiba tortent: ' + req.status);
        }
    } catch (err) {
        throw new Error('Hiba tortent: ' + err);
    }
}

async function GETfetch(url) {
    try {
        const data = await fetch(url);

        if (data.ok) {
            return await data.json();
        } else {
            throw new Error('Hiba tortent a fetch-el');
        }
    } catch (err) {
        throw new Error('Hiba tortent:' + err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //alkohol valasztas eseten jelenjenek meg a megfelelo input mezok
    const termekKategoriaSelect = document.getElementById('termekKategoria');
    termekKategoriaSelect.addEventListener('change', () => {
        const termekAlkoholMertekeLabel = document.getElementById('termekAlkoholLabel');
        const termekAlkoholKoraLabel = document.getElementById('termekKoraLabel');

        const termekAlkoholMerteke = document.getElementById('termekAlkohol');
        const termekAlkoholKora = document.getElementById('termekKora');
        if (termekKategoriaSelect.value == 'Alkholok') {
            termekAlkoholKoraLabel.removeAttribute('hidden', 'true');
            termekAlkoholMertekeLabel.removeAttribute('hidden', 'true');
            termekAlkoholKora.removeAttribute('hidden', 'true');
            termekAlkoholMerteke.removeAttribute('hidden', 'true');
        } else {
            termekAlkoholKoraLabel.setAttribute('hidden', 'true');
            termekAlkoholMertekeLabel.setAttribute('hidden', 'true');
            termekAlkoholKora.setAttribute('hidden', 'true');
            termekAlkoholMerteke.setAttribute('hidden', 'true');
        }
    });

    //termek nevek es id-k lekerese a selectbe

    const termekSelect = document.getElementById('termekLearazas');
    (async () => {
        const data = await GETfetch('http://127.0.0.1:3000/api/AdminPanel/TermekLekeres');
        data.result.forEach((element) => {
            const optTag = document.createElement('option');
            optTag.innerText = element.TermekCim;
            optTag.dataset.id = element.TermekID;
            termekSelect.appendChild(optTag);
        });
    })();

    document.getElementById('termekLearazasGomb').addEventListener('click', () => {
        const learazas = document.getElementById('termekLearazasanakErteke').value;
        const kivalasztottTermek = document.getElementById('termekLearazas').value;
        if (learazas.length > 0) {
            (async () => {
                const data = await GETfetch(
                    `http://127.0.0.1:3000/api/AdminPanel/TermekLearazas/${kivalasztottTermek}/${learazas}`
                );
                console.log(data);
            })();
        } else {
            alert('Hianyzik a learazas erteke');
        }
    });

    document.getElementById('termekFeltoltesGomd').addEventListener('click', async () => {
        const formDiv = document.getElementsByName('termekFeltoltes')[1];

        let POSTobj = {};
        let hibasAdatok = false;
        for (let i = 0; i < formDiv.children.length; i++) {
            if (formDiv.children[i].tagName == 'TEXTAREA') {
                POSTobj[formDiv.children[i].getAttribute('name')] = formDiv.children[i].value;
            } else {
                hibasAdatok = true;
            }

            if (formDiv.children[i].attributes.type != undefined) {
                if (
                    //attributom alapu ellenorzes
                    formDiv.children[i].attributes.type.value == 'text' ||
                    formDiv.children[i].attributes.type.value == 'number' ||
                    formDiv.children[i].attributes.type.value == 'file'
                ) {
                    if (formDiv.children[i].attributes.type.value == 'file') {
                        //szoki kepfeltoltes
                        let kepTarolas = new FormData();
                        kepTarolas.append('profilkep', formDiv.children[i].files[0]);

                        const kapottFajlNev = await POSTkepFeltoltes(
                            'http://127.0.0.1:3000/api/AdatlapLekeres/KepFeltoltes',
                            kepTarolas
                        );
                        POSTobj.fajlNeve = kapottFajlNev.message;
                    } else {
                        if (formDiv.children[i].value.length > 0) {
                            POSTobj[formDiv.children[i].getAttribute('name')] = formDiv.children[i].value;
                        } else {
                            hibasAdatok = true;
                        }
                    }
                }
            }
        }
        //ebbe az objektumba gyurjuk ossze a kapott adatokat
        const ellResult = await GETfetch(
            `http://127.0.0.1:3000/api/AdminPanel/TermekNev/Ellenorzes/${POSTobj.termekNev}`
        );

        //alert(JSON.stringify(ellResult));

        if (ellResult.duplikacio == false) {
            POSTobj.termekKategoria = document.getElementById('termekKategoria').value;
            const fetchAdat = await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/TermekFeltoltes', POSTobj);
            //console.log(fetchAdat);
        } else {
            alert('Mar letezik ilyen nevu termek');
        }
    });
});
