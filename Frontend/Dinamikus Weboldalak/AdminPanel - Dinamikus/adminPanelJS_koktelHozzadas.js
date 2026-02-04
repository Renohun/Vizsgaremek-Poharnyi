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
        osszetevoInputDiv.classList.add('d-flex');

        const osszetevoInput = document.createElement('input');
        osszetevoInput.setAttribute('type', 'text');
        osszetevoInput.dataset.num = osszetevoNum;
        osszetevoInput.setAttribute('required', '');
        osszetevoInput.classList.add('form-control', 'me-5', 'w-50');

        const osszetevoMenny = document.createElement('input');
        osszetevoMenny.setAttribute('type', 'text');
        osszetevoMenny.dataset.num = osszetevoNum;
        osszetevoMenny.setAttribute('required', '');
        osszetevoMenny.classList.add('form-control', 'w-50');
        osszetevoMenny.setAttribute('placeholder', 'Mennyiseg(ml)');

        osszetevoInputDiv.appendChild(osszetevoInput);
        osszetevoInputDiv.appendChild(osszetevoMenny);

        document.getElementById('koktelOsszetevok').appendChild(osszetevoLabel);
        document.getElementById('koktelOsszetevok').appendChild(osszetevoInputDiv);

        console.log(document.getElementById('koktelOsszetevok').children);
    });

    document.getElementById('osszetevoDel').addEventListener('click', () => {
        const koktelOsszetevoDiv = document.getElementById('koktelOsszetevok');
        osszetevoNum--;
        //console.log(koktelOsszetevoDiv.children[koktelOsszetevoDiv.children.length - 1]);
        //console.log(koktelOsszetevoDiv.children[koktelOsszetevoDiv.children.length - 1]);

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
            let osszetevoObj = {
                osszetevo: koktelOsszetevoDiv[i].children[0].value,
                mennyiseg: koktelOsszetevoDiv[i].children[1].value
            };

            osszetevokTomb.push(osszetevoObj);
        }

        //console.log(osszetevokTomb);

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
            console.log(document.getElementById('koktelKepFeltoltes').files[0]);

            let kepTarolas = {};
            kepTarolas.fajl = document.getElementById('koktelKepFeltoltes').files[0];
            console.log(kepTarolas);

            (async () => {
                const POSTobj = {
                    nev: koktelNev.value,
                    alap: koktelAlap.value,
                    erosseg: koktelErosseg.value,
                    iz: koktelIz.value,
                    allergenek: koktelAllergenek.value,
                    alkoholos: alkoholosEBool ? '1' : '0',
                    osszetevok: osszetevokTomb,
                    recept: koktelRecept.value,
                    kep: kepTarolas
                };

                const data = await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/KoktelFeltoltes', POSTobj);
                console.log(data);
            })();
        }
    });
});
