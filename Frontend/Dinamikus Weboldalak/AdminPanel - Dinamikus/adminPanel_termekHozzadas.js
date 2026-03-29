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

function inputFieldClear() {
    const inputokFields = document.getElementsByName('termekFeltoltes')[1].children;
    console.log(inputokFields);
    console.log(typeof inputokFields);
    for (let i = 2; i < inputokFields.length; i++) {
        if (
            inputokFields[i].tagName == 'INPUT' &&
            (inputokFields[i].getAttribute('type') == 'text' || inputokFields[i].getAttribute('type') == 'number')
        ) {
            inputokFields[i].value = '';
        } else if (inputokFields[i].tagName == 'TEXTAREA') {
            inputokFields[i].value = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //alkohol valasztas eseten jelenjenek meg a megfelelo input mezok
    const termekKategoriaSelect = document.getElementById('termekKategoria');
    termekKategoriaSelect.addEventListener('change', () => {
        const urtartalomLabel = document.getElementById('termekUrtartalomLabel');
        const urtartalomInput = document.getElementById('termekUrtartalom');

        const alkoholSzazalekLabel = document.getElementById('termekAlkoholLabel');
        const alkoholSzazalekInput = document.getElementById('termekAlkohol');

        const alkoholKoraLabel = document.getElementById('termekKoraLabel');
        const alkoholKoraInput = document.getElementById('termekKora');

        //console.log(termekKategoriaSelect.value);
        //legit retard vagyok ig, nem ertem hogy miert &&-sel mukodik csak miert nem ||-gyal
        if (termekKategoriaSelect.value != 'Eszkozok' && termekKategoriaSelect.value != 'Merch') {
            urtartalomLabel.removeAttribute('hidden');
            urtartalomInput.removeAttribute('hidden');
            if (termekKategoriaSelect.value != 'Pohar') {
                alkoholSzazalekLabel.removeAttribute('hidden');
                alkoholSzazalekInput.removeAttribute('hidden');
                alkoholKoraLabel.removeAttribute('hidden');
                alkoholKoraInput.removeAttribute('hidden');
            } else {
                alkoholSzazalekLabel.setAttribute('hidden', true);
                alkoholSzazalekInput.setAttribute('hidden', true);
                alkoholKoraLabel.setAttribute('hidden', true);
                alkoholKoraInput.setAttribute('hidden', true);
            }
        } else {
            urtartalomInput.setAttribute('hidden', true);
            urtartalomLabel.setAttribute('hidden', true);
            alkoholSzazalekLabel.setAttribute('hidden', true);
            alkoholSzazalekInput.setAttribute('hidden', true);
            alkoholKoraLabel.setAttribute('hidden', true);
            alkoholKoraInput.setAttribute('hidden', true);
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
                var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
                modalElement.show();

                document.getElementById('modalText').innerText = 'Termék sikeresen leárazva ' + learazas + '%-kal!';

                document.getElementById('modalBtn').addEventListener('click', () => {
                    modalElement.hide();
                });
            })();
        } else {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'Leárazás értéke hiányzik!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
    });

    document.getElementById('termekFeltoltesGomd').addEventListener('click', async () => {
        const formDiv = document.getElementsByName('termekFeltoltes')[1];

        let POSTobj = {};
        let hibasAdatok = false;
        for (let i = 0; i < formDiv.children.length; i++) {
            if (formDiv.children[i].tagName == 'TEXTAREA') {
                if (formDiv.children[i].value.length > 0) {
                    POSTobj[formDiv.children[i].getAttribute('name')] = formDiv.children[i].value;
                } else {
                    hibasAdatok = true;
                }
            }
            //Itt atmegyek az formdiv gyermekein es megnezem hogy van neki a type attributoma, ha van akkor tudom hogy az adata

            if (formDiv.children[i].attributes.type != undefined) {
                if (
                    //attributom alapu ellenorzes
                    formDiv.children[i].attributes.type.value == 'text' ||
                    formDiv.children[i].attributes.type.value == 'number' ||
                    formDiv.children[i].attributes.type.value == 'file'
                ) {
                    if (formDiv.children[i].attributes.type.value == 'file') {
                        if (formDiv.children[i].files[0] == undefined) {
                            hibasAdatok = true;
                        } else {
                            if (
                                formDiv.children[i].files[0].length != 0 &&
                                (formDiv.children[i].files[0].type == 'image/jpeg' ||
                                    formDiv.children[i].files[0].type == 'image/png' ||
                                    formDiv.children[i].files[0].type == 'image/bmp' ||
                                    formDiv.children[i].files[0].type == 'image/webp')
                            ) {
                                let kepTarolas = new FormData();
                                kepTarolas.append('profilkep', formDiv.children[i].files[0]);
                                const kapottFajlNev = await POSTkepFeltoltes(
                                    'http://127.0.0.1:3000/api/AdatlapLekeres/KepFeltoltes',
                                    kepTarolas
                                );

                                POSTobj.fajlNeve = kapottFajlNev.message;
                            } else {
                                hibasAdatok = true;
                            }
                        }

                        //szoki kepfeltoltes
                    } else {
                        if (formDiv.children[i].value.length > 0) {
                            POSTobj[formDiv.children[i].getAttribute('name')] = formDiv.children[i].value;
                        } else {
                            console.log(formDiv.children[i].getAttributeNames().includes('hidden'));
                            console.log(formDiv.children[i]);

                            if (!formDiv.children[i].getAttributeNames().includes('hidden')) {
                                hibasAdatok = true;
                            }
                        }
                    }
                }
            }
        }
        if (hibasAdatok == false) {
            //ebbe az objektumba gyurjuk ossze a kapott adatokat
            const ellResult = await GETfetch(
                `http://127.0.0.1:3000/api/AdminPanel/TermekNev/Ellenorzes/${POSTobj.termekNev}`
            );

            //alert(JSON.stringify(ellResult));
            //MODALok megjelenitese
            if (ellResult.duplikacio == false) {
                POSTobj.termekKategoria = document.getElementById('termekKategoria').value;
                const response = await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/TermekFeltoltes', POSTobj);
                console.log(response);
                var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
                modalElement.show();

                document.getElementById('modalText').innerText = 'Termék sikeresen hozzáadva!';

                document.getElementById('modalBtn').addEventListener('click', () => {
                    modalElement.hide();
                    inputFieldClear();
                });
                //console.log(fetchAdat);
            } else {
                var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
                modalElement.show();

                document.getElementById('modalText').innerText = 'Ilyen nevű koktél már létezik';

                document.getElementById('modalBtn').addEventListener('click', () => {
                    modalElement.hide();
                });
            }
        } else {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'Hiányoznak adatok!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
    });
});
