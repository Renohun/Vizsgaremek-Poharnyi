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
            this.classList.remove('btn-info');
            this.classList.add('btn-primary');
        } else {
            //torolje a mar ilyen eltarolt jelvenyt
            jelvenyTombObj.splice(index, 1);

            this.classList.add('btn-info');
            this.classList.remove('btn-primary');
        }
        console.log(jelvenyTombObj);
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
        osszetevoInput.dataset.num = osszetevoNum;
        osszetevoInput.setAttribute('required', '');
        osszetevoInput.classList.add('form-control');

        const osszetevoMenny = document.createElement('input');
        osszetevoMenny.setAttribute('type', 'number');
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
        osszetevoMertekegysegOptDB.setAttribute('value', 'Darab');
        osszetevoMertekegysegOptDB.innerText = 'Darab';

        const osszetevoMertekegysegOptGramm = document.createElement('option');
        osszetevoMertekegysegOptGramm.setAttribute('value', 'g');
        osszetevoMertekegysegOptGramm.innerText = 'g (Gramm)';

        osszetevoInputDiv.appendChild(osszetevoInput);
        osszetevoInputDiv.appendChild(osszetevoMenny);

        document.getElementById('koktelOsszetevok').appendChild(osszetevoLabel);
        document.getElementById('koktelOsszetevok').appendChild(osszetevoInputDiv);
        osszetevoInputDiv.appendChild(osszetevoMertekegysegSelect);
        osszetevoMertekegysegSelect.appendChild(osszetevoMertekegysegOptMl);
        osszetevoMertekegysegSelect.appendChild(osszetevoMertekegysegOptDB);
        osszetevoMertekegysegSelect.appendChild(osszetevoMertekegysegOptGramm);

        console.log(document.getElementById('koktelOsszetevok').children);
    });

    document.getElementById('osszetevoDel').addEventListener('click', () => {
        const koktelOsszetevoDiv = document.getElementById('koktelOsszetevok');
        osszetevoNum--;
        //console.log(koktelOsszetevoDiv.children[koktelOsszetevoDiv.children.length - 1]);
        //console.log(koktelOsszetevoDiv.children[koktelOsszetevoDiv.children.length - 1]);

        koktelOsszetevoDiv.removeChild(koktelOsszetevoDiv.children[koktelOsszetevoDiv.children.length - 1]);
        koktelOsszetevoDiv.removeChild(koktelOsszetevoDiv.children[koktelOsszetevoDiv.children.length - 1]);
        koktelOsszetevoDiv.removeChild(koktelOsszetevoDiv.children[koktelOsszetevoDiv.children.length - 1]);
    });
    (async () => {
        const data = await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/JelvenyekLetoltese');

        const koktelErossegeSelect = document.getElementById('koktelErossegek');
        const koktelIzeSelect = document.getElementById('koktelIz');
        const koktelAllergenekSelect = document.getElementById('koktelAllergen');
        for (let i = 0; i < data.allergenek.length; i++) {
            //data.allergenek[i].JelvényNeve;
            let gomb = document.createElement('input');
            gomb.setAttribute('type', 'button');
            gomb.setAttribute('value', data.allergenek[i].JelvényNeve);
            gomb.dataset.kategoria = 'allergen';
            gomb.classList.add('btn', 'btn-info');
            //once, hogy megveletlenul se keruljon fel tobb EventListener egy Elementre, hiszen akkor tobbszor futna le az fv.
            gomb.addEventListener('click', osszetevoGombListener);
            koktelAllergenekSelect.appendChild(gomb);
        }
        for (let i = 0; i < data.erossegek.length; i++) {
            //data.erossegek[i].JelvényNeve
            let gomb = document.createElement('input');
            gomb.setAttribute('type', 'button');
            gomb.setAttribute('value', data.erossegek[i].JelvényNeve);
            gomb.dataset.kategoria = 'erosseg';
            gomb.classList.add('btn', 'btn-info');
            gomb.addEventListener('click', osszetevoGombListener);
            koktelErossegeSelect.appendChild(gomb);
        }
        for (let i = 0; i < data.izek.length; i++) {
            //data.izek[i].JelvényNeve
            let gomb = document.createElement('input');
            gomb.setAttribute('type', 'button');
            gomb.setAttribute('value', data.izek[i].JelvényNeve);
            gomb.dataset.kategoria = 'iz';
            gomb.classList.add('btn', 'btn-info');
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

            let jelvenyTomb;

            if (jelvenyTombObj.length < 0) {
                hibasFrom = true;
            } else {
                let iz = 0;
                let erosseg = 0;

                for (let i = 0; i < jelvenyTombObj.length; i++) {
                    if (jelvenyTombObj[i].kategoria == 'erosseg') {
                        erosseg++;
                    } else if (jelvenyTombObj[i].kategoria == 'iz') {
                        iz++;
                    }
                }

                if (iz < 1 || erosseg != 1) {
                    hibasFrom = true;
                }

                jelvenyTomb = jelvenyTombObj.map((obj) => {
                    return obj.jelveny;
                });
            }

            let osszetevokTomb = [];

            const koktelOsszetevoDiv = document.getElementById('koktelOsszetevok').children;

            for (let i = 1; i < koktelOsszetevoDiv.length; i += 2) {
                let osszetevoElemei = koktelOsszetevoDiv[i].children;

                let osszetevoObj = {
                    osszetevo: osszetevoElemei[0].value,
                    mennyiseg: osszetevoElemei[1].value,
                    mertekegyseg: osszetevoElemei[2].value
                };

                osszetevokTomb.push(osszetevoObj);
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

            if (!hibasFrom) {
                let alkoholosEBool = false;
                const alkoholosE = document.getElementById('alkoholosE');
                if (alkoholosE.checked) {
                    alkoholosEBool = true;
                }
                //onsole.log(document.getElementById('koktelKepFeltoltes').files[0]);

                let kepTarolas = new FormData();
                kepTarolas.append('profilkep', document.getElementById('koktelKepFeltoltes').files[0]);
                //console.log(kepTarolas);

                async () => {
                    const nevObj = { nev: koktelNev.value };

                    const ellenorzes = await POSTfetch(
                        'http://127.0.0.1:3000/api/AdminPanel/KoktelFeltoltes/NevEllenorzes',
                        nevObj
                    );
                    //alert(ellenorzes.duplikacio);
                    //alert(alapMennyiseg.value);

                    if (ellenorzes.duplikacio == false) {
                        const kapottFajlNev1 = await POSTkepFeltoltes(
                            'http://127.0.0.1:3000/api/AdatlapLekeres/KepFeltoltes',
                            kepTarolas
                        );
                        //alert(kapottFajlNev.message);
                        //alert('teszt');
                        const POSTobj = {
                            nev: koktelNev.value,
                            alapMennyiseg: alapMennyiseg.value,
                            alap: koktelAlap.value,
                            jelveny: jelvenyTomb,
                            alkoholos: alkoholosEBool ? '1' : '0',
                            osszetevok: osszetevokTomb,
                            recept: koktelRecept.value,
                            fajlNeve: kapottFajlNev1.message
                        };

                        await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/KoktelFeltoltes', POSTobj);
                        //alert(JSON.stringify(data));
                        window.location.reload();
                    } else {
                        alert('Mar van ilyen koktel');
                    }
                };
            } else {
                alert('Adatok hianyoznak vagy hibasan vannak megadva');
            }
        } catch (err) {
            console.error(err);
        }
    });
});
