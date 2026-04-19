//Globális változók létrehozása
let gombnyomasszam = 1;
let KivalasztottAllergenek = [];
let KivalasztottIzek = [];
//
//Lekérések
//
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
        if(ertek.status == "208")
        {
            return "hiba"
        }
        else if (ertek.ok) {
            return ertek.json();
        } else {
            console.error(ertek.statusText);
        }
    } catch (error) {
        console.error(error);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    //új összetevő meghívására szolgáló gomb értékadása
    let osszetevogomb = document.getElementById('osszetevogomb');
    OsztvDisable()
    let osszetevodiv = document.getElementById('osszetevoDiv');
    //addeventlistener hozzáaadása
    osszetevogomb.addEventListener('click', osszetevohozzaadas);

    // megse gomb létrehozása és listener hozzáadása
    function megsefugv() {
        //alert('sikeres törlés!');
        window.location.reload();
    }

    document.getElementById('Ujra').addEventListener('click', () => {
        window.location.reload();
    });
    let megsegomb = document.getElementById('megse');
    megsegomb.addEventListener('click', megsefugv);
    //radiogombok értékének lekérése
    let radioMentes = document.getElementById('mentes');
    let radioAlk = document.getElementById('alkoholos');
    //melyik radiobutton van kiválasztva, ás attól függően eltüntetjük vagy visszahozzuk az alap div tartalmát

    radioAlk.addEventListener('change', () => {
        if (radioAlk.checked == true) {
            let alap = document.getElementById('alapEltuntet');
            alap.hidden = false;
        }
    });
    radioMentes.addEventListener('change', () => {
        if (radioMentes.checked == true) {
            let alapInput = document.getElementById('alap');
            let alap = document.getElementById('alapEltuntet');
            alap.hidden = true;
            alapInput.value = '';
        }
    });
    //elso osztv törlése
    let osszetevo = document.getElementById('osztv1');
    osszetevo.addEventListener('click', () => {
        let elsoOsztv = document.getElementById('elsoOsszetevo');
        osszetevodiv.removeChild(elsoOsztv);
        console.log('kala');
    });
    //adott pixelszám alatti classok addolasa
    if (window.innerWidth < 992) {
        document.getElementById('drop-area').classList.add('mx-auto');
    } else if (window.innerWidth > 992) {
        document.getElementById('drop-area').classList.remove('mx-auto');
    }
    window.addEventListener('resize', () => {
        if (window.innerWidth < 992) {
            document.getElementById('drop-area').classList.add('mx-auto');
        } else if (window.innerWidth > 992) {
            document.getElementById('drop-area').classList.remove('mx-auto');
        }
    });
    document.getElementById('kuldes').addEventListener('click', AdatStorage);
});

//új összetevő hozzáadása function(alfa lol)
function osszetevohozzaadas() {
    gombnyomasszam++;
   
    //új összetevő input mezőjének létrehozása DOM segítségével és bootstrap osztályok hozzáadása
    let osszetevoform = document.createElement('form');
    let osszetevodiv = document.getElementById('osszetevoDiv');
    let torlesgomb = document.createElement('button');
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
    OsztvDisable()
    
    //torles
    torlesgomb.addEventListener('click', () => {
        osszetevodiv.removeChild(col);
       OsztvDisable()
    });
}

//
// összetevőfgvk
//

