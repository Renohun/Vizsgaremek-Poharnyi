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

async function elutasitasGombFv() {
    const result = await POSTfetch(
        'http://127.0.0.1:3000/api/AdminPanel/jelentesek/elutasitas/' + this.dataset.jelentesID
    );
    //console.log(result);
    if (result.bool == true) {
        console.log(result.tipus[0].JelentesTipusa);
        if (result.tipus[0].JelentesTipusa == 'Koktél') {
            document.getElementById('koktelokJelentesei').click();
        } else if (result.tipus[0].JelentesTipusa == 'Komment') {
            document.getElementById('kommentekJelentesei').click();
        } else if (result.tipus[0].JelentesTipusa == 'Felhasználó') {
            document.getElementById('felhasznalokJelentesei').click();
        }
    } else {
        alert('Valami tortent az adat megvaltoztatasaval');
    }
}
async function elfogadasGombFv() {
    const result = await POSTfetch(
        'http://127.0.0.1:3000/api/AdminPanel/jelentesek/elfogadas/' + this.dataset.jelentesID
    );
    //console.log(result);
    if (result.bool == true) {
        console.log(result.tipus[0].JelentesTipusa);
        if (result.tipus[0].JelentesTipusa == 'Koktél') {
            document.getElementById('koktelokJelentesei').click();
        } else if (result.tipus[0].JelentesTipusa == 'Komment') {
            document.getElementById('kommentekJelentesei').click();
        } else if (result.tipus[0].JelentesTipusa == 'Felhasználó') {
            document.getElementById('felhasznalokJelentesei').click();
        }
    } else {
        alert('Valami tortent az adat megvaltoztatasaval');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const jelentesekDocument = document.getElementsByName('jelentesekKezelese');
    const koktelDocument = document.getElementsByName('koktelokKezelese');

    jelentesekDocument[0].addEventListener('click', () => {
        jelentesekDocument[1].removeAttribute('hidden', 'true');
        koktelDocument[1].setAttribute('hidden', 'true');
    });
    koktelDocument[0].addEventListener('click', () => {
        jelentesekDocument[1].setAttribute('hidden', 'true');
        koktelDocument[1].removeAttribute('hidden', 'true');
    });

    const felhasznalosJelentesGomb = document.getElementById('felhasznalokJelentesei');
    const koktelosJelentesGomb = document.getElementById('koktelokJelentesei');
    const kommentesJelentesGomb = document.getElementById('kommentekJelentesei');

    felhasznalosJelentesGomb.addEventListener('click', () => {
        const jelentesekSor = document.getElementById('jelentesekCard');
        jelentesekSor.innerHTML = '';
        (async () => {
            try {
                const rows = await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/jelentesek');
                const jelentesekSor = document.getElementById('jelentesekCard');
                //Tudtatok hogy a 0 es a 2 az paros szam? mert en nem
                for (let i = 0; i < rows.felhasznalok.length; i++) {
                    if (i % 2 != 0) {
                        let ujOszlop = document.createElement('div');
                        ujOszlop.classList.add(
                            'col-8',
                            'col-sm-7',
                            'col-md-6',
                            'col-lg-6',
                            'col-xl-3',
                            'col-xxl-3',
                            'mb-1'
                        );
                        jelentesekSor.appendChild(ujOszlop);

                        let elutasitasGomb = document.createElement('input');
                        elutasitasGomb.setAttribute('type', 'button');
                        elutasitasGomb.classList.add('btn');
                        elutasitasGomb.classList.add('btn-danger');
                        elutasitasGomb.classList.add('mr-3');
                        elutasitasGomb.setAttribute('value', 'Elutasitas');
                        elutasitasGomb.dataset.jelentesID = rows.felhasznalok[i - 1];
                        ujOszlop.appendChild(elutasitasGomb);
                        elutasitasGomb.addEventListener('click', elutasitasGombFv);

                        let elfogadasGomb = document.createElement('input');
                        elfogadasGomb.setAttribute('type', 'button');
                        elfogadasGomb.classList.add('btn');
                        elfogadasGomb.classList.add('btn-success');
                        elfogadasGomb.setAttribute('value', 'Elfogadas');
                        elfogadasGomb.dataset.jelentesID = rows.felhasznalok[i - 1];
                        ujOszlop.appendChild(elfogadasGomb);
                        elfogadasGomb.addEventListener('click', elfogadasGombFv);
                    }
                }
                let sorokHossza = rows.felhasznalok.length / 2;

                while (sorokHossza % 4 != 0) {
                    let ujOszlop = document.createElement('div');
                    ujOszlop.classList.add(
                        'col-8',
                        'col-sm-7',
                        'col-md-6',
                        'col-lg-6',
                        'col-xl-3',
                        'col-xxl-3',
                        'mb-1'
                    );
                    jelentesekSor.appendChild(ujOszlop);

                    sorokHossza++;
                }
            } catch (err) {
                console.error(err);
            }
        })();
    });

    koktelosJelentesGomb.addEventListener('click', () => {
        const jelentesekSor = document.getElementById('jelentesekCard');
        jelentesekSor.innerHTML = '';
        (async () => {
            try {
                const rows = await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/jelentesek');

                console.log(rows);

                const jelentesekSor = document.getElementById('jelentesekCard');
                //Tudtatok hogy a 0 es a 2 az paros szam? mert en nem
                for (let i = 0; i < rows.koktelok.length; i++) {
                    if (i % 2 != 0) {
                        console.log(rows.koktelok[i]);
                        let ujOszlop = document.createElement('div');
                        ujOszlop.classList.add(
                            'col-8',
                            'col-sm-7',
                            'col-md-6',
                            'col-lg-6',
                            'col-xl-3',
                            'col-xxl-3',
                            'mb-1'
                        );
                        jelentesekSor.appendChild(ujOszlop);

                        //Cardok renderelese
                        let margoDiv = document.createElement('div');
                        margoDiv.classList.add('mb-1');
                        ujOszlop.appendChild(margoDiv);

                        let cardDiv = document.createElement('div');
                        cardDiv.classList.add('card', 'h-100');
                        margoDiv.appendChild(cardDiv);

                        let imgTag = document.createElement('img');
                        imgTag.classList.add('card-img-top', 'img-fluid');
                        imgTag.setAttribute('alt', rows.koktelok[i][0].KoktelCim);
                        cardDiv.appendChild(imgTag);

                        let cardBody = document.createElement('div');
                        cardBody.classList.add('card-body');
                        cardDiv.appendChild(cardBody);

                        let titleH4 = document.createElement('h4');
                        titleH4.innerText = rows.koktelok[i][0].KoktelCim;
                        cardBody.appendChild(titleH4);

                        let ertekelesSpan = document.createElement('span');
                        ertekelesSpan.innerText = 'ertekeles helye';
                        cardBody.appendChild(ertekelesSpan);

                        let cardText = document.createElement('div');
                        cardText.classList.add('card-text');
                        cardBody.appendChild(cardText);

                        let badgeDiv = document.createElement('div');
                        cardText.appendChild(badgeDiv);

                        let badgeSpan = document.createElement('span');
                        badgeSpan.classList.add('badge', 'text-bg-info');
                        badgeDiv.appendChild(badgeSpan);

                        let ingredientsSpan = document.createElement('span');
                        ingredientsSpan.innerText = 'Osszetevok';
                        cardText.appendChild(ingredientsSpan);

                        let listaUl = document.createElement('ul');
                        cardText.appendChild(listaUl);
                        //Itt sztrokot kaptam...
                        //console.log(rows.koktelok[i][0].osszetevok[0].length);
                        //console.log(rows.koktelok[i][0].osszetevok[0][0].Osszetevő);
                        //console.log(rows.koktelok[i][0].osszetevok[0][1].Osszetevő);

                        //Imadom amikor mar annyit dolgozok ezen, hogy mar elfelejtem hogy egy ciklusban vagyok
                        //es egy 30percet nezem hogy i-vel miert nem mukodik a belso ciklus...

                        for (let j = 0; j < rows.koktelok[i][0].osszetevok[0].length; j++) {
                            let listaLi = document.createElement('li');
                            //console.log(rows.koktelok[i][0].osszetevok[0][i].Osszetevő);
                            listaLi.innerText = rows.koktelok[i][0].osszetevok[0][j].Osszetevő;
                            listaUl.appendChild(listaLi);
                        }

                        let tovabbKoktelraGomb = document.createElement('input');
                        tovabbKoktelraGomb.setAttribute('type', 'button');
                        tovabbKoktelraGomb.setAttribute('value', 'Tovabb a receptre');
                        tovabbKoktelraGomb.classList.add('btn', 'btn-secondary', 'w-100');
                        tovabbKoktelraGomb.dataset.koktelID = rows.koktelok[i][0].KoktélID;
                        cardBody.appendChild(tovabbKoktelraGomb);

                        let gombDiv = document.createElement('div');
                        gombDiv.classList.add('d-flex', 'justify-content-between');
                        ujOszlop.appendChild(gombDiv);

                        let elutasitasGomb = document.createElement('input');
                        elutasitasGomb.setAttribute('type', 'button');
                        elutasitasGomb.classList.add('btn');
                        elutasitasGomb.classList.add('btn-danger');
                        elutasitasGomb.setAttribute('value', 'Elutasitas');
                        elutasitasGomb.dataset.jelentesID = rows.koktelok[i - 1];
                        gombDiv.appendChild(elutasitasGomb);
                        elutasitasGomb.addEventListener('click', elutasitasGombFv);

                        let elfogadasGomb = document.createElement('input');
                        elfogadasGomb.setAttribute('type', 'button');
                        elfogadasGomb.classList.add('btn');
                        elfogadasGomb.classList.add('btn-success');
                        elfogadasGomb.setAttribute('value', 'Elfogadas');
                        elfogadasGomb.dataset.jelentesID = rows.koktelok[i - 1];
                        gombDiv.appendChild(elfogadasGomb);
                        elfogadasGomb.addEventListener('click', elfogadasGombFv);
                    }
                }

                let sorokHossza = rows.koktelok.length / 2;

                while (sorokHossza % 4 != 0) {
                    let ujOszlop = document.createElement('div');
                    ujOszlop.classList.add(
                        'col-8',
                        'col-sm-7',
                        'col-md-6',
                        'col-lg-6',
                        'col-xl-3',
                        'col-xxl-3',
                        'mb-1'
                    );
                    jelentesekSor.appendChild(ujOszlop);

                    sorokHossza++;
                }
            } catch (err) {
                console.error(err);
            }
        })();
    });

    kommentesJelentesGomb.addEventListener('click', () => {
        const jelentesekSor = document.getElementById('jelentesekCard');
        jelentesekSor.innerHTML = '';
        (async () => {
            try {
                const rows = await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/jelentesek');

                const jelentesekSor = document.getElementById('jelentesekCard');
                //Tudtatok hogy a 0 es a 2 az paros szam? mert en nem
                for (let i = 0; i < rows.kommentek.length; i++) {
                    if (i % 2 != 0) {
                        let ujOszlop = document.createElement('div');
                        ujOszlop.classList.add(
                            'col-8',
                            'col-sm-7',
                            'col-md-6',
                            'col-lg-6',
                            'col-xl-3',
                            'col-xxl-3',
                            'mb-1'
                        );
                        jelentesekSor.appendChild(ujOszlop);

                        let elutasitasGomb = document.createElement('input');
                        elutasitasGomb.setAttribute('type', 'button');
                        elutasitasGomb.classList.add('btn');
                        elutasitasGomb.classList.add('btn-danger');
                        elutasitasGomb.setAttribute('value', 'Elutasitas');
                        elutasitasGomb.dataset.jelentesID = rows.kommentek[i - 1];
                        ujOszlop.appendChild(elutasitasGomb);
                        elutasitasGomb.addEventListener('click', elutasitasGombFv);

                        let elfogadasGomb = document.createElement('input');
                        elfogadasGomb.setAttribute('type', 'button');
                        elfogadasGomb.classList.add('btn');
                        elfogadasGomb.classList.add('btn-success');
                        elfogadasGomb.setAttribute('value', 'Elfogadas');
                        elfogadasGomb.dataset.jelentesID = rows.kommentek[i - 1];
                        ujOszlop.appendChild(elfogadasGomb);
                        elfogadasGomb.addEventListener('click', elfogadasGombFv);
                    }
                }
                let sorokHossza = rows.kommentek.length / 2;

                while (sorokHossza % 4 != 0) {
                    let ujOszlop = document.createElement('div');
                    ujOszlop.classList.add(
                        'col-8',
                        'col-sm-7',
                        'col-md-6',
                        'col-lg-6',
                        'col-xl-3',
                        'col-xxl-3',
                        'mb-1'
                    );
                    jelentesekSor.appendChild(ujOszlop);

                    sorokHossza++;
                }
            } catch (err) {
                console.error(err);
            }
        })();
    });
});
