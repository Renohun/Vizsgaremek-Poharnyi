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

const AdatPostKep = async (url, data) => {
    try {
        const ertek = await fetch(url, {
            method: 'POST',
            body: data
        });
        if (ertek.ok) {
            return ertek.json();
        } else {
            console.error(ertek.statusText);
        }
    } catch (error) {
        console.error(error);
    }
};

const AdatPost = async (url, data) => {
    try {
        const ertek = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (ertek.ok) {
            return ertek.json();
        } else {
            console.error(ertek.statusText);
        }
    } catch (error) {
        console.error(error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('aqd');
    //új összetevő meghívására szolgáló gomb értékadása
    osszetevogomb = document.getElementById('osszetevogomb');
    //addeventlistener hozzáaadása
    osszetevogomb.addEventListener('click', osszetevohozzaadas);

    // megse gomb létrehozása és listener hozzáadása
    function megsefugv() {
    //alert('sikeres törlés!');
    window.location.reload();
   
}
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
    //adott pixelszám alatti classok addolasa
    window.addEventListener("resize",()=>{

        if (window.innerWidth < 992) 
        {
        document.getElementById("drop-area").classList.add("mx-auto")
        }
        })
            document.getElementById('kuldes').addEventListener('click', AdatStorage);
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
    col.classList.add('row', 'mt-1', 'ujOsszetevo');
    col.id = 'osszetevoCol' + gombnyomasszam;
    let input = document.createElement('input');
    input.classList.add('OsszetevoBar');
    input.type = 'text';
    input.placeholder = 'Összetevő';
    input.id = 'osszetevo' + gombnyomasszam;
    let mennyiseg = document.createElement('input');
    let mertekegyseg = document.createElement('select');
    mennyiseg.type = 'number';
    mennyiseg.setAttribute('id', `OsszetevoMennyiseg${gombnyomasszam}`);
    mennyiseg.classList.add('OsszetevoMennyiseg');
    mennyiseg.setAttribute('placeholder', 'mennyiség');
    mertekegyseg.setAttribute('id', `osszetevoMertekegyseg${gombnyomasszam}`);
    mertekegyseg.classList.add('MertekSelect');
    let opcioMl = document.createElement('option');
    let opcioDb = document.createElement('option');
    let opcioGr = document.createElement('option');
    opcioMl.value = 'ML';
    opcioDb.value = 'darab';
    opcioGr.value = 'GR';
    opcioMl.innerHTML = 'ml';
    opcioDb.innerHTML = 'db';
    opcioGr.innerHTML = 'gr';
    opcioMl.classList.add('Mertekegyseg');
    opcioDb.classList.add('Mertekegyseg');
    opcioGr.classList.add('Mertekegyseg');
    mertekegyseg.appendChild(opcioMl);
    mertekegyseg.appendChild(opcioDb);
    mertekegyseg.appendChild(opcioGr);
    //parent-child viszonyok meghatározása

    col.appendChild(input);
    col.appendChild(mennyiseg);
    col.appendChild(mertekegyseg);
    col.appendChild(torlesgomb);

    osszetevodiv.appendChild(col);

    //torles
    torlesgomb.addEventListener('click', () => {
        osszetevodiv.removeChild(col);
    });
}

//
//
//
// ADATFELTÖLTÉS
//
//
//

//képfeltöltés

const dropArea = document.getElementById('drop-area');
const inputFile = document.getElementById('input-file');
const ImgView = document.getElementById('img-view');

inputFile.addEventListener('change', KepFeltoltes);

function KepFeltoltes() {
    let imgLink = URL.createObjectURL(inputFile.files[0]);

    ImgView.style.backgroundImage = `url(${imgLink})`;
    const kep = document.getElementById('iconkep');
    const szoveg = document.getElementById('szoveg');
    kep.setAttribute('hidden', 'true');
    szoveg.setAttribute('hidden', 'true');
    ImgView.style.border = 'none';
}

dropArea.addEventListener('dragover', function (e) {
    e.preventDefault();
});
dropArea.addEventListener('drop', function (e) {
    e.preventDefault(); //kikapcsolja adott elemt alapvető funkcióját a megadott eseményre
    inputFile.files = e.dataTransfer.files;
    KepFeltoltes();
});

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
        badge.classList.add('badge', 'text-bg-secondary', 'sajatBadge', 'erobadge');
        badge.setAttribute('id', `eroBadge${i}`);
        jelvenyHely1.appendChild(badge);
    }
    //ízek
    for (let i = 0; i < data.iz.length; i++) {
        console.log('a');
        let badge = document.createElement('span');
        badge.innerText = data.iz[i].JelvényNeve;
        badge.classList.add('badge', 'text-bg-secondary', 'sajatBadge', 'izbadge');
        badge.setAttribute('id', `izBadge${i}`);
        jelvenyHely2.appendChild(badge);
    }
    //Allergének
    for (let i = 0; i < data.allergen.length; i++) {
        console.log('a');
        let badge = document.createElement('span');
        badge.innerText = data.allergen[i].JelvényNeve;
        badge.classList.add('badge', 'text-bg-secondary', 'sajatBadge', 'allergenbadge');
        badge.setAttribute('id', `allergenBadge${i}`);
        jelvenyHely3.appendChild(badge);
    }

    //Badge kiválasztás:
    const erossegBadgek = [];
    let KivalasztottErosseg;

    //
    //Erősség
    //
    //Kinyerem a bejárni kívánt html elementeket és egy tömbbe pusholom, őket
    for (let i = 0; i < data.erosseg.length; i++) {
        erossegBadgek.push(document.getElementById(`eroBadge${i}`));
    }

    //bejárom a tömböt amiben a badge-ek vannak és rájuk rakom a click eseményfiegylőt
    for (let i = 0; i < erossegBadgek.length; i++) {
        const Erobadge = erossegBadgek[i];

        const Eroclick = () => {
            let KivalasztottEro = Erobadge;
            KivalasztottErosseg = KivalasztottEro.innerHTML;
            console.log(KivalasztottErosseg);
            for (let j = 0; j < erossegBadgek.length; j++) {
                erossegBadgek[j].classList.remove('text-bg-dark');
                 KivalasztottEro.classList.remove('kivalasztott', 'ero');
            }
            KivalasztottEro.classList.add('text-bg-dark');
            KivalasztottEro.classList.add('kivalasztott', 'ero');
        };

        Erobadge.addEventListener('click', Eroclick);
    }

    //
    //
    //ÍZ
    //
    //

    const izBadgek = [];
    let KivalasztottIz;

    for (let i = 0; i < data.iz.length; i++) {
        izBadgek.push(document.getElementById(`izBadge${i}`));
    }

    //bejárom a tömböt amiben a badg-ek vannak és rájuk rakom a click eseményfigylőt
    for (let i = 0; i < izBadgek.length; i++) {
        const Izbadge = izBadgek[i];

        const Izclick = () => {
            let valasztottIz = Izbadge;
            KivalasztottIz = Izbadge.innerHTML;
            console.log(KivalasztottIz);
            Izbadge.classList.add('text-bg-dark');
            for (let j = 0; j < izBadgek.length; j++) {
                izBadgek[j].classList.remove('text-bg-dark');
                 valasztottIz.classList.remove('kivalasztott', 'iz');
            }
            valasztottIz.classList.add('text-bg-dark');
            valasztottIz.classList.add('kivalasztott', 'iz');
        };

        Izbadge.addEventListener('click', Izclick);
    }

    //
    //
    //Allergének
    //
    //

    const allergenBadgek = [];
    let KivalasztottAllergen;

    for (let i = 0; i < data.iz.length; i++) {
        allergenBadgek.push(document.getElementById(`allergenBadge${i}`));
    }

    //bejárom a tömböt amiben a badg-ek vannak és rájuk rakom a click eseményfigylőt
    for (let i = 0; i < allergenBadgek.length; i++) {
        const allergenbadge = allergenBadgek[i];

        const Allergenclick = () => {
            let valasztottAllergen = allergenbadge;
            KivalasztottAllergen = valasztottAllergen.innerHTML;

            console.log(KivalasztottAllergen);
            allergenbadge.classList.add('text-bg-dark');
            for (let j = 0; j < allergenBadgek.length; j++) {
                allergenBadgek[j].classList.remove('text-bg-dark');
                 valasztottAllergen.classList.remove('kivalasztott', 'allergen');
            }
            valasztottAllergen.classList.add('text-bg-dark');
            valasztottAllergen.classList.add('kivalasztott', 'allergen');
        };

        allergenbadge.addEventListener('click', Allergenclick);
    }

};
Izlekeres();

