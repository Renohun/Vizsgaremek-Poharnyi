

//FETCK-ek
const TermekLekeres = async (url) => {
    try {
        const valasz = await fetch(url);
        if (valasz.ok) {
            return valasz.json();
        }
    } catch (error) {
        throw new Error(error);
    }
};

const KosarPost = async (url,object) => {
    try {
        const valasz = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object)
        });
        if (valasz.redirected) {
            window.location.href = valasz.url;
        }
        if (valasz.ok) {
            return valasz.json();
        }
    } catch (error) {
        throw new Error(error);
    }
};

const TermekKepLekeres = async (url) => {
    try {
        const valasz = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'image/jpeg' }
        });
        if (valasz.ok) {
            return valasz.blob();
        }
    } catch (error) {
        throw new Error(error);
    }
};
const SzuresPost = async (url, data) => {
    try {
        const ertek = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (ertek.ok) {
            return ertek.json();
        } else {
            console.log('hiba');
        }
    } catch (error) {
        console.error(error);
    }
};

//
//
//
//Sliderek és selectek feltöltése
//
//
//

const Sliderek = async () => {
    var slider1 = document.getElementById('arRange');
    var output1 = document.getElementById('maxAr');
    var slider2 = document.getElementById('AlkRange');
    var output2 = document.getElementById('maxAlk');
    const data = await TermekLekeres('/api/WebShop/TermekLekeres');
    //ertekek kinyerese listaba
    let ar = [];
    let alk = [];
    for (let i = 0; i < data.data.length; i++) {
        ar.push(data.data[i].Ar);
        if (data.data[i].TermekAlkoholSzazalek != 0) {
            alk.push(data.data[i].TermekAlkoholSzazalek);
        }
    }
    //nagyság szerinti rendezés
    ar.sort((a, b) => a - b);
    alk.sort((a, b) => a - b);
    slider1.setAttribute('min', ar[0]);
    slider1.setAttribute('max', ar[ar.length - 1]);
    slider1.setAttribute('value', ar[ar.length - 1]);
    output1.value = ar[ar.length - 1];

    //slider2
    slider2.setAttribute('value', alk[alk.length - 1]);
    output2.value = alk[alk.length - 1];
    slider2.setAttribute('min', alk[0]);
    slider2.setAttribute('max', alk[alk.length - 1]);

    slider1.addEventListener('input', () => {
        output1.value = slider1.value;
    });
    slider2.addEventListener('input', () => {
        output2.value = slider2.value;
    });
    //eventlistener
    output1.addEventListener('change', () => {
        //minimum maximum érték ellenörzése
        if (output1.value < ar[0]) {
            output1.value = ar[0];
            slider1.value = ar[0];
        } else if (output1.value > ar[ar.length - 1]) {
            output1.value = ar[ar.length - 1];
            slider1.value = ar[ar.length - 1];
        } else {
            slider1.value = output1.value;
        }
    });
    output2.addEventListener('change', () => {
        //alkohol %-nál
        if (output2.value < alk[0]) {
            output2.value = alk[0];
            slider2.value = alk[0];
        } else if (output2.value > alk[alk.length - 1]) {
            output2.value = alk[alk.length - 1];
            slider2.value = alk[alk.length - 1];
        } else {
            slider2.value = output2.value;
        }
    });
};
const SelectFeltolt = (data, Select1, Select2, Select3, Select4, Select5) => {
    let alapOption1 = document.createElement('option');
    alapOption1.setAttribute('value', '-');
    alapOption1.setAttribute('id', 'AlapOrszagOption');
    alapOption1.innerHTML = '-';
    Select1.appendChild(alapOption1);
    //2.Option
    let alapOption2 = document.createElement('option');
    alapOption2.setAttribute('value', '-');
    alapOption2.setAttribute('id', 'AlapMarkaOption');
    alapOption2.innerHTML = '-';
    Select2.appendChild(alapOption2);
    //3.Option
    let alapOption3 = document.createElement('option');
    alapOption3.setAttribute('value', '-');
    alapOption3.setAttribute('selected', 'true');
    alapOption3.setAttribute('id', 'AlapKategOption');
    alapOption3.innerHTML = '-';
    Select3.appendChild(alapOption3);
    //4.Option
    let alapOption4 = document.createElement('option');
    alapOption4.setAttribute('value', '-');
    alapOption4.setAttribute('selected', 'true');
    alapOption4.setAttribute('id', 'AlapKiszerelesOption');
    alapOption4.innerHTML = '-';
    Select4.appendChild(alapOption4);
    //5.Option
    let alapOption5 = document.createElement('option');
    alapOption5.setAttribute('value', '-');
    alapOption5.setAttribute('selected', 'true');
    alapOption5.setAttribute('id', 'AlapUrtartalomOption');
    alapOption5.innerHTML = '-';
    Select5.appendChild(alapOption5);

    let kategoria = [];
    let Orszag = [];
    OrszagId = [];
    let Marka = [];
    let kiszereles = [];
    let urtartalom = [];
    for (let i = 0; i < data.data.length; i++) {
        //orszag kivalasztasa
        if (!Orszag.includes(data.data[i].OrszagNev)) {
            Orszag.push(data.data[i].OrszagNev);
            OrszagId.push(data.data[i].TermekSzarmazas)
        }
        //Márka kivalasztasa
        if (!Marka.includes(data.data[i].TermekMarka)) {
            Marka.push(data.data[i].TermekMarka);
        }
        //Kategoriak kivalasztasa
        if (!kategoria.includes(data.data[i].TermekKategoria)) {
            kategoria.push(data.data[i].TermekKategoria);
        }
        //Kiszereles kivalasztasa
        if (!kiszereles.includes(data.data[i].TermekKiszereles)) {
            kiszereles.push(data.data[i].TermekKiszereles);
        }
        //urtartalom kivalasztasa
        if (!urtartalom.includes(data.data[i].TermekUrtartalom)) {
            urtartalom.push(data.data[i].TermekUrtartalom);
        }
    }
    //kategoria select feltoltese
    for (let i = 0; i < kategoria.length; i++) {
        let option3 = document.createElement('option');
        option3.setAttribute('value', kategoria[i]);
        option3.innerHTML = kategoria[i];
        option3.setAttribute('id', `kategoria${i}`);
        Select3.appendChild(option3);
    }
    //marka select feltoltese
    for (let i = 0; i < Marka.length; i++) {
        let option2 = document.createElement('option');
        option2.setAttribute('value', Marka[i]);
        option2.innerHTML = Marka[i];
        option2.setAttribute('id', `Marka${i}`);
        Select2.appendChild(option2);
    }
    //orszag select feltoltese
    for (let i = 0; i < Orszag.length; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', OrszagId[i]);
        option.innerHTML = Orszag[i];
        option.setAttribute('id', `szarmazas${i}`);
        Select1.appendChild(option);
    }
    //kiszereles select feltoltese
    for (let i = 0; i < kiszereles.length; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', kiszereles[i]);
        option.innerHTML = kiszereles[i];
        option.setAttribute('id', `kiszereles${i}`);
        Select4.appendChild(option);
    }
    //urtartalom select feltoltese
    for (let i = 0; i < urtartalom.length; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', urtartalom[i]);
        option.innerHTML = urtartalom[i];
        option.setAttribute('id', `urtartalom${i}`);
        Select5.appendChild(option);
    }
};