const OsztvDisable = ()=>{
let osszetevodiv = document.getElementById("osszetevoDiv")
if (osszetevodiv.children.length == 1) 
    {
        osszetevodiv.children[0].children[3].disabled = "true"
    }
    else if(osszetevodiv.children.length > 1)
    {
        osszetevodiv.children[0].children[3].disabled = false
    }
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

    //jelvenyek dinamikus létrehozasa:
    const jelvenyHely1 = document.getElementById('eroDiv');
    const jelvenyHely2 = document.getElementById('izDiv');
    const jelvenyHely3 = document.getElementById('allergenDiv');

    //erősség
    for (let i = 0; i < data.erosseg.length; i++) {
        let badge = document.createElement('span');
        badge.innerText = data.erosseg[i].JelvényNeve;
        badge.classList.add('badge', 'text-bg-secondary', 'sajatBadge', 'erobadge');
        badge.setAttribute('id', `eroBadge${i}`);
        jelvenyHely1.appendChild(badge);
    }
    //ízek
    for (let i = 0; i < data.iz.length; i++) {
        let badge = document.createElement('span');
        badge.innerText = data.iz[i].JelvényNeve;
        badge.classList.add('badge', 'text-bg-secondary', 'sajatBadge', 'izbadge');
        badge.setAttribute('id', `izBadge${i}`);
        jelvenyHely2.appendChild(badge);
    }
    //Allergének
    for (let i = 0; i < data.allergen.length; i++) {
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

    for (let i = 0; i < data.iz.length; i++) {
        izBadgek.push(document.getElementById(`izBadge${i}`));
    }

    //bejárom a tömböt amiben a badg-ek vannak és rájuk rakom a click eseményfigylőt
    for (let i = 0; i < izBadgek.length; i++) {
        const Izbadge = izBadgek[i];

        const Izclick = () => {
            let valasztottIz = Izbadge;
            if (izBadgek[i].classList.contains('kivalasztott')) {
                izBadgek[i].classList.remove('text-bg-dark');
                valasztottIz.classList.remove('kivalasztott', 'iz');
                let index = KivalasztottIzek.indexOf(izBadgek[i]);
                KivalasztottIzek.splice(index, 1);
            } else {
                Izbadge.classList.add('text-bg-dark');
                valasztottIz.classList.add('text-bg-dark');
                valasztottIz.classList.add('kivalasztott', 'iz');
                KivalasztottIzek.push(Izbadge.innerHTML);
            }
        };

        Izbadge.addEventListener('click', Izclick);
    }

    //
    //
    //Allergének
    //
    //

    const allergenBadgek = [];

    for (let i = 0; i < data.iz.length; i++) {
        allergenBadgek.push(document.getElementById(`allergenBadge${i}`));
    }

    //bejárom a tömböt amiben a badg-ek vannak és rájuk rakom a click eseményfigylőt
    for (let i = 0; i < allergenBadgek.length; i++) {
        const allergenbadge = allergenBadgek[i];

        const allergenClick = () => {
            let valasztottallergen = allergenbadge;
            if (allergenBadgek[i].classList.contains('kivalasztott')) {
                allergenBadgek[i].classList.remove('text-bg-dark');
                valasztottallergen.classList.remove('kivalasztott', 'iz');
                let index = KivalasztottAllergenek.indexOf(allergenBadgek[i]);
                KivalasztottAllergenek.splice(index, 1);
            } else {
                allergenbadge.classList.add('text-bg-dark');
                valasztottallergen.classList.add('text-bg-dark');
                valasztottallergen.classList.add('kivalasztott', 'allergen');
                KivalasztottAllergenek.push(allergenbadge.innerHTML);
            }
        };

        allergenbadge.addEventListener('click', allergenClick);
    }
};
Izlekeres();

//adatok kiküldése az adatbazisba

const AdatStorage = async () => {
    let data;
    let hiba = true;
    let egyezoMl = true;
    document.getElementById('Ujra').style.display = 'none';
    document.getElementById('hiba').style.display = 'none';
    document.getElementById('hiba').innerHTML = "Kérem töltse ki a Hiányzó adatokat!"
    document.getElementById('vissza').style.display = 'none';
    document.getElementById('siker').removeAttribute('hidden',false);
     document.getElementById('siker').innerHTML = "A koktélt sikeresen feltöltötte!"
    document.getElementById('visszaGomb').removeAttribute('hidden', false);
    document.getElementById('tovabb').removeAttribute('hidden', true);
    //alap adatok kitöltésének ellenörzése
    if (document.getElementById('nev').value == '') {
        hiba = false;
    }
    if (document.getElementById('mennyiseg').value == '') {
        hiba = false;
    }

    //képfeltöltés

    let kepUtvonal;
    const kep = new FormData();
    if (inputFile.files.length != 0) {
        if (
            inputFile.files[0].type != 'image/jpeg' &&
            inputFile.files[0].type != 'image/png' &&
            inputFile.files[0].type != 'image/bmp' &&
            inputFile.files[0].type != 'image/webp'
        ) {
            hiba = false;
        } else {
            kep.append('profilkep', inputFile.files[0]);
            kepUtvonal = await AdatPostKep('/api/AdatlapLekeres/KepFeltoltes', kep);
        }
    } else {
        hiba = false;
    }

    //alkoholose
    let alkoholose;
    let radioMentes = document.getElementById('mentes');
    let radioAlk = document.getElementById('alkoholos');
    if (radioAlk.checked == true) {
        alkoholose = true;
    } else if (radioMentes.checked == true) {
        alkoholose = false;
    }

    if (alkoholose == true) {
        if (document.getElementById('alap').value == '') {
            hiba = false;
        }
    }
    //összetevők összeszedése
    let osszetevok = document.getElementById('osszetevoDiv').children;
    if (osszetevok.length == 0) {
        hiba = false;
    }
    let osszetevoLista = [];
    for (let i = 0; i < osszetevok.length; i++) {
        let osszetevoAdatok = osszetevok[i].children;
        let osszetevo = {};
        let lista = [];
        for (let j = 0; j < osszetevoAdatok.length - 1; j++) {
            let kinyertOsszetevo = osszetevoAdatok[j].value;
            let KinyertId = osszetevoAdatok[j].id;
            lista.push(kinyertOsszetevo);
        }
        osszetevoLista.push(lista);
    }
    //mennyiségEllenőrzés
    let Ujmennyiseg = 0;
    for (let i = 0; i < osszetevoLista.length; i++) 
        {
            if (osszetevoLista[i][2] == "ml" || osszetevoLista[i][2] == "ML") 
            {
                Ujmennyiseg += parseInt(osszetevoLista[i][1])
            }
        }

    if (Ujmennyiseg != document.getElementById('mennyiseg').value) 
    {
        hiba = false;
        egyezoMl = false
    }
    //leiras kiszedese
    let leiras = document.getElementById('leiras').value;
    if (leiras == '') {
        hiba = false;
    }

    //badgek kiszedése
    let kinyertEro;

    let kinyertbadgeList = document.getElementsByClassName('kivalasztott');
    let kinyertErobadgeList = document.getElementsByClassName('ero');
   

    for (let i = 0; i < kinyertbadgeList.length; i++) {
        if (kinyertbadgeList[i].classList.contains('ero')) {
            kinyertEro = kinyertbadgeList[i].innerHTML;
        }
    }

    if (kinyertErobadgeList.length < 1) {
        //ellenörzi, hogy a felhasználó választott e erősséget
        hiba = false;
    }
    if (KivalasztottIzek.length < 1) {
        //ellenörzi, hogy a felhasználó választott e ízt
        hiba = false;
    }
    let KoktelAdatok;
    let elkuldottEro = [kinyertEro];
    KoktelAdatok = {
        //alapvető postobjekt, nem tartalmazza az allergent
        nev: document.getElementById('nev').value,
        mennyiseg: document.getElementById('mennyiseg').value,
        alap: document.getElementById('alap').value,
        alkoholose: alkoholose,
        osszetevok: osszetevoLista,
        leiras: leiras,
        erosseg: elkuldottEro,
        iz: KivalasztottIzek
    };
    if (KivalasztottAllergenek.length > 0) {
        KoktelAdatok.allergen = KivalasztottAllergenek; //ha valasztott allergent a felhasznalo akkor hozzaadjuk a postobjekthez
    }

    //hibátlan kitöltés esetén elküldjük az értékeket
    if (hiba == true) {
        KoktelAdatok.kepUtvonala = kepUtvonal.message;
        data = await AdatPost('/api/Keszites/Feltoltes', KoktelAdatok);
        if (data == "hiba") //Ha a végpont 208-at ad vissza, akkor más hibaüzenetet jelenítünk meg.
        {
            modalHiba(true,"Nev")
            hiba = true
            egyezoMl = true
        }  
    } 
        else if (hiba == false) {
        modalHiba(egyezoMl,"sima")
        hiba = true
        egyezoMl = true
    }
    //uj koktel gomb funkcioja
    document.getElementById('visszaGomb').addEventListener('click', () => {
        window.location.reload();
    });
    // továbbítás a koktél oldalára
    document.getElementById('tovabb').addEventListener('click', () => {
        window.location.href = `Koktel/${data.feltoltottid}`;
    });
};
const modalHiba = (Ml,milyen)=>{
//hibás kitöltés kezelése
        document.getElementById('Ujra').style.display = 'block';
        document.getElementById('vissza').style.display = 'block';
        document.getElementById('hiba').style.display = 'block';
        if (Ml == false) 
        {
           document.getElementById('hiba').innerHTML += " és/vagy Kérem ügyeljen arra, hogy a megadott mililiter mennyiségek egyezzenek!"
        }
        if(milyen == "Nev"){
            document.getElementById('hiba').innerHTML = "a Koktél neve már foglalt! Kérem probálja újra más névvel!"
        }
        document.getElementById('siker').setAttribute('hidden', true);
        document.getElementById('visszaGomb').setAttribute('hidden', true);
        document.getElementById('tovabb').setAttribute('hidden', true);
        
}