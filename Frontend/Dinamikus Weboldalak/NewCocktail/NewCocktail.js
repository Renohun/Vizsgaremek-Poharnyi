//Globális változók létrehozása
let kepfeltolt;
let koktelnev;
let koktelalap;
let koktelmennyiseg;

let osszetevogomb;
let gombnyomasszam = 1;
let koktelurlap = document.getElementById('koktelurlap');
let osszetevodiv;
let megsegomb;
let radioMentes;
let radioAlk;
let alap;
let alapInput;
let osszetevoform;
let torlesgomb;
let DeleteOsszetevo;
let osszetevo;

const Getfetch = async (url) => {
    return await fetch(url)
        .then((Response) => {
            if (!Response.ok) {
                throw Error('Hiba');
            }
            return Response.json();
        })
        .catch((error) => {
            throw new Error(error.message);
        });
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('aqd');
    //új összetevő meghívására szolgáló gomb értékadása
    osszetevogomb = document.getElementById('osszetevogomb');
    //addeventlistener hozzáaadása
    osszetevogomb.addEventListener('click', osszetevohozzaadas);

    // megse gomb létrehozása és listener hozzáadása
    megsegomb = document.getElementById('megse');
    megsegomb.addEventListener('click', megsefugv);
    //radiogombok értékének lekérése
    radioMentes = document.getElementById('mentes');
    radioAlk = document.getElementById('alkoholos');
    //melyik radiobutton van kiválasztva, ás attól függően eltüntetjük vagy visszahozzuk az alap div tartalmát

    radioAlk.addEventListener('change', () => {
        if (radioAlk.checked == true) {
            alap = document.getElementById('alapEltuntet');
            alap.hidden = false;
        }
    });
    radioMentes.addEventListener('change', () => {
        if (radioMentes.checked == true) {
            alapInput = document.getElementById('alap');
            alap = document.getElementById('alapEltuntet');
            alap.hidden = true;
            alapInput.value = '';
        }
    });
    //elso osztv törlése
    osszetevo = document.getElementById('osztv1');
    osszetevo.addEventListener('click', () => {
        osszetevodiv = document.getElementById('osszetevoDiv');
        let elsoOsztv = document.getElementById('elsoOsszetevo');
        osszetevodiv.removeChild(elsoOsztv);
        console.log('kala');
    });
});

//új összetevő hozzáadása function(alfa lol)
function osszetevohozzaadas() {
    gombnyomasszam++;
    //új összetevő input mezőjének létrehozása DOM segítségével és bootstrap osztályok hozzáadása
    osszetevoform = document.createElement('form');
    osszetevodiv = document.getElementById('osszetevoDiv');
    torlesgomb = document.createElement('button');
    torlesgomb.type = 'button';
    torlesgomb.innerText = 'X';
    torlesgomb.classList.add('Osszetevobtn');
    torlesgomb.id = 'osztv' + gombnyomasszam;
    let col = document.createElement('div');
    col.classList.add('row', 'mt-1');
    col.id = 'osszetevoCol' + gombnyomasszam;
    let input = document.createElement('input');
    input.classList.add('OsszetevoBar');
    input.type = 'text';
    input.placeholder = 'Összetevő';
    input.id = 'osszetevo' + gombnyomasszam;
    //parent-child viszonyok meghatározása
    col.appendChild(osszetevoform);
    osszetevoform.appendChild(input);
    osszetevoform.appendChild(torlesgomb);
    osszetevodiv.appendChild(col);

    //torles
    torlesgomb.addEventListener('click', () => {
        osszetevodiv.removeChild(col);
    });
}
//Jelvények feltöltése
const erossegSelect = document.getElementById('erosseg');
const izSelect = document.getElementById('iz');
const AllergenSelect = document.getElementById('allergen');

let Izlekeres = async () => {
    const data = await Getfetch('/api/Keszites/JelvenyLekeres');
    console.log(data);

    //jelvenyek dinamikus létrehozasa:
    const jelvenyHely1 = document.getElementById('eroDiv');
    const jelvenyHely2 = document.getElementById('izDiv');
    const jelvenyHely3 = document.getElementById('allergenDiv');

    //erősség
    for (let i = 0; i < data.erosseg.length; i++) {
        console.log('a');
        let badge = document.createElement('span');
        badge.innerText = data.erosseg[i].JelvényNeve;
        badge.classList.add('badge', 'text-bg-secondary');
        badge.setAttribute('id', `eroBadge${i}`);
        jelvenyHely1.appendChild(badge);
    }
    //ízek
    for (let i = 0; i < data.iz.length; i++) {
        console.log('a');
        let badge = document.createElement('span');
        badge.innerText = data.iz[i].JelvényNeve;
        badge.classList.add('badge', 'text-bg-secondary');
        badge.setAttribute('id', `izBadge${i}`);
        jelvenyHely2.appendChild(badge);
    }
    //Allergének
    for (let i = 0; i < data.allergen.length; i++) {
        console.log('a');
        let badge = document.createElement('span');
        badge.innerText = data.allergen[i].JelvényNeve;
        badge.classList.add('badge', 'text-bg-secondary');
        badge.setAttribute('id', `allergenBadge${i}`);
        jelvenyHely3.appendChild(badge);
    }
};
Izlekeres();
//Jelvény Collapse Js

//megse gomb törlés függvény

function megsefugv() {
    alert('sikeres törlés!');
}