//
//
//Kártya Generálás
//
//

const kartyaGen = async (data, hova) => {
    console.log(data)
    for (let i = 0; i < data.data.length; i++) {
        const oszlop = document.createElement('div');
        oszlop.classList.add(
            'col-10',
            'col-sm-10',
            'col-md-6',
            'col-lg-6',
            'col-xl-3',
            'col-xxl-3',
            'mb-1',
            'kartyaOszlop'
        );
        hova.appendChild(oszlop);

        let kartyaMain = document.createElement('div');
        kartyaMain.classList.add('card', 'kartya');
        kartyaMain.setAttribute('id', `kartya${i}`);
        oszlop.appendChild(kartyaMain);

        let img = document.createElement('img');
        const kartyaKep = await TermekKepLekeres(`/api/AdatlapLekeres/Keplekeres/${data.data[i].TermekKepUtvonal}`);

        img.addEventListener('click', () => {
            window.location.href = `/Termek/${data.data[i].TermekID}`;
        });

        const kepURL = URL.createObjectURL(kartyaKep);
        img.setAttribute('src', kepURL);
        img.classList.add('card-img-top', 'kartyakep');
        kartyaMain.appendChild(img);

        let KartyaBody = document.createElement('div');
        KartyaBody.classList.add('card-body', 'kartyaBody');
        KartyaBody.setAttribute('id', `KartyaBody${i}`);
        kartyaMain.appendChild(KartyaBody);

        KartyaBody.addEventListener('click', () => {
            window.location.href = `/Termek/${data.data[i].TermekID}`;
        });

        let KartyaCim = document.createElement('h5');
        KartyaCim.classList.add('card-title', 'kartyaCim');
        KartyaCim.setAttribute('id', `KartyaCim${i}`);
        KartyaCim.innerHTML = data.data[i].TermekCim;
        KartyaBody.appendChild(KartyaCim);

        let adatDiv = document.createElement('div');
        adatDiv.classList.add('adatDiv');
        adatDiv.setAttribute('id', `KartyaAdatok${i}`);
        KartyaBody.appendChild(adatDiv);

        //adatok kiírása
        //értékelés
        let ertDiv = document.createElement('div');
        ertDiv.classList.add('ertDiv');
        adatDiv.appendChild(ertDiv);

        for (let i = 0; i < 5; i++) {
            let ErtP = document.createElement('p');
            ErtP.innerHTML = '☆';
            ErtP.classList.add('ErtP');
            ertDiv.appendChild(ErtP);
        }
        const Ertek = await TermekLekeres(`/api/TermekErtekeles/${data.data[i].TermekID}`);
        for (let i = 0; i < Ertek.ert; i++) 
        {
            ertDiv.children[i].innerHTML = '★'; //a kiszámolt értékig átirjuk a csillagokat
        } 
        let ertszam = document.createElement("p")
        ertszam.innerHTML = `(${Ertek.szam})`
        ertDiv.appendChild(ertszam)
        //kateg
        let div1 = document.createElement('div');
        div1.classList.add('kulondiv');
        let tipus = document.createElement('p');
        tipus.classList.add('kuloncim');
        tipus.innerHTML = 'Kategória';
        div1.appendChild(tipus);
        let tipusertek = document.createElement('p');
        tipusertek.classList.add('kulonErtek');
        tipusertek.innerHTML = data.data[i].TermekKategoria;
        div1.appendChild(tipusertek);
        adatDiv.appendChild(div1);
        //szarmazas
        let div2 = document.createElement('div');
        div2.classList.add('kulondiv');
        let szarmazas = document.createElement('p');
        szarmazas.classList.add('kuloncim');
        szarmazas.innerHTML = 'Származás';
        div2.appendChild(szarmazas);
        let szarmazasertek = document.createElement('p');
        szarmazasertek.classList.add('kulonErtek');
        szarmazasertek.innerHTML = data.data[i].OrszagNev;
        div2.appendChild(szarmazasertek);
        adatDiv.appendChild(div2);
        //marka
        let div3 = document.createElement('div');
        div3.id = 'kulondiv3';
        div3.classList.add('kulondiv');
        let marka = document.createElement('p');
        marka.classList.add('kuloncim');
        marka.innerHTML = 'Márka';
        div3.appendChild(marka);
        let markaErtek = document.createElement('p');
        markaErtek.classList.add('kulonErtek');
        markaErtek.innerHTML = data.data[i].TermekMarka;
        div3.appendChild(markaErtek);
        adatDiv.appendChild(div3);

        let ar = document.createElement('h4');
        ar.classList.add('ar');
        ar.setAttribute('id', `${i}kartyaId`);
        ar.innerHTML = data.data[i].Ar + 'Ft';
        adatDiv.appendChild(ar);

        if (data.data[i].TermekDiscount != null) {
            ar.style.textDecoration = 'line-through';
            let akcio = 100 - data.data[i].TermekDiscount;
            let AkciosAr = Math.round(((data.data[i].Ar/100)*akcio)/10)*10
            let AkciosArHely = document.createElement('h5');
            AkciosArHely.innerHTML = AkciosAr + 'Ft';
            AkciosArHely.style.color = 'red';
            adatDiv.appendChild(AkciosArHely);
        }

        let kosarba = document.createElement('button');
        kosarba.classList.add('btn', 'kartyaGomb');
        kartyaMain.appendChild(kosarba);
        if (data.data[i].TermekKeszlet == 0) 
        {
            kosarba.innerHTML = "Nincs Raktáron"
            kosarba.style.backgroundColor = "red"
            kosarba.style.color = "white"
            kosarba.disabled = true;    
        }
        else{
        kosarba.innerHTML = 'Kosárba';
         kosarba.addEventListener('click', async () => {
            const valasz = await KosarPost(`/api/KosarKuldes`,{id : data.data[i].TermekID, mennyiseg : "egy"});
           
            if (valasz.Siker == undefined) 
            {
                modalHiba(true)
            }
            else
            {
                modalJo()
            }
        });
        }
    }
};

