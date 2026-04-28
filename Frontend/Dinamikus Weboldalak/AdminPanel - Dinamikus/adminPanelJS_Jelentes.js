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

async function elutasitasGombFv() {
    const result = await POSTfetch('/api/AdminPanel/jelentesek/elutasitas/' + this.dataset.jelentesID);
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
    const result = await POSTfetch('/api/AdminPanel/jelentesek/elfogadas/' + this.dataset.jelentesID);
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
    const termekDocument = document.getElementsByName('termekFeltoltes');

    jelentesekDocument[0].addEventListener('click', () => {
        jelentesekDocument[1].removeAttribute('hidden', 'true');
        koktelDocument[1].setAttribute('hidden', 'true');
        termekDocument[1].setAttribute('hidden', 'true');
    });
    koktelDocument[0].addEventListener('click', () => {
        jelentesekDocument[1].setAttribute('hidden', 'true');
        koktelDocument[1].removeAttribute('hidden', 'true');
        termekDocument[1].setAttribute('hidden', 'true');
    });
    termekDocument[0].addEventListener('click', () => {
        termekDocument[1].removeAttribute('hidden', 'true');
        jelentesekDocument[1].setAttribute('hidden', 'true');
        koktelDocument[1].setAttribute('hidden', 'true');
    });

    const felhasznalosJelentesGomb = document.getElementById('felhasznalokJelentesei');
    const koktelosJelentesGomb = document.getElementById('koktelokJelentesei');
    const kommentesJelentesGomb = document.getElementById('kommentekJelentesei');

    felhasznalosJelentesGomb.addEventListener('click', () => {
        const jelentesekSor = document.getElementById('jelentesekCard');
        jelentesekSor.innerHTML = '';
        (async () => {
            try {
                const rows = await POSTfetch('/api/AdminPanel/jelentesek');

                if (rows.felhasznalok.length == 0) {
                    let uzenetElement = document.createElement('p');
                    uzenetElement.innerText = 'Nincsen semmilyen jeléntes jelenleg :)';
                    jelentesekSor.appendChild(uzenetElement);
                } else {
                    const jelentesekSor = document.getElementById('jelentesekCard');
                    //Tudtatok hogy a 0 es a 2 az paros szam? mert en nem
                    for (let i = 0; i < rows.felhasznalok.length; i++) {
                        if (i % 2 != 0) {
                            console.log(rows);

                            let ujOszlop = document.createElement('div');
                            ujOszlop.classList.add(
                                'col-12',
                                'col-sm-6',
                                'col-md-6',
                                'col-lg-6',
                                'col-xl-3',
                                'col-xxl-3',
                                'align-self-stretch',
                                'mb-1'
                            );
                            ujOszlop.setAttribute('id', 'felhasznaloJelentes');
                            jelentesekSor.appendChild(ujOszlop);

                            let margoDiv = document.createElement('div');
                            margoDiv.classList.add('mb-1');
                            ujOszlop.appendChild(margoDiv);

                            let cardDiv = document.createElement('div');
                            cardDiv.classList.add('card');
                            margoDiv.appendChild(cardDiv);

                            let cardBody = document.createElement('div');
                            cardBody.classList.add('card-body', 'd-flex', 'flex-column');
                            cardDiv.appendChild(cardBody);

                            let titleH4 = document.createElement('h4');
                            titleH4.innerText = rows.felhasznalok[i][0].Felhasználónév;
                            cardBody.appendChild(titleH4);

                            let separator = document.createElement('hr');
                            cardBody.appendChild(separator);

                            let cardText = document.createElement('div');
                            cardText.classList.add('card-text');
                            cardBody.appendChild(cardText);

                            let emailElement = document.createElement('p');
                            emailElement.innerText = 'Felhasználó email címe: ' + rows.felhasznalok[i][0].Email;
                            cardText.appendChild(emailElement);

                            let regisztralasDatuma = document.createElement('p');

                            let reg = rows.felhasznalok[i][0].RegisztracioDatuma.split('T');
                            let regDate = reg[0];
                            let regTime = reg[1].split('.')[0];

                            regisztralasDatuma.innerText = 'Regisztráció ideje: ' + regDate + ' ' + regTime;
                            cardText.appendChild(regisztralasDatuma);

                            let separator2 = document.createElement('hr');
                            cardBody.appendChild(separator2);

                            let jelentesHeader = document.createElement('h4');
                            jelentesHeader.innerText = 'Jelentés indokai:';
                            cardBody.appendChild(jelentesHeader);

                            let jelentesekLista = document.createElement('ul');
                            //console.log(rows.koktelok[i][0].jelentesIndokok[0][0].JelentesIndoka);
                            //rows.felhasznalok[i][0].jelentesIndokok[0].length avagy hany indok van
                            //rows.felhasznalok[i][0].jelentesIndokok[0][j].JelentesIndoka maga az indok
                            if (rows.felhasznalok[i][0].jelentesIndokok[0].length < 3) {
                                for (let j = 0; j < rows.felhasznalok[i][0].jelentesIndokok[0].length; j++) {
                                    if (rows.felhasznalok[i][0].jelentesIndokok[0][j].JelentesIndoka.length > 0) {
                                        let indokArr =
                                            rows.felhasznalok[i][0].jelentesIndokok[0][j].JelentesIndoka.split(' ');
                                        //console.log(indokArr.length);
                                        //ez a valtozo tarolja el a teljes indok karakter hosszat
                                        let indokArrKarakterSzam = 0;

                                        for (let k = 0; k < indokArr.length; k++) {
                                            for (let l = 0; l < indokArr[k].length; l++) {
                                                indokArrKarakterSzam += 1;
                                            }
                                        }

                                        if (indokArr.length < 8) {
                                            if (indokArrKarakterSzam >= 50) {
                                                let indokString = '';
                                                let karakterSzamlalo = 0;
                                                while (karakterSzamlalo < 50) {
                                                    for (let k = 0; k < indokArr.length; k++) {
                                                        indokString += ' ';
                                                        for (let l = 0; l < indokArr[k].length; l++) {
                                                            indokString += indokArr[k][l];
                                                            karakterSzamlalo++;
                                                        }
                                                    }
                                                }
                                                let jelentesekIndokok = document.createElement('li');
                                                jelentesekIndokok.innerText = indokString + '...';
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            } else {
                                                let jelentesekIndokok = document.createElement('li');
                                                jelentesekIndokok.innerText =
                                                    rows.felhasznalok[i][0].jelentesIndokok[0][j].JelentesIndoka;
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            }
                                        } else if (indokArr.length >= 8) {
                                            //console.log('beleptem ide');
                                            if (indokArrKarakterSzam >= 50) {
                                                let indokString = '';
                                                let karakterSzamlalo = 0;
                                                while (karakterSzamlalo < 50) {
                                                    for (let k = 0; k < indokArr.length; k++) {
                                                        indokString += ' ';
                                                        for (let l = 0; l < indokArr[k].length; l++) {
                                                            indokString += indokArr[k][l];
                                                            karakterSzamlalo++;
                                                        }
                                                    }
                                                }
                                                let jelentesekIndokok = document.createElement('li');
                                                jelentesekIndokok.innerText = indokString + '...';
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            } else {
                                                let indokString = '';
                                                for (let k = 0; k < 8; k++) {
                                                    indokString += ' ' + indokArr[k];
                                                }
                                                let jelentesekIndokok = document.createElement('li');
                                                indokString += '...';
                                                jelentesekIndokok.innerText = indokString;
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            }
                                        }
                                    }
                                }
                            } else if (rows.felhasznalok[i][0].jelentesIndokok[0].length >= 3) {
                                for (let j = 0; j < 3; j++) {
                                    let indokArr =
                                        rows.felhasznalok[i][0].jelentesIndokok[0][j].JelentesIndoka.split(' ');
                                    console.log(indokArr.length);

                                    if (indokArr.length < 8) {
                                        let jelentesekIndokok = document.createElement('li');
                                        jelentesekIndokok.innerText =
                                            rows.felhasznalok[i][0].jelentesIndokok[0][j].JelentesIndoka;
                                        jelentesekLista.appendChild(jelentesekIndokok);
                                    } else if (indokArr.length >= 8) {
                                        //console.log('beleptem ide');

                                        let indokString = '';
                                        for (let k = 0; k < 8; k++) {
                                            indokString += ' ' + indokArr[k];
                                        }
                                        let jelentesekIndokok = document.createElement('li');
                                        indokString += '...';
                                        jelentesekIndokok.innerText = indokString;
                                        jelentesekLista.appendChild(jelentesekIndokok);
                                    }
                                }

                                const jelentesXIndok = document.createElement('li');
                                jelentesXIndok.innerText =
                                    'További ' +
                                    parseInt(rows.felhasznalok[i][0].jelentesIndokok[0].length - 3) +
                                    ' jelentés...';
                                jelentesekLista.appendChild(jelentesXIndok);
                            }

                            if (jelentesekLista.children.length <= 0) {
                                let jelentesUres = document.createElement('li');
                                jelentesUres.innerText = 'Indok még nincsen megadva!';
                                jelentesekLista.appendChild(jelentesUres);
                            }
                            cardBody.appendChild(jelentesekLista);

                            //Itt sztrokot kaptam...
                            //console.log(rows.koktelok[i][0].osszetevok[0].length);
                            //console.log(rows.koktelok[i][0].osszetevok[0][0].Osszetevő);
                            //console.log(rows.koktelok[i][0].osszetevok[0][1].Osszetevő);

                            //Imadom amikor mar annyit dolgozok ezen, hogy mar elfelejtem hogy egy ciklusban vagyok
                            //es egy 30percet nezem hogy i-vel miert nem mukodik a belso ciklus...

                            let gombDiv = document.createElement('div');
                            gombDiv.classList.add('d-flex', 'justify-content-between', 'mt-auto');
                            cardBody.appendChild(gombDiv);

                            let elutasitasGomb = document.createElement('input');
                            elutasitasGomb.setAttribute('type', 'button');
                            elutasitasGomb.classList.add('btn');
                            elutasitasGomb.classList.add('btn-danger');
                            elutasitasGomb.setAttribute('value', 'Elutasítás');
                            elutasitasGomb.dataset.jelentesID = rows.felhasznalok[i - 1];
                            gombDiv.appendChild(elutasitasGomb);
                            elutasitasGomb.addEventListener('click', elutasitasGombFv);

                            let elfogadasGomb = document.createElement('input');
                            elfogadasGomb.setAttribute('type', 'button');
                            elfogadasGomb.classList.add('btn');
                            elfogadasGomb.classList.add('btn-success');
                            elfogadasGomb.setAttribute('value', 'Elfogadás');
                            elfogadasGomb.dataset.jelentesID = rows.felhasznalok[i - 1];
                            gombDiv.appendChild(elfogadasGomb);
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
                const rows = await POSTfetch('/api/AdminPanel/jelentesek');

                if (rows.koktelok.length == 0) {
                    let uzenetElement = document.createElement('p');
                    uzenetElement.innerText = 'Nincsen semmilyen jelentés jelenleg :)';
                    jelentesekSor.appendChild(uzenetElement);
                } else {
                    const jelentesekSor = document.getElementById('jelentesekCard');
                    //Tudtatok hogy a 0 es a 2 az paros szam? mert en nem
                    for (let i = 0; i < rows.koktelok.length; i++) {
                        if (i % 2 != 0) {
                            console.log(rows.koktelok[i]);
                            let ujOszlop = document.createElement('div');
                            ujOszlop.classList.add(
                                'col-12',
                                'col-sm-6',
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
                            cardDiv.classList.add('card', 'koktelCard');
                            margoDiv.appendChild(cardDiv);

                            //console.log(rows.koktelok[i][0].KoktélID);
                            let imgTag = document.createElement('img');
                            (async () => {
                                const koktelKep = await GETKepLekeres(
                                    `/api/AdatlapLekeres/KepLekeres/${rows.koktelok[i][0].BoritoKepUtvonal}`
                                );
                                imgTag.setAttribute('src', URL.createObjectURL(koktelKep));
                            })();

                            //onsole.log(koktelKep);
                            //hivatkozas kepre: URL.createObjectURL(koktelKep)

                            imgTag.classList.add('card-img-top', 'img-fluid');
                            imgTag.setAttribute('alt', rows.koktelok[i][0].KoktelCim);
                            cardDiv.appendChild(imgTag);

                            let cardBody = document.createElement('div');
                            cardBody.classList.add('card-body', 'd-flex', 'flex-column');
                            cardDiv.appendChild(cardBody);

                            let titleH4 = document.createElement('h4');
                            titleH4.innerText = rows.koktelok[i][0].KoktelCim;
                            cardBody.appendChild(titleH4);

                            let separator = document.createElement('hr');
                            cardBody.appendChild(separator);

                            //rows.koktelok[i][0].ertekeles[0][0].Osszert

                            if (rows.koktelok[i][0].ertekeles[0][0].Osszert == null) {
                                let ertekeles = document.createElement('span');
                                ertekeles.innerText = 'Nincs meg értékelés!';
                                cardBody.appendChild(ertekeles);
                            } else {
                                const ertekeles = Math.round(rows.koktelok[i][0].ertekeles[0][0].Osszert * 10) / 10;
                                let csillagok = '';

                                for (let i = 0; i < Math.round(ertekeles - 0.5); i++) {
                                    csillagok += '★';
                                }
                                //Számot stringé alakítunk, majd megnézzük hogy van e benne tizedesjelölő
                                if (ertekeles.toString().includes('.')) {
                                    csillagok += '★';
                                    for (let i = 0; i < 5 - Math.round(ertekeles); i++) {
                                        csillagok += '☆';
                                    }
                                } else {
                                    for (let i = 0; i < 5 - Math.round(ertekeles - 0.5); i++) {
                                        csillagok += '☆';
                                    }
                                }

                                csillagok += '(' + ertekeles + ')';

                                let ertekelesElement = document.createElement('span');
                                ertekelesElement.innerText = 'Értékelés: ' + csillagok;
                                cardBody.appendChild(ertekelesElement);
                            }

                            let cardText = document.createElement('div');
                            cardText.classList.add('card-text');
                            cardBody.appendChild(cardText);

                            let tovabbKoktelraGomb = document.createElement('input');
                            tovabbKoktelraGomb.setAttribute('type', 'button');
                            tovabbKoktelraGomb.setAttribute('value', 'Tovább a receptre');
                            tovabbKoktelraGomb.classList.add('btn', 'btn-secondary', 'w-100');
                            tovabbKoktelraGomb.dataset.koktelID = rows.koktelok[i][0].KoktélID;

                            tovabbKoktelraGomb.addEventListener('click', () => {
                                window.location.href = `/Koktel/${rows.koktelok[i][0].KoktélID}`;
                            });

                            cardBody.appendChild(tovabbKoktelraGomb);

                            let separator2 = document.createElement('hr');
                            cardBody.appendChild(separator2);

                            const jelentesDiv = document.createElement('div');

                            let jelentesHeader = document.createElement('h4');
                            jelentesHeader.innerText = 'Jelentés indokai:';
                            jelentesDiv.appendChild(jelentesHeader);

                            let jelentesekLista = document.createElement('ul');
                            //console.log(rows.koktelok[i][0].jelentesIndokok[0][0].JelentesIndoka);

                            if (rows.koktelok[i][0].jelentesIndokok[0].length < 3) {
                                for (let j = 0; j < rows.koktelok[i][0].jelentesIndokok[0].length; j++) {
                                    if (rows.koktelok[i][0].jelentesIndokok[0][j].JelentesIndoka.length > 0) {
                                        let indokArr =
                                            rows.koktelok[i][0].jelentesIndokok[0][j].JelentesIndoka.split(' ');
                                        console.log(indokArr.length);
                                        let indokArrKarakterSzam = 0;

                                        for (let k = 0; k < indokArr.length; k++) {
                                            for (let l = 0; l < indokArr[k].length; l++) {
                                                indokArrKarakterSzam += 1;
                                            }
                                        }

                                        if (indokArr.length < 8) {
                                            if (indokArrKarakterSzam >= 40) {
                                                let indokString = '';
                                                let karakterSzamlalo = 0;
                                                while (karakterSzamlalo < 40) {
                                                    for (let k = 0; k < indokArr.length; k++) {
                                                        indokString += ' ';
                                                        for (let l = 0; l < indokArr[k].length; l++) {
                                                            indokString += indokArr[k][l];
                                                            karakterSzamlalo++;
                                                        }
                                                    }
                                                }
                                                let jelentesekIndokok = document.createElement('li');
                                                jelentesekIndokok.innerText = indokString + '...';
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            } else {
                                                let jelentesekIndokok = document.createElement('li');
                                                jelentesekIndokok.innerText =
                                                    rows.koktelok[i][0].jelentesIndokok[0][j].JelentesIndoka;
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            }
                                        } else if (indokArr.length >= 8) {
                                            //console.log('beleptem ide');
                                            if (indokArrKarakterSzam >= 40) {
                                                let indokString = '';
                                                let karakterSzamlalo = 0;
                                                while (karakterSzamlalo < 40) {
                                                    for (let k = 0; k < indokArr.length; k++) {
                                                        indokString += ' ';
                                                        for (let l = 0; l < indokArr[k].length; l++) {
                                                            indokString += indokArr[k][l];
                                                            karakterSzamlalo++;
                                                        }
                                                    }
                                                }
                                                let jelentesekIndokok = document.createElement('li');
                                                jelentesekIndokok.innerText = indokString + '...';
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            } else {
                                                let indokString = '';
                                                for (let k = 0; k < 8; k++) {
                                                    indokString += ' ' + indokArr[k];
                                                }
                                                let jelentesekIndokok = document.createElement('li');
                                                indokString += '...';
                                                jelentesekIndokok.innerText = indokString;
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            }
                                        }
                                    }
                                }
                            } else if (rows.koktelok[i][0].jelentesIndokok[0].length >= 3) {
                                for (let j = 0; j < 3; j++) {
                                    let indokArr = rows.koktelok[i][0].jelentesIndokok[0][j].JelentesIndoka.split(' ');
                                    console.log(indokArr.length);

                                    if (indokArr.length < 8) {
                                        let jelentesekIndokok = document.createElement('li');
                                        jelentesekIndokok.innerText =
                                            rows.koktelok[i][0].jelentesIndokok[0][j].JelentesIndoka;
                                        jelentesekLista.appendChild(jelentesekIndokok);
                                    } else if (indokArr.length >= 8) {
                                        //console.log('beleptem ide');

                                        let indokString = '';
                                        for (let k = 0; k < 8; k++) {
                                            indokString += ' ' + indokArr[k];
                                        }
                                        let jelentesekIndokok = document.createElement('li');
                                        indokString += '...';
                                        jelentesekIndokok.innerText = indokString;
                                        jelentesekLista.appendChild(jelentesekIndokok);
                                    }
                                }

                                const jelentesXIndok = document.createElement('li');
                                jelentesXIndok.innerText =
                                    'További ' +
                                    parseInt(rows.koktelok[i][0].jelentesIndokok[0].length - 3) +
                                    ' jelentés...';
                                jelentesekLista.appendChild(jelentesXIndok);
                            }

                            if (jelentesekLista.children.length <= 0) {
                                let jelentesUres = document.createElement('li');
                                jelentesUres.innerText = 'Indok még nincsen megadva!';
                                jelentesekLista.appendChild(jelentesUres);
                            }
                            jelentesDiv.appendChild(jelentesekLista);
                            cardBody.appendChild(jelentesDiv);

                            let gombDiv = document.createElement('div');
                            gombDiv.classList.add('d-flex', 'justify-content-between', 'mt-auto');
                            cardBody.appendChild(gombDiv);

                            let elutasitasGomb = document.createElement('input');
                            elutasitasGomb.setAttribute('type', 'button');
                            elutasitasGomb.classList.add('btn');
                            elutasitasGomb.classList.add('btn-danger');
                            elutasitasGomb.setAttribute('value', 'Elutasítás');
                            elutasitasGomb.dataset.jelentesID = rows.koktelok[i - 1];
                            gombDiv.appendChild(elutasitasGomb);
                            elutasitasGomb.addEventListener('click', elutasitasGombFv);

                            let elfogadasGomb = document.createElement('input');
                            elfogadasGomb.setAttribute('type', 'button');
                            elfogadasGomb.classList.add('btn');
                            elfogadasGomb.classList.add('btn-success');
                            elfogadasGomb.setAttribute('value', 'Elfogadás');
                            elfogadasGomb.dataset.jelentesID = rows.koktelok[i - 1];
                            gombDiv.appendChild(elfogadasGomb);
                            elfogadasGomb.addEventListener('click', elfogadasGombFv);
                        }
                    }

                    let sorokHossza = rows.koktelok.length / 2;

                    while (sorokHossza % 4 != 0) {
                        let ujOszlop = document.createElement('div');
                        ujOszlop.classList.add(
                            'col-12',
                            'col-sm-6',
                            'col-md-6',
                            'col-lg-6',
                            'col-xl-3',
                            'col-xxl-3',
                            'mb-1'
                        );
                        jelentesekSor.appendChild(ujOszlop);

                        sorokHossza++;
                    }
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
                const rows = await POSTfetch('/api/AdminPanel/jelentesek');

                if (rows.kommentek.length == 0) {
                    let uzenetElement = document.createElement('p');
                    uzenetElement.innerText = 'Nincsen semmilyen jelentés jelenleg :)';
                    jelentesekSor.appendChild(uzenetElement);
                } else {
                    const jelentesekSor = document.getElementById('jelentesekCard');
                    //Tudtatok hogy a 0 es a 2 az paros szam? mert en nem
                    for (let i = 0; i < rows.kommentek.length; i++) {
                        if (i % 2 != 0) {
                            let ujOszlop = document.createElement('div');
                            ujOszlop.classList.add(
                                'col-12',
                                'col-sm-6',
                                'col-md-6',
                                'col-lg-6',
                                'col-xl-3',
                                'col-xxl-3',
                                'mb-1'
                            );
                            jelentesekSor.appendChild(ujOszlop);

                            let margoDiv = document.createElement('div');
                            margoDiv.classList.add('mb-1');
                            ujOszlop.appendChild(margoDiv);

                            let cardDiv = document.createElement('div');
                            cardDiv.classList.add('card', 'kommentCard');
                            margoDiv.appendChild(cardDiv);

                            let cardBody = document.createElement('div');
                            cardBody.classList.add('card-body', 'd-flex', 'flex-column');
                            cardDiv.appendChild(cardBody);

                            let titleH4 = document.createElement('h4');
                            titleH4.innerText = rows.kommentek[i][0].Felhasználónév;
                            cardBody.appendChild(titleH4);

                            let separator = document.createElement('hr');
                            cardBody.appendChild(separator);

                            let cardText = document.createElement('div');
                            cardText.classList.add('card-text');
                            cardBody.appendChild(cardText);

                            let emailElement = document.createElement('p');
                            emailElement.innerText = 'Komment tartalma: ' + rows.kommentek[i][0].Tartalom;
                            cardText.appendChild(emailElement);

                            let separator2 = document.createElement('hr');
                            cardBody.appendChild(separator2);

                            let jelentesContainer = document.createElement('div');
                            jelentesContainer.classList.add('d-flex', 'flex-column', 'justify-content-start');

                            let jelentesHeader = document.createElement('h4');
                            jelentesHeader.innerText = 'Jelentés indokai:';
                            cardBody.appendChild(jelentesHeader);

                            let jelentesekLista = document.createElement('ul');
                            //console.log(rows.koktelok[i][0].jelentesIndokok[0][0].JelentesIndoka);

                            if (rows.kommentek[i][0].jelentesIndokok[0].length < 3) {
                                for (let j = 0; j < rows.kommentek[i][0].jelentesIndokok[0].length; j++) {
                                    if (rows.kommentek[i][0].jelentesIndokok[0][j].JelentesIndoka.length > 0) {
                                        let indokArr =
                                            rows.kommentek[i][0].jelentesIndokok[0][j].JelentesIndoka.split(' ');
                                        console.log(indokArr.length);

                                        let indokArrKarakterSzam = 0;

                                        for (let k = 0; k < indokArr.length; k++) {
                                            for (let l = 0; l < indokArr[k].length; l++) {
                                                indokArrKarakterSzam += 1;
                                            }
                                        }

                                        if (indokArr.length < 8) {
                                            if (indokArrKarakterSzam >= 50) {
                                                let indokString = '';
                                                let karakterSzamlalo = 0;
                                                while (karakterSzamlalo < 50) {
                                                    for (let k = 0; k < indokArr.length; k++) {
                                                        indokString += ' ';
                                                        for (let l = 0; l < indokArr[k].length; l++) {
                                                            indokString += indokArr[k][l];
                                                            karakterSzamlalo++;
                                                        }
                                                    }
                                                }
                                                let jelentesekIndokok = document.createElement('li');
                                                jelentesekIndokok.innerText = indokString + '...';
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            } else {
                                                let jelentesekIndokok = document.createElement('li');
                                                jelentesekIndokok.innerText =
                                                    rows.kommentek[i][0].jelentesIndokok[0][j].JelentesIndoka;
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            }
                                        } else if (indokArr.length >= 8) {
                                            //console.log('beleptem ide');

                                            if (indokArrKarakterSzam >= 50) {
                                                let indokString = '';
                                                let karakterSzamlalo = 0;
                                                while (karakterSzamlalo != 50) {
                                                    for (let k = 0; k < indokArr.length; k++) {
                                                        indokString += ' ';
                                                        for (let l = 0; l < indokArr[k].length; l++) {
                                                            indokString += indokArr[k][l];
                                                            karakterSzamlalo++;
                                                        }
                                                    }
                                                }
                                                let jelentesekIndokok = document.createElement('li');
                                                jelentesekIndokok.innerText = indokString + '...';
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            } else {
                                                let indokString = '';
                                                for (let k = 0; k < 8; k++) {
                                                    indokString += ' ' + indokArr[k];
                                                }
                                                let jelentesekIndokok = document.createElement('li');
                                                indokString += '...';
                                                jelentesekIndokok.innerText = indokString;
                                                jelentesekLista.appendChild(jelentesekIndokok);
                                            }
                                        }
                                    }
                                }
                            } else if (rows.kommentek[i][0].jelentesIndokok[0].length >= 3) {
                                for (let j = 0; j < 3; j++) {
                                    let indokArr = rows.kommentek[i][0].jelentesIndokok[0][j].JelentesIndoka.split(' ');
                                    console.log(indokArr.length);

                                    if (indokArr.length < 8) {
                                        let jelentesekIndokok = document.createElement('li');
                                        jelentesekIndokok.innerText =
                                            rows.kommentek[i][0].jelentesIndokok[0][j].JelentesIndoka;
                                        jelentesekLista.appendChild(jelentesekIndokok);
                                    } else if (indokArr.length >= 8) {
                                        //console.log('beleptem ide');

                                        let indokString = '';
                                        for (let k = 0; k < 8; k++) {
                                            indokString += ' ' + indokArr[k];
                                        }
                                        let jelentesekIndokok = document.createElement('li');
                                        indokString += '...';
                                        jelentesekIndokok.innerText = indokString;
                                        jelentesekLista.appendChild(jelentesekIndokok);
                                    }
                                }

                                const jelentesXIndok = document.createElement('li');
                                jelentesXIndok.innerText =
                                    'További ' +
                                    parseInt(rows.kommentek[i][0].jelentesIndokok[0].length - 3) +
                                    ' jelentés...';
                                jelentesekLista.appendChild(jelentesXIndok);
                            }
                            if (jelentesekLista.children.length <= 0) {
                                let jelentesUres = document.createElement('li');
                                jelentesUres.innerText = 'Indok még nincsen megadva!';
                                jelentesekLista.appendChild(jelentesUres);
                            }
                            jelentesContainer.appendChild(jelentesHeader);
                            jelentesContainer.appendChild(jelentesekLista);
                            cardBody.appendChild(jelentesContainer);

                            let gombDiv = document.createElement('div');
                            gombDiv.classList.add('d-flex', 'justify-content-between', 'mt-auto');
                            cardBody.appendChild(gombDiv);

                            let elutasitasGomb = document.createElement('input');
                            elutasitasGomb.setAttribute('type', 'button');
                            elutasitasGomb.classList.add('btn');
                            elutasitasGomb.classList.add('btn-danger');
                            elutasitasGomb.setAttribute('value', 'Elutasítás');
                            elutasitasGomb.dataset.jelentesID = rows.kommentek[i - 1];
                            ujOszlop.appendChild(elutasitasGomb);
                            elutasitasGomb.addEventListener('click', elutasitasGombFv);
                            gombDiv.appendChild(elutasitasGomb);

                            let elfogadasGomb = document.createElement('input');
                            elfogadasGomb.setAttribute('type', 'button');
                            elfogadasGomb.classList.add('btn');
                            elfogadasGomb.classList.add('btn-success');
                            elfogadasGomb.setAttribute('value', 'Elfogadás');
                            elfogadasGomb.dataset.jelentesID = rows.kommentek[i - 1];
                            ujOszlop.appendChild(elfogadasGomb);
                            elfogadasGomb.addEventListener('click', elfogadasGombFv);
                            gombDiv.appendChild(elfogadasGomb);
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
                }
            } catch (err) {
                console.error(err);
            }
        })();
    });
});
