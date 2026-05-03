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

async function GETfetch(url) {
    try {
        const req = await fetch(url, {
            method: 'GET'
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

document.addEventListener('DOMContentLoaded', () => {
    //jelvenyek feltoltese a selectekbe

    let jelvenyTombObj = [];
    function osszetevoGombListener() {
        const jelvenyObj = { jelveny: this.value, kategoria: this.dataset.kategoria };

        let vanEMar = false;
        let index = 0;
        //Van e mar ilyen jelveny eltarolva
        for (let i = 0; i < jelvenyTombObj.length; i++) {
            if (jelvenyTombObj[i].jelveny == jelvenyObj.jelveny) {
                vanEMar = true;
                index = i;
            }
        }

        if (vanEMar == false) {
            jelvenyTombObj.push(jelvenyObj);
            this.classList.remove('btn-success');
            this.classList.add('sotetites');
        } else {
            //torolje a mar ilyen eltarolt jelvenyt
            jelvenyTombObj.splice(index, 1);

            this.classList.remove('sotetites');
            this.classList.add('btn-success');
        }
    }

    let osszetevoNum = 1;

    document.getElementById('ujOsszetevo').addEventListener('click', () => {
        osszetevoNum++;
        const osszetevoLabel = document.createElement('label');
        osszetevoLabel.classList.add('mt-3');
        osszetevoLabel.dataset.num = osszetevoNum;
        osszetevoLabel.innerText = 'Koktel ' + osszetevoNum + '. osszetevoje: ';

        const osszetevoInputDiv = document.createElement('div');
        osszetevoInputDiv.classList.add('d-flex', 'justify-content-between');

        const osszetevoInput = document.createElement('input');
        osszetevoInput.setAttribute('type', 'text');
        osszetevoInput.setAttribute('placeholder', 'Összetevő neve');
        osszetevoInput.dataset.num = osszetevoNum;
        osszetevoInput.setAttribute('required', '');
        osszetevoInput.classList.add('form-control');

        const osszetevoMenny = document.createElement('input');
        osszetevoMenny.setAttribute('type', 'number');
        osszetevoMenny.setAttribute('placeholder', 'Mérték');
        osszetevoMenny.dataset.num = osszetevoNum;
        osszetevoMenny.setAttribute('required', '');
        osszetevoMenny.classList.add('form-control');

        const osszetevoMertekegysegSelect = document.createElement('select');

        osszetevoMertekegysegSelect.setAttribute('name', 'osszetevoMertekegyseg');
        osszetevoMertekegysegSelect.setAttribute('id', 'osszetevoMertekegyseg');
        osszetevoMertekegysegSelect.classList.add('form-control');

        const osszetevoMertekegysegOptMl = document.createElement('option');
        osszetevoMertekegysegOptMl.setAttribute('value', 'Ml');
        osszetevoMertekegysegOptMl.innerText = 'Ml';

        const osszetevoMertekegysegOptDB = document.createElement('option');
        osszetevoMertekegysegOptDB.setAttribute('value', 'db');
        osszetevoMertekegysegOptDB.innerText = 'db';

        const osszetevoMertekegysegOptGramm = document.createElement('option');
        osszetevoMertekegysegOptGramm.setAttribute('value', 'g');
        osszetevoMertekegysegOptGramm.innerText = 'g';

        const osszetevoMertekegysegOptCl = document.createElement('option');
        osszetevoMertekegysegOptCl.setAttribute('value', 'Cl');
        osszetevoMertekegysegOptCl.innerText = 'Cl';

        osszetevoInputDiv.appendChild(osszetevoInput);
        osszetevoInputDiv.appendChild(osszetevoMenny);

        document.getElementById('koktelOsszetevok').appendChild(osszetevoLabel);
        document.getElementById('koktelOsszetevok').appendChild(osszetevoInputDiv);
        osszetevoInputDiv.appendChild(osszetevoMertekegysegSelect);
        osszetevoMertekegysegSelect.appendChild(osszetevoMertekegysegOptMl);
        osszetevoMertekegysegSelect.appendChild(osszetevoMertekegysegOptDB);
        osszetevoMertekegysegSelect.appendChild(osszetevoMertekegysegOptGramm);
        osszetevoMertekegysegSelect.appendChild(osszetevoMertekegysegOptCl);

        console.log(document.getElementById('koktelOsszetevok').children);
    });

    document.getElementById('osszetevoDel').addEventListener('click', () => {
        if (osszetevoNum > 1) {
            const koktelOsszetevoDiv = document.getElementById('koktelOsszetevok');
            osszetevoNum--;

            koktelOsszetevoDiv.removeChild(koktelOsszetevoDiv.children[koktelOsszetevoDiv.children.length - 1]);
            koktelOsszetevoDiv.removeChild(koktelOsszetevoDiv.children[koktelOsszetevoDiv.children.length - 1]);
        }
    });
    (async () => {
        const data = await GETfetch('/api/Keszites/JelvenyLekeres');

        const koktelErossegeSelect = document.getElementById('koktelErossegek');
        const koktelIzeSelect = document.getElementById('koktelIz');
        const koktelAllergenekSelect = document.getElementById('koktelAllergen');
        for (let i = 0; i < data.allergen.length; i++) {
            //data.allergenek[i].JelvényNeve;
            let gomb = document.createElement('input');
            gomb.setAttribute('type', 'button');
            gomb.setAttribute('value', data.allergen[i].JelvényNeve);
            gomb.dataset.kategoria = 'allergen';
            gomb.classList.add('btn', 'btn-success', 'shadow-sm', 'w-100');
            //once, hogy megveletlenul se keruljon fel tobb EventListener egy Elementre, hiszen akkor tobbszor futna le az fv.
            gomb.addEventListener('click', osszetevoGombListener);
            koktelAllergenekSelect.appendChild(gomb);
        }
        for (let i = 0; i < data.erosseg.length; i++) {
            //data.erossegek[i].JelvényNeve
            let gomb = document.createElement('input');
            gomb.setAttribute('type', 'button');
            gomb.setAttribute('value', data.erosseg[i].JelvényNeve);
            gomb.dataset.kategoria = 'erosseg';
            gomb.classList.add('btn', 'btn-success', 'shadow-sm', 'w-100');
            gomb.addEventListener('click', osszetevoGombListener);
            koktelErossegeSelect.appendChild(gomb);
        }
        for (let i = 0; i < data.iz.length; i++) {
            //data.izek[i].JelvényNeve
            let gomb = document.createElement('input');
            gomb.setAttribute('type', 'button');
            gomb.setAttribute('value', data.iz[i].JelvényNeve);
            gomb.dataset.kategoria = 'iz';
            gomb.classList.add('btn', 'btn-success', 'shadow-sm', 'w-100');
            gomb.addEventListener('click', osszetevoGombListener);
            koktelIzeSelect.appendChild(gomb);
        }
    })();

    document.getElementById('koktelFeltoltes').addEventListener('click', () => {
        try {
            let hibasFrom = false;

            const koktelNev = document.getElementById('koktelNeve');
            if (koktelNev.value.length > 0) {
                koktelNev.classList.add('helyesForm');
                koktelNev.classList.remove('hibasForm');
            } else {
                koktelNev.classList.remove('helyesForm');
                koktelNev.classList.add('hibasForm');
                hibasFrom = true;
            }

            const koktelAlap = document.getElementById('koktelAlapja');
            if (koktelAlap.value.length > 0) {
                koktelAlap.classList.add('helyesForm');
                koktelAlap.classList.remove('hibasForm');
            } else {
                koktelAlap.classList.remove('helyesForm');
                koktelAlap.classList.add('hibasForm');
                hibasFrom = true;
            }

            let izTomb = [];
            let erostomb = [];
            let allergenTomb = [];

            if (jelvenyTombObj.length < 0) {
                hibasFrom = true;
            } else {
                let iz = 0;
                let erosseg = 0;

                for (let i = 0; i < jelvenyTombObj.length; i++) {
                    if (jelvenyTombObj[i].kategoria == 'erosseg') {
                        erostomb.push(jelvenyTombObj[i].jelveny);
                        erosseg++;
                    } else if (jelvenyTombObj[i].kategoria == 'iz') {
                        izTomb.push(jelvenyTombObj[i].jelveny);
                        iz++;
                    } else if (jelvenyTombObj[i].kategoria == 'allergen') {
                        allergenTomb.push(jelvenyTombObj[i].jelveny);
                    }
                }

                if (iz < 1 || erosseg != 1) {
                    hibasFrom = true;
                }
            }

            let osszetevokTomb = [];

            const koktelOsszetevoDiv = document.getElementById('koktelOsszetevok').children;

            for (let i = 1; i < koktelOsszetevoDiv.length; i += 2) {
                let osszetevoElemei = koktelOsszetevoDiv[i].children;

                let osszetevoTomb = [osszetevoElemei[0].value, osszetevoElemei[1].value, osszetevoElemei[2].value];

                osszetevokTomb.push(osszetevoTomb);
            }

            //console.log(osszetevokTomb);

            const alapMennyiseg = document.getElementById('koktelAlapjaMennyiseg');
            if (alapMennyiseg.value.length > 0) {
                alapMennyiseg.classList.add('helyesForm');
                alapMennyiseg.classList.remove('hibasForm');
            } else {
                alapMennyiseg.classList.remove('helyesForm');
                alapMennyiseg.classList.add('hibasForm');
                hibasFrom = true;
            }

            const koktelRecept = document.getElementById('koktelRecept');
            if (koktelRecept.value.length > 0) {
                koktelRecept.classList.add('helyesForm');
                koktelRecept.classList.remove('hibasForm');
            } else {
                koktelRecept.classList.remove('helyesForm');
                koktelRecept.classList.add('hibasForm');
                hibasFrom = true;
            }
            let kepTarolas = new FormData();
            if (document.getElementById('koktelKepFeltoltes').files[0] != undefined) {
                if (
                    document.getElementById('koktelKepFeltoltes').files[0].length != 0 &&
                    (document.getElementById('koktelKepFeltoltes').files[0].type == 'image/jpeg' ||
                        document.getElementById('koktelKepFeltoltes').files[0].type == 'image/png' ||
                        document.getElementById('koktelKepFeltoltes').files[0].type == 'image/webp' ||
                        document.getElementById('koktelKepFeltoltes').files[0].type == 'image/bmp')
                ) {
                    kepTarolas.append('profilkep', document.getElementById('koktelKepFeltoltes').files[0]);
                }
            } else {
                hibasFrom = true;
            }

            if (!hibasFrom) {
                let alkoholosEBool = false;
                const alkoholosE = document.getElementById('alkoholosE');
                if (alkoholosE.checked) {
                    alkoholosEBool = true;
                }
                //onsole.log(document.getElementById('koktelKepFeltoltes').files[0]);

                //console.log(kepTarolas);

                (async () => {
                    const kapottFajlNev1 = await POSTkepFeltoltes('/api/AdatlapLekeres/KepFeltoltes', kepTarolas);
                    //alert(kapottFajlNev.message);
                    //alert('teszt');
                    const POSTobj = {
                        nev: koktelNev.value,
                        mennyiseg: alapMennyiseg.value,
                        alap: koktelAlap.value,
                        erosseg: erostomb,
                        iz: izTomb,
                        allergen: allergenTomb,
                        alkoholose: alkoholosEBool ? true : false,
                        osszetevok: osszetevokTomb,
                        leiras: koktelRecept.value,
                        kepUtvonala: kapottFajlNev1.message
                    };

                    const response = await POSTfetch('/api/Keszites/Feltoltes', POSTobj);
                    //alert(JSON.stringify(data));

                    if (response.feltoltottid != null || undefined) {
                        var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
                        modalElement.show();

                        document.getElementById('modalText').innerText = 'Sikeres koktél feltöltés!';

                        document.getElementById('modalBtn').addEventListener('click', () => {
                            modalElement.hide();
                            window.location.reload();
                        });
                    }

                    if (response.hiba == 'duplicate') {
                        var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
                        modalElement.show();

                        document.getElementById('modalText').innerText = 'Már létezik ilyen koktél!';

                        document.getElementById('modalBtn').addEventListener('click', () => {
                            modalElement.hide();
                        });
                    }
                })();
            } else {
                var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
                modalElement.show();

                document.getElementById('modalText').innerText = 'Adatok hiányoznak vag hibásan vannak megadva!';

                document.getElementById('modalBtn').addEventListener('click', () => {
                    modalElement.hide();
                });
            }
        } catch (err) {
            console.error(err);
        }
    });
});