//
//  szűrési adatok kinyerése
//

async function szures() {
    let OrszagSelect = document.getElementById('OrszagSelect');
    let NevKereses = document.getElementById("NevKereses")
    let MarkaSelect = document.getElementById('MarkaSelect');
    let KategoriaSelect = document.getElementById('KategoriaSelect');
    let RendezesSelect = document.getElementById('RendezesSelect');
    let kiszerelesSelect = document.getElementById('KiszerelesSelect');
    let UrtartalomSelect = document.getElementById('UrtartalomSelect');
    let szuresiAdatok = {};
    //KartyaHova.innerHTML = ""
    let arSlider = document.getElementById('arRange');
    let alkoholSlider = document.getElementById('AlkRange');

    //max ár hozzaadasa
    szuresiAdatok.MaxAr = arSlider.value;
    //max alkoholtartalom hozáaadása
    if(NevKereses.value != "")
    {
        szuresiAdatok.Nev = "%"+NevKereses.value+"%"
    }
    else
    {
        szuresiAdatok.Nev = "%"
    }
    if (KategoriaSelect.value == 'alkohol') {
        szuresiAdatok.MaxAlk = alkoholSlider.value;
    }
    //selectek hozzáadása
    if (OrszagSelect.value != '-') {
        szuresiAdatok.TermekSzarmazas = OrszagSelect.value;
    }

    if (MarkaSelect.value != '-') {
        szuresiAdatok.TermekMarka = MarkaSelect.value;
    }

    if (KategoriaSelect.value != '-') {
        szuresiAdatok.TermekKategoria = KategoriaSelect.value;
    }

    if (kiszerelesSelect.value != '-') {
        szuresiAdatok.TermekKiszereles = kiszerelesSelect.value;
    }

    if (UrtartalomSelect.value != '-') {
        szuresiAdatok.TermekUrtartalom = UrtartalomSelect.value;
    }
    //akcios-e?
    let akcio = document.getElementById('AkcioseCheck');
    if (akcio.checked == true) {
        szuresiAdatok.akcio = true;
    }
    szuresiAdatok.rendezes = RendezesSelect.value;
    return szuresiAdatok;
}

