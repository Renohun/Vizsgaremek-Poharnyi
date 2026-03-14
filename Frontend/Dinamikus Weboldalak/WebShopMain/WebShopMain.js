


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
const TermekKepLekeres = async (url) => {
    try {
        const valasz = await fetch(url,{
            method : "GET",
            headers:{'Content-Type':'image/jpeg'}
        });
        if (valasz.ok) {
            return valasz.blob();
        }
    } catch (error) {
        throw new Error(error);
    }
};
//? Sliderek alapértékének beállítása
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
    console.log(ar);
    console.log(alk);
    //nagyság szerinti rendezés
    ar.sort((a, b) => a - b);
    alk.sort((a, b) => a - b);
    console.log(ar);
    console.log(alk);
    slider1.setAttribute('min', ar[0]);
    slider1.setAttribute('max', ar[ar.length - 1]);
       slider1.setAttribute('value', ar[ar.length - 1]);
    output1.value = ar[ar.length-1];
  
    //slider2
    slider2.setAttribute('value', alk[alk.length-1]);
    output2.value = alk[alk.length-1];
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
            console.log(slider1.value);
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
            console.log(slider2.value);
        }
    });
};
const SelectFeltolt = (data, Select1, Select2, Select3) => {
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

    let kategoria = [];
    for (let i = 0; i < data.data.length; i++) {
        //orszagSelect
        let option = document.createElement('option');
        option.setAttribute('value', data.data[i].TermekSzarmazas);
        option.innerHTML = data.data[i].TermekSzarmazas;
        option.setAttribute('id', `szarmazas${i}`);
        Select1.appendChild(option);
        //MárkaSelect
        let option2 = document.createElement('option');
        option2.setAttribute('value', data.data[i].TermekMarka);
        option2.innerHTML = data.data[i].TermekMarka;
        option2.setAttribute('id', `Marka${i}`);
        Select2.appendChild(option2);
        //Kategoriak kivalasztasa
        if (!kategoria.includes(data.data[i].TermekKategoria)) {
            kategoria.push(data.data[i].TermekKategoria);
        }
    }
    //kategoria select feltoltese
    for (let i = 0; i < kategoria.length; i++) {
        let option3 = document.createElement('option');
        option3.setAttribute('value', kategoria[i]);
        option3.innerHTML = kategoria[i];
        option3.setAttribute('id', `Marka${i}`);
        Select3.appendChild(option3);
    }
};
//Kártya Generálás
const kartyaGen = async(data,hova)=>{

    for (let i = 0; i < data.data.length; i++) {
        const oszlop = document.createElement('div');
        oszlop.classList.add('col-8', 'col-sm-7', 'col-md-6', 'col-lg-6', 'col-xl-3', 'col-xxl-3', 'mb-1');
        hova.appendChild(oszlop);


        let kartyaMain = document.createElement("div")
        kartyaMain.classList.add("card","kartya")
        kartyaMain.setAttribute("id",`kartya${i}`)
        oszlop.appendChild(kartyaMain)

        let img = document.createElement("img")
        const kartyaKep = await TermekKepLekeres(`/api/WebShop/Keplekeres/${data.data[i].TermekID}`)
        console.log(kartyaKep)
        const kepURL = URL.createObjectURL(kartyaKep)
        img.setAttribute("src",kepURL)
        console.log(img)
        img.classList.add("card-img-top","kartyakep")
        kartyaMain.appendChild(img)

        let KartyaBody = document.createElement("div")
        KartyaBody.classList.add("card-body","kartyaBody")
        KartyaBody.setAttribute("id",`KartyaBody${i}`)
        kartyaMain.appendChild(KartyaBody)

        let KartyaCim = document.createElement("h5")
        KartyaCim.classList.add("card-title","kartyaCim")
         KartyaCim.setAttribute("id",`KartyaCim${i}`)
        KartyaCim.innerHTML = data.data[i].TermekCim
        KartyaBody.appendChild(KartyaCim)

        let adatDiv = document.createElement("div")
        adatDiv.classList.add("adatDiv")
        adatDiv.setAttribute("id",`KartyaAdatok${i}`)
        KartyaBody.appendChild(adatDiv)

        //adatok kiírása
//kateg
        let div1 = document.createElement("div")
        div1.classList.add("kulondiv")
        let tipus = document.createElement("p")
        tipus.classList.add("kuloncim")
        tipus.innerHTML = "Kategória"
        div1.appendChild(tipus)
        let tipusertek = document.createElement("p")
        tipusertek.classList.add("kulonErtek")
        tipusertek.innerHTML = data.data[i].TermekKategoria;
        div1.appendChild(tipusertek)
        adatDiv.appendChild(div1)
//szarmaza
        let div2 = document.createElement("div")
        div2.classList.add("kulondiv")
        let szarmazas = document.createElement("p")
        szarmazas.classList.add("kuloncim")
        szarmazas.innerHTML = "Származás"
        div2.appendChild(szarmazas)
        let szarmazasertek = document.createElement("p")
        szarmazasertek.classList.add("kulonErtek")
        szarmazasertek.innerHTML = data.data[i].TermekSzarmazas;
        div2.appendChild(szarmazasertek)
        adatDiv.appendChild(div2)
//marka
        let div3 = document.createElement("div")
        div3.id = "kulondiv3"
        div3.classList.add("kulondiv")
        let marka = document.createElement("p")
        marka.classList.add("kuloncim")
        marka.innerHTML = "Márka"
        div3.appendChild(marka)
        let markaErtek = document.createElement("p")
        markaErtek.classList.add("kulonErtek")
        markaErtek.innerHTML = data.data[i].TermekMarka;
        div3.appendChild(markaErtek)
        adatDiv.appendChild(div3)
        

        let ar = document.createElement("h4")
        ar.classList.add("ar")
        ar.setAttribute("id",`${i}kartyaId`)
        ar.innerHTML = data.data[i].Ar + "Ft"
        adatDiv.appendChild(ar)

        let kosarba = document.createElement("button")
        kosarba.classList.add("btn","kartyaGomb")
        kosarba.innerHTML = "kosárba"
        adatDiv.appendChild(kosarba)

    }
}
document.addEventListener('DOMContentLoaded', async () => {
    const data = await TermekLekeres('/api/WebShop/TermekLekeres');
    console.log(data);
    
    //kepek lekerese
    const kepek = await TermekKepLekeres('/api/WebShop/Keplekeres/2');
    console.log(URL.createObjectURL(kepek));
    Sliderek();
    data.data
    //Selectek feltöltése
    let OrszagSelect = document.getElementById('OrszagSelect');
    let MarkaSelect = document.getElementById('MarkaSelect');
    let KategoriaSelect = document.getElementById('KategoriaSelect');
    let RendezesSelect = document.getElementById('RendezesSelect');
    SelectFeltolt(data, OrszagSelect, MarkaSelect, KategoriaSelect);
    OrszagSelect.addEventListener('change', () => {
        console.log(OrszagSelect.value);
    });
    //alkohol ellernörzés
  
    let alkoholcsuszka = document.getElementById("alkoholTart")
    
    KategoriaSelect.addEventListener("change",()=>{
       
if(KategoriaSelect.value == "alkohol")
        {
             alkoholcsuszka.classList.remove("eltunt")
        }
        else
        {
            alkoholcsuszka.classList.add("eltunt")
        }
    } )
    //kártyák generálása
    let KartyaHova = document.getElementById("kartyaSor")
    kartyaGen(data,KartyaHova)

    //
    //szuresi adatok osszegyujtese
    //
    let SzuresGomb = document.getElementById("kuldesGomb")
    let szuresiAdatok = {};
    SzuresGomb.addEventListener("click",()=>
    {
        let arSlider = document.getElementById('arRange');
        let alkoholSlider = document.getElementById('AlkRange');
        
        //max ár hozzaadasa
        szuresiAdatok.MaxAr = arSlider.value
        //max alkoholtartalom hozáaadása
        if(KategoriaSelect.value == "alkohol")
        {
            szuresiAdatok.MaxAlk = alkoholSlider.value
        }
        //selectek hozzáadása
        if (OrszagSelect.value != "-") 
        {
            szuresiAdatok.TermekSzarmazas = OrszagSelect.value    
        }

        if (MarkaSelect.value != "-") 
        {
            szuresiAdatok.TermekMarka = MarkaSelect.value    
        }

        if (KategoriaSelect.value != "-") 
        {
            szuresiAdatok.TermekKategoria = KategoriaSelect.value    
        }

        if (RendezesSelect.value != "-") 
        {
            szuresiAdatok.rendezes = RendezesSelect.value    
        }

        //akcios-e?
        let akcio = document.getElementById("AkcioseCheck")
        if (akcio.checked == true) 
        {
            szuresiAdatok.akcio = true    
        }

        console.log(szuresiAdatok)
    })
    
    
});
 //)