//adatok kiküldése az adatbazisba

const AdatStorage = async () => {
     console.log(window.innerWidth)
    
    let hiba = true;
    //alap adatok kitöltésének ellenörzése
    if (document.getElementById('nev').value == '') {
        hiba = false;
       // alert('ne hagyja üresen a koktél nevét!');
    }
    if (document.getElementById('mennyiseg').value == '') {
        hiba = false;
       // alert('ne hagyja üresen a koktél mennyiségét!');
    }

    //képfeltöltés

    let kepUtvonal;

    console.log(inputFile.files[0]);
    const kep = new FormData();
    if (inputFile.files.length != 0) {
        if (
            inputFile.files[0].type != 'image/jpeg' &&
            inputFile.files[0].type != 'image/png' &&
            inputFile.files[0].type != 'image/bmp' &&
            inputFile.files[0].type != 'image/webp'
        ) {
            //alert('hibás formátum!');
            hiba = false;
        } else {
            kep.append('profilkep', inputFile.files[0]);
            kepUtvonal = await AdatPostKep('/api/AdatlapLekeres/KepFeltoltes', kep);
        }
    } else {
        //alert('Kérem töltsön fel egy képet!');
        hiba = false;
    }

    //alkoholose
    let alkoholose;
    radioMentes = document.getElementById('mentes');
    radioAlk = document.getElementById('alkoholos');
    if (radioAlk.checked == true) {
        alkoholose = true;
        
    } else if (radioMentes.checked == true) {
        alkoholose = false;
    }

    if (alkoholose == true) {
        if (document.getElementById('alap').value == '') {
            hiba = false;
            //alert('ne hagyja üresen a koktél alapját!');
        }
    }
    //összetevők összeszedése
    let osszetevok = document.getElementById('osszetevoDiv').children;
    if (osszetevok.length == 0) 
    {
        hiba = false;
    }
    let osszetevoLista = [];
    for (let i = 0; i < osszetevok.length; i++) {
        console.log(i);
        let osszetevoAdatok = osszetevok[i].children;
        let osszetevo = {};
        let lista = [];
        for (let j = 0; j < osszetevoAdatok.length - 1; j++) {
            let kinyertOsszetevo = osszetevoAdatok[j].value;
            let KinyertId = osszetevoAdatok[j].id;
            lista.push(kinyertOsszetevo);

            console.log(lista);
        }
        osszetevoLista.push(lista);
        console.log(osszetevoLista);
    }

    //leiras kiszedese
    let leiras = document.getElementById('leiras').value;
    if (leiras == '') {
        hiba = false;
    }

    //badgek kiszedése
    let kinyertEro;
    let kinyertIz;
    let kinyertAllergen;
    let kinyertbadgeList = document.getElementsByClassName('kivalasztott');
    let kinyertErobadgeList = document.getElementsByClassName('ero');
    let kinyertIzBadgeList = document.getElementsByClassName('iz');
    console.log(kinyertbadgeList.length);

    for (let i = 0; i < kinyertbadgeList.length; i++) {
        if (kinyertbadgeList[i].classList.contains('ero')) {
            kinyertEro = kinyertbadgeList[i].innerHTML;
        } else if (kinyertbadgeList[i].classList.contains('iz')) {
            kinyertIz = kinyertbadgeList[i].innerHTML;
        } else if (kinyertbadgeList[i].classList.contains('allergen')) {
            kinyertAllergen = kinyertbadgeList[i].innerHTML;
        }
    }

    if (kinyertErobadgeList.length < 1) {//ellenörzi, hogy a felhasználó választott e erősséget
       // alert('kérem válasszon erősséget!');
        hiba = false;
    }
    console.log(kinyertErobadgeList.length);
    if (kinyertIzBadgeList.length < 1) {//ellenörzi, hogy a felhasználó választott e ízt
       // alert('kérem válasszon ízt!');
        hiba = false;
    }
    console.log(kinyertIzBadgeList.length);
    let KoktelAdatok;

    KoktelAdatok = {//alapvető postobjekt, nem tartalmazza az allergent
        nev: document.getElementById('nev').value,
        mennyiseg: document.getElementById('mennyiseg').value,
        alap: document.getElementById('alap').value,
        alkoholose: alkoholose,
        osszetevok: osszetevoLista,
        leiras: leiras,
        erosseg: kinyertEro,
        iz: kinyertIz,
        kepUtvonala: kepUtvonal.message
    };
    console.log("asdfmiaeftuiaenftiuoejfgi")
    if (kinyertbadgeList.length == 3)
     {
        KoktelAdatok.allergen = kinyertAllergen; //ha harom badget valasztott a felhasznalo akkor itt az allergent hozzaadjuk a postobjekthez
        console.log("kalap")
    }
   
    //hibátlan kitöltés esetén elküldjük az értékeket
    if (hiba == true) 
    {
        console.log(KoktelAdatok);
        const data = await AdatPost('/api/Keszites/Feltoltes', KoktelAdatok);
    }
    else if(hiba == false)
    {
     alert("kérem töltse ki a hiányzó adatokat")
        document.getElementById("Ujra").style.display ="block"
     document.getElementById("hiba").style.display ="block"
     document.getElementById("siker").setAttribute("hidden",true)
     document.getElementById("elkuld").setAttribute("hidden",true)
     document.getElementById("visszaGomb").setAttribute("hidden",true)
};

//elküldés


//megse gomb törlés függvény



//uj koktel gomb funkcioja

document.getElementById("visszaGomb").addEventListener("click",()=>{
    window.location.reload();
})
document.getElementById("Ujra").addEventListener("click",()=>{
    window.location.reload();
})

//Egy badge választási lehetoseg eseten:
/* if (KivalasztottEro.classList.contains("text-bg-dark")) {
             KivalasztottEro.classList.remove("text-bg-dark")
        }
       
        else{KivalasztottEro.classList.add("text-bg-dark")}*/




}