//
//Keresés
//

const kereses = async () => {
    const keresendoSzo = document.getElementById('NevKereses').value;
    if (keresendoSzo == '') {
        modalHiba("",true)
    } else {
        let KartyaHova = document.getElementById('kartyaSor');
        KartyaHova.textContent = '';

        const dataHossz = await TermekLekeres(
            `/api/WebShop/TermeklekeresByNev/${keresendoSzo}?limit=${1000}&offset=${0}`
        );
        TermekBetoltes(1, dataHossz.data.length, false, '', true);
        
    }
};

//
//
// PAGINATION
//
//

//a két pagination fuggvenyhez szükséges globális változok
const limit = 16;
let jelenlegiOldal = 1;

const paginationHely = document.getElementById('pagination');

const TermekBetoltes = async (jelenOldal = 1, hossz, szurtE = false, szuresiAdatok, NevSzerinti) => {
    jelenlegiOldal = jelenOldal;
    console.log(jelenOldal)
    let KartyaHova = document.getElementById('kartyaSor');
    KartyaHova.innerHTML = '';

    let oldalszam = Math.ceil(hossz / limit);

    let offset = (jelenOldal - 1) * limit;

    if (!szurtE && !NevSzerinti) {
        const data = await TermekLekeres(`/api/WebShop/TermekLekeresPag?limit=${limit}&offset=${offset}`);
        KartyaHova.classList.remove("kozep")
        await kartyaGen(data, KartyaHova);
        PaginationGombok(false, hossz);
    } 
    else if (szurtE == true && !NevSzerinti) 
    {
        const szurtdata = await SzuresPost(`/api/Webshop/szures?limit=${limit}&offset=${offset}`, szuresiAdatok);
        if (szurtdata.hossz == 0) 
        {
            let h1 = document.createElement("h1")
            h1.innerHTML ="Nincs a keresésnek megfelelő termék!"
            h1.classList.add("UresTermek")
            KartyaHova.appendChild(h1)
            let img = document.createElement("img")
            img.src = "../WebShopMain/img/Szabadsag3__1_of_1_-removebg-preview.png"
            img.classList.add("img-fluid","mx-auto","uresKep")
            KartyaHova.appendChild(img)
            KartyaHova.classList.add("kozep")
        }
        await kartyaGen(szurtdata, KartyaHova);
        PaginationGombok(true, hossz, szuresiAdatok);
    } 
        else if (NevSzerinti == true && !szurtE) {
        const keresendoSzo = document.getElementById('NevKereses').value;
        const data = await TermekLekeres(
            `/api/WebShop/TermeklekeresByNev/${keresendoSzo}?limit=${limit}&offset=${offset}`
        );
        if (data.data.length == 0) 
        {
            let h1 = document.createElement("h1")
            h1.innerHTML ="Nincs a keresésnek megfelelő termék!"
            h1.classList.add("UresTermek")
            KartyaHova.appendChild(h1)
            let img = document.createElement("img")
            img.src = "../WebShopMain/img/Szabadsag3__1_of_1_-removebg-preview.png"
            img.classList.add("img-fluid","mx-auto","uresKep")
            KartyaHova.appendChild(img)
            KartyaHova.classList.add("kozep")    
        }
        await kartyaGen(data, KartyaHova);
        PaginationGombok(false, hossz, '', true);
    }
    window.location.hash = `page${jelenOldal}`;
};

