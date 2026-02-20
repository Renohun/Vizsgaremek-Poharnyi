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
        console.log('POSTkepFeltoltes started, URL:', url);

        // When sending FormData, do NOT set Content-Type header - let browser set it with boundary
        let req;
        try {
            req = await fetch(url, {
                method: 'POST',
                body: obj
                // DO NOT add headers: { 'Content-Type': ... } with FormData
            });
            console.log('Fetch completed, status:', req.status);
        } catch (fetchErr) {
            console.error('Fetch itself failed:', fetchErr.message);
            throw fetchErr;
        }

        console.log('POSTkepFeltoltes response status:', req.status);
        console.log('POSTkepFeltoltes response ok:', req.ok);

        let responseText;
        try {
            responseText = await req.text();
            console.log('POSTkepFeltoltes raw response:', responseText);
        } catch (textErr) {
            console.error('Failed to read response text:', textErr.message);
            throw textErr;
        }

        if (req.ok) {
            try {
                const parsed = JSON.parse(responseText);
                console.log('Successfully parsed JSON:', parsed);
                return parsed;
            } catch (jsonErr) {
                console.error('Failed to parse JSON:', jsonErr.message);
                throw new Error('Nem valid JSON: ' + responseText);
            }
        } else {
            throw new Error('Status ' + req.status + ': ' + responseText);
        }
    } catch (err) {
        console.error('POSTkepFeltoltes error caught:', err.message || err);
        throw new Error('Hiba tortent: ' + (err.message || err));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //jelvenyek feltoltese a selectekbe

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

        const koktelErossegeSelect = document.getElementById('koktelErosseg');
        const koktelIzeSelect = document.getElementById('koktelIze');
        const koktelAllergenekSelect = document.getElementById('koktelAllergenek');
        for (let i = 0; i < data.allergenek.length; i++) {
            let optTag = document.createElement('option');
            optTag.innerText = data.allergenek[i].JelvényNeve;
            koktelAllergenekSelect.appendChild(optTag);
        }
        for (let i = 0; i < data.erossegek.length; i++) {
            let optTag = document.createElement('option');
            optTag.innerText = data.erossegek[i].JelvényNeve;
            koktelErossegeSelect.appendChild(optTag);
        }
        for (let i = 0; i < data.izek.length; i++) {
            let optTag = document.createElement('option');
            optTag.innerText = data.izek[i].JelvényNeve;
            koktelIzeSelect.appendChild(optTag);
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

            const koktelErosseg = document.getElementById('koktelErosseg');
            if (koktelErosseg.value.length > 0) {
                koktelErosseg.classList.add('helyesForm');
                koktelErosseg.classList.remove('hibasForm');
            } else {
                koktelErosseg.classList.remove('helyesForm');
                koktelErosseg.classList.add('hibasForm');
                hibasFrom = true;
            }
            //chat? who is this guy?
            const koktelIz = document.getElementById('koktelIze');
            if (koktelIz.value.length > 0) {
                koktelIz.classList.add('helyesForm');
                koktelIz.classList.remove('hibasForm');
            } else {
                koktelIz.classList.remove('helyesForm');
                koktelIz.classList.add('hibasForm');
                hibasFrom = true;
            }

            const koktelAllergenek = document.getElementById('koktelAllergenek');
            if (koktelAllergenek.value.length > 0) {
                koktelAllergenek.classList.add('helyesForm');
                koktelAllergenek.classList.remove('hibasForm');
            } else {
                koktelAllergenek.classList.remove('helyesForm');
                koktelAllergenek.classList.add('hibasForm');
                hibasFrom = true;
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

                (async () => {
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
                            erosseg: koktelErosseg.value,
                            iz: koktelIz.value,
                            allergenek: koktelAllergenek.value,
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
                })().catch((err) => {
                    console.error('Async error:', err);
                    alert('Hiba: ' + err);
                });
            }
        } catch (err) {
            console.error(err);
        }
    });
});