const gombHozzaAdas = (hova, oldalszam, szurtE, szuresiAdatok, hossz, NevSzerinti) => {
    const PagGomb = document.createElement('button');
    PagGomb.classList.add('PageGomb');
    PagGomb.innerHTML = oldalszam;

    if (oldalszam === jelenlegiOldal) {
        PagGomb.style.fontWeight = 'bold';
        PagGomb.style.backgroundColor = '#c2c2c2';
    }

    if (!szurtE && !NevSzerinti) {
        PagGomb.addEventListener('click', () => TermekBetoltes(oldalszam, hossz));
        hova.appendChild(PagGomb);
    } else if (szurtE && !NevSzerinti) {
        PagGomb.addEventListener('click', () => TermekBetoltes(oldalszam, hossz, true, szuresiAdatok));
        hova.appendChild(PagGomb);
    } else if (NevSzerinti && !szurtE) {
        PagGomb.addEventListener('click', () => TermekBetoltes(oldalszam, hossz, false, '', true));
        hova.appendChild(PagGomb);
    }
};

const PaginationGombok = async (SzurtE, hossz, szuresiAdatok, NevSzerinti) => {
    //oldalhosszok

    let oldalszam = Math.ceil(hossz / 16)
    const paginationHely = document.getElementById('pagination');
    paginationHely.innerHTML = '';

    let elsogomb = Math.max(1, jelenlegiOldal - 2); //kiszámoljuk, hogy melyik legyen az első gomb amit megjelenitunk.
    //  az elso(1) és a jelenlegi oldal -2 között, erre azért van szükség, mert mindig a jelenlegi előtt 2-t mutatunk meg, és így biztosan nem lehet negatív ez a szám
    let utolsoGomb = Math.min(oldalszam, jelenlegiOldal + 2);//ugyanaz csak forditva

    //első oldal a gombok között
    if (elsogomb > 1) {
        gombHozzaAdas(paginationHely, 1, SzurtE, szuresiAdatok, hossz, NevSzerinti);
         paginationHely.append('...');
        
    }
    //köztes oldalak
    for (let i = elsogomb; i <= utolsoGomb; i++) {
        gombHozzaAdas(paginationHely, i, SzurtE, szuresiAdatok, hossz, NevSzerinti);
    }
    //uolso oldal
    if (utolsoGomb < oldalszam) {
        if (utolsoGomb < oldalszam) {
            paginationHely.append('...');
        }
        gombHozzaAdas(paginationHely, oldalszam, SzurtE, szuresiAdatok, hossz, NevSzerinti);
    }
};

//
//
// OLDAL BETÖLTÉSE ESTÉN LEFUTÓ KÓD
//
//

document.addEventListener('DOMContentLoaded', async () => {
    //első 16 termék lekérése
    TermekHossz = await TermekLekeres(`/api/WebShop/HosszLekeres`);
    const data = await TermekBetoltes(1, TermekHossz.data);

    //sliderek Feltöltése
    Sliderek();

    //Selectek feltöltése
    const dataSzures = await TermekLekeres(`/api/WebShop/TermekLekeres`);
    let OrszagSelect = document.getElementById('OrszagSelect');
    let MarkaSelect = document.getElementById('MarkaSelect');
    let KategoriaSelect = document.getElementById('KategoriaSelect');
    let RendezesSelect = document.getElementById('RendezesSelect');
    let kiszerelesSelect = document.getElementById('KiszerelesSelect');
    let UrtartalomSelect = document.getElementById('UrtartalomSelect');
    SelectFeltolt(dataSzures, OrszagSelect, MarkaSelect, KategoriaSelect, kiszerelesSelect, UrtartalomSelect);
    OrszagSelect.addEventListener('change', () => {}); //alkohol ellernörzés

    let alkoholcsuszka = document.getElementById('alkoholTart');
    let urtalrtalom = document.getElementById('Urtartalom');
    KategoriaSelect.addEventListener('change', () => {
        //alkohol-e?
        if (
            KategoriaSelect.value == 'Szirup' ||
            KategoriaSelect.value == 'Merch' ||
            KategoriaSelect.value == 'Pohar' ||
            KategoriaSelect.value == '-'
        ) {
            alkoholcsuszka.classList.add('eltunt');
        } else {
            alkoholcsuszka.classList.remove('eltunt');
        }
        if (KategoriaSelect.value == 'Eszkoz' || KategoriaSelect.value == 'Merch' || KategoriaSelect.value == '-') {
            urtalrtalom.classList.add('eltunt');
        } else {
            urtalrtalom.classList.remove('eltunt');
        }
    });

    //Név Szerinti Keresés
    let keresoGomb = document.getElementById('keresesBtn');
    keresoGomb.addEventListener('click', kereses);

    //szűrés meghívása
    let SzuresGomb = document.getElementById('kuldesGomb');
    SzuresGomb.addEventListener('click', async () => {
        const adatok = szures();
        const szurtDataHossz = await SzuresPost(`/api/Webshop/szures?limit=${100}&offset=${0}`, await adatok);
        TermekBetoltes(1, szurtDataHossz.hossz, true, await adatok);
        szuresiAdatok = {};
    });
    let kosarGomb = document.getElementById("tovabb")
    kosarGomb.addEventListener("click",()=>{
        window.location.href = `/Adatlap#Kosar`
    })
});
const modalHiba = (hiba, keres)=>{
//hibás kitöltés kezelése
        if (keres == true)
        {
            document.getElementById('vissza').style.display = 'block';
            document.getElementById('Kereshiba').style.display = 'block';
            document.getElementById('siker').setAttribute('hidden', true);
            document.getElementById('tovabb').setAttribute('hidden', true);
        }
        else
        {
            document.getElementById('vissza').style.display = 'block';
            document.getElementById('Sokhiba').style.display = 'block';
            document.getElementById('siker').setAttribute('hidden', true);
            document.getElementById('tovabb').setAttribute('hidden', true);
        }
         hiba = false;
         let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
         modal.show();
}
const modalJo = ()=>{
//hibás kitöltés kezelése
        
    document.getElementById('Sokhiba').style.display = 'none';
    document.getElementById('vissza').style.display = 'none';
    document.getElementById('Kereshiba').style.display = 'none';
    document.getElementById('siker').removeAttribute('hidden',false);
    document.getElementById('tovabb').removeAttribute('hidden', true);
     let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
     modal.show();
}