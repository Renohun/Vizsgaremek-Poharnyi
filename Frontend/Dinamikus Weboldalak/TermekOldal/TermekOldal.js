
//LEKERESEK
async function GETfetch(url) {
    try {
        const data = await fetch(url);
       
        if (data.ok) {
            return await data.json();
        }
         else {
            throw new err('Hiba tortent a fetch-el');
        }
    } catch (err) {
        throw new Error(err);
    }
}
const PostFetch=async(url,object)=>{
    const valasz=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(object)
    })
      if (valasz.redirected) 
        {
            console.log("asd")
        }
    if (valasz.ok) {
        return valasz.json()
    }
}
const KosarPost = async (url,object) => {
    try {
        const valasz = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(object)
        });
        if (valasz.redirected) {
            //console.log(valasz.url);
            window.location.href = valasz.url;
        }
        if (valasz.ok) {
            return valasz.json();
        }
    } catch (error) {
        throw new Error(error);
    }
};
const TermekKepLekeres=async(url)=>{
    try {
        
        const valasz=await fetch(url,{
        method:"GET",
        headers:{"Content-Type":"image/jpg"}
    })
    if (valasz.ok) {
        return valasz.blob()
    }
        
    } 
    catch (error) 
    {
        throw new Error(error)
    }
    
}

//Függvények/Metódusok
const termek_lekeres = async () => {
    let url = window.location.href.split('/');
    let id = url[4];
  
    const data = await GETfetch(`/api/termek/lekeres/${id}`);
      console.log(data);
     return data;
   
};

const KepLekeres = async () => 
{
    let url = window.location.href.split('/');
    let id = url[4];
    console.log(id);
    const data = await TermekKepLekeres(`/api/termek/KepLekeres/${id}`)
    return data;
}

const oldalGenerálás =  async () =>{
    
    //Backendből kapott objectek
    const LekertTermekek = await termek_lekeres();
    console.log("awe")
    if (LekertTermekek.termek.length == 0) {
        window.location.href = "/HianyzoTermek"
    }
    //Cim
    let termekCimHely = document.getElementById("TermekCim")
    termekCimHely.innerHTML = LekertTermekek.termek[0].TermekCim

    //KépBetöltés
    let url = window.location.href.split('/');
    let id = url[4];
    console.log(id);
    const data = await TermekKepLekeres(`/api/Webshop/Keplekeres/${id}`)//termek/keplekeres nem mukodik
    let KepHely = document.getElementById("TermekImg")
    KepHely.setAttribute("src",URL.createObjectURL(data))
    console.log(KepHely)

    //tovabbi adatok betöltése
    let TermekLeirasHely = document.getElementById("TermekSzoveg")
    TermekLeirasHely.innerHTML = LekertTermekek.termek[0].TermekLeiras
    //adatokTabla
    let tablaHely = document.getElementById("Tablazat")
    tablaHely.innerHTML = "";
    //szűrések
    let TablazatElemek = {"Kategória" : LekertTermekek.termek[0].TermekKategoria,"Márka" : LekertTermekek.termek[0].TermekMarka, "Származási Hely" : LekertTermekek.termek[0].TermekSzarmazas};
    if (LekertTermekek.termek[0].TermekAlkoholSzazalek != 0) 
    {
         TablazatElemek.alkoholtartalom = LekertTermekek.termek[0].TermekAlkoholSzazalek + "%";
    }
    if(LekertTermekek.termek[0].TermekKategoria != "Eszkozok" || LekertTermekek.termek[0].TermekKategoria != "Pohar" || LekertTermekek.termek[0].TermekKategoria != "Merch") 
    {
       if (LekertTermekek.termek[0].TermekUrtartalom != null)
        {
            TablazatElemek.Ürtartalom =  LekertTermekek.termek[0].TermekUrtartalom + "L"
        }  
       
    }
    //asd
    for (const element of Object.entries(TablazatElemek))
    {
        let tr = document.createElement("tr")
        for (let i = 0; i < 2; i++) {
            let td = document.createElement("td")
            td.innerHTML = element[i]
            td.classList.add(`td${i}`)
            tr.appendChild(td)   
        }
        tablaHely.appendChild(tr)
    }
    //HasonloTermekek
    let hova = document.getElementById("TermekSor")
    hova.innerHTML = ""
    const HasonlokData = await GETfetch(`/api/Termek/HasonloTermekek/${LekertTermekek.termek[0].TermekKategoria}/${LekertTermekek.termek[0].TermekID}`)
   
    for (let i = 0; i < HasonlokData.hasonlok.length; i++)
    {
        const KepData = await TermekKepLekeres(`/api/Webshop/KepLekeres/${HasonlokData.hasonlok[i].TermekID}`)
        let KepUrl = URL.createObjectURL(KepData)
        let kartya = document.createElement("div")
        kartya.classList.add("Termek")
        hova.appendChild(kartya)

        kartya.addEventListener("click",()=>{
            window.location.href = `/Termek/${HasonlokData.hasonlok[i].TermekID}`
        })

        let KepDiv = document.createElement("div")
        KepDiv.classList.add("hasonloKepDiv")
        kartya.appendChild(KepDiv)

        let img = document.createElement("img")
        img.src = KepUrl
        img.classList.add("hasonloKep")
        KepDiv.appendChild(img)

        let nevDiv = document.createElement("div")
        nevDiv.classList.add("hasonloNevDiv")
        kartya.appendChild(nevDiv)

        let h4 = document.createElement("h4")
        h4.classList.add("hasonloNev")
        h4.innerHTML = HasonlokData.hasonlok[i].TermekCim
        nevDiv.appendChild(h4)

        let ErtekelesDiv = document.createElement("div")
        ErtekelesDiv.classList.add("ErtekelesDiv")
        kartya.appendChild(ErtekelesDiv)
        let csillagok = [];
        for (let i = 0; i < 5; i++)
        {
            let csillag = document.createElement("p")
            csillag.innerHTML = "☆"
            csillag.classList.add("HasonloCsillag")
            csillagok.push(csillag)
            ErtekelesDiv.appendChild(csillag)
        }
        const meddig = await GETfetch(`/api/Termek/HasonloTermekErtekeles/${HasonlokData.hasonlok[i].TermekID}`)
        if (meddig != 0) {
            
        }
        for (let i = 0; i < meddig.ert; i++) 
            {
                csillagok[i].innerHTML="★"
            }    
    }
    //Ar
    let ArHely = document.getElementById("arHely")
     ArHely.innerHTML = LekertTermekek.termek[0].Ar + "Ft"
    if(LekertTermekek.termek[0].TermekDiscount != null){
        let akcioHely = document.getElementById("akciosAr")
        let akcio = 100 - LekertTermekek.termek[0].TermekDiscount;
        akcioHely.innerHTML = Math.round(((LekertTermekek.termek[0].Ar/100)*akcio)/10)*10+"Ft"
        akcioHely.style.color = "red"
        ArHely.style.textDecoration = "line-through"
    }
   
    //EgysegAr
    let EgysegArHely = document.getElementById("LiterAr")
     let ar1Szazalek;
    if (LekertTermekek.termek[0].TermekKategoria == "Eszkozok" || LekertTermekek.termek[0].TermekKategoria == "Pohar" || LekertTermekek.termek[0].TermekKategoria == "Merch") {
        
          EgysegArHely.innerHTML =""
        }
        else
        {
            if (LekertTermekek.termek[0].TermekDiscount != null)
            {
                let akcio = 100 - LekertTermekek.termek[0].TermekDiscount;
                let akciosar = ((LekertTermekek.termek[0].Ar/100)*akcio);
                ar1Szazalek = akciosar/(LekertTermekek.termek[0].TermekUrtartalom*100)
                EgysegArHely.innerHTML = "Literár: " + Math.round(ar1Szazalek*100) + "Ft/l"
            }
            else{
                ar1Szazalek = LekertTermekek.termek[0].Ar/(LekertTermekek.termek[0].TermekUrtartalom*100)
            EgysegArHely.innerHTML = "Literár: " + Math.round(ar1Szazalek*100) + "Ft/l"
            }
            
        }
    //vanEPolcon
    let PolcLabelSzovegHely = document.getElementById("VaneSzoveg")
    let PolcLabelHely = document.getElementById("VanePolcon")
    let kosarGomb = document.getElementById("kosarba")
    let mennyisegHely = document.getElementById("mennyisegInput")
    if (LekertTermekek.termek[0].TermekKeszlet <= 5 && LekertTermekek.termek[0].TermekKeszlet > 0 ) 
    {
        //a felhasználó nem tud a raktáron lévő mennyiségnél többet rendelni!
        let max =LekertTermekek.termek[0].TermekKeszlet;
        let min 
        mennyisegHely.max = max;
        mennyisegHely.addEventListener("change",()=>{
            
            if (mennyisegHely.value > max) 
            {
                mennyisegHely.value = max;  
            }
            if(mennyisegHely.value < 1){
                mennyisegHely.value = 1
            }
        })
        PolcLabelHely.innerHTML = "Utolsó Darabok!"
        PolcLabelHely.classList.add("Utolso")
    }
    else if(LekertTermekek.termek[0].TermekKeszlet > 5)
    {
        //a felhasználó maximum 99 terméket tud rendelni!
      
        let max = 100;
          if (max > LekertTermekek.termek[0].TermekKeszlet) 
            {
                max = LekertTermekek.termek[0].TermekKeszlet
            }
        mennyisegHely.addEventListener("change",()=>{
            console.log(max) 
            if (mennyisegHely.value > max) /*why??*/ 
            {
                mennyisegHely.value = max;  
            }
            if(mennyisegHely.value < 1){
                mennyisegHely.value = 1
            }
        })
        
        PolcLabelHely.innerHTML = "Raktáron!"
        PolcLabelHely.classList.add("VanPolcon")
    }
    else
    {
        kosarGomb.innerHTML = "Nem lehet kosárba rakni!"
        kosarGomb.disabled = "true";
        mennyisegHely.disabled = "true"
        PolcLabelHely.innerHTML = "Elfogyott!"
        PolcLabelHely.classList.add("NincsPolcon")
        console.log(PolcLabelHely)
    }
    //Ertekeles
    //Ellenorizzuk, hogy a felhasznalo ertekelt e mar
    let ertekelesSzam;
    if (LekertTermekek.ertekelt.length == 0) 
    {
        ertekelesSzam = ""
    }
    else if(LekertTermekek.ertekelt.length == 1)
    {
        ertekelesSzam  = LekertTermekek.ertekelt[0].Ertekeles 
    }
    ertekeles(LekertTermekek.ertekelt,ertekelesSzam)

    //kovetkezo termek
    const hossz = await GETfetch("/api/WebShop/HosszLekeres")
    const idLista = await GETfetch("/api/termek/OsszIdLekeres")
    
    let idszam = parseInt(id)
    let jelenlegiIndex ;
    for (let i = 0; i < idLista.idLista.length; i++) 
    {//az éppen nézett termék indexét meghatarozom a listaban
        
        if (idszam == idLista.idLista[i].TermekID)
        {
            console.log(idLista.idLista[i])
            jelenlegiIndex = i;
        }
    
    }
    let kov = document.getElementById("koviTermek")
    if (jelenlegiIndex == idLista.idLista.length-1) 
    {
        kov.disabled = "true"
        kov.style.color ="gray"
    }
    else{
        kov.href = `/Termek/${idLista.idLista[jelenlegiIndex+1].TermekID}`
    }
    //Elozo Termek
    let elo = document.getElementById("EloTermek")
    if (jelenlegiIndex == 0) {
        elo.disabled = "true"
        elo.style.color ="gray"
    }else{
        elo.href = `/Termek/${idLista.idLista[jelenlegiIndex-1].TermekID}`
    }
   

}

const ertekeles = (ErtekeltE,ertek) =>
{
    console.log(ErtekeltE)
    let Csillagok = document.getElementsByClassName("csillag")
    if(ErtekeltE == "nincsBejel"){
        const ertekelesHely = document.getElementById("Ertekeles")
        let h2 = document.createElement("h2")
        h2.innerHTML = "Az értékeléshez be kell jelentkeznie!"
        ertekelesHely.innerHTML = ""
        ertekelesHely.appendChild(h2)
    }
    else if (ErtekeltE[0] != undefined) 
    {
        //a felhasználó előző értékelését jelenítjük meg, ha a felhasznalo mar ertekelte ezt a termeket
        for (let i = 0; i < ertek; i++) 
        {
            Csillagok[i].value = "★"
        }
        //a csillagokon kikapcsolom a kattintást
        for (let j = 0; j < Csillagok.length; j++) {
            Csillagok[j].setAttribute("disabled","")
        }
           
        document.getElementById("ErtekelesKuldes").style.display = "none"
        document.getElementById("ErtekelPar").innerHTML="Ön már értékelte a koktélt"
    }
    else if (ErtekeltE[0] == undefined)
    {
        for (let i = 0; i < Csillagok.length; i++) {
           
           Csillagok[i].addEventListener("click",()=>{
                csillagvaltoztatas(Csillagok.length,"☆")
                
                csillagvaltoztatas(i+1,"★")
           })
            
           function csillagvaltoztatas(meddig,mive)
           {
                for (let i = 0; i < meddig; i++) 
                {
            
                    Csillagok[i].value=mive
                }
           }

           
        } 

         let url = window.location.href.split('/');
            let Termekid = url[4];
            document.getElementById("ErtekelesKuldes").addEventListener("click",async()=>{
            let ertekszam = 0
            //Teli csillagok megszámolása
            for (let i = 0; i < Csillagok.length; i++) 
            {
                if (Csillagok[i].value == "★") 
                {
                    ertekszam ++;
                }
            }
            if (ertekszam == 0) 
            {
                let ertszov = document.getElementById("ErtekelPar")
                ertszov.innerHTML = "üres értékelést nem tud küldeni!"
            }
            else
            {await PostFetch("/api/Termek/ErtekelesKuldes",{Tid:Termekid,ertek:ertekszam})
                oldalGenerálás()
            }
        })
    }
}

const KosarbaRak = async()=>
{
    let mennyiseg = document.getElementById("mennyisegInput").value
    let url = window.location.href.split('/');
    let Termekid = url[4];

    let postObj = {id:Termekid,mennyiseg:mennyiseg}
    let hiba = false;
    const KosarData = await PostFetch("/api/Termek/KosarKuldes",postObj)
    if(KosarData.hiba == "bejel")
    {
        alert("A termék kosárba helyezéséhez kérem jelentkezzen be!")
    }
    else if(KosarData.hiba == "raktar"){
      hiba = true
    }
    if (hiba == true) {
         modalHiba(hiba);
    }else{
        modalJo()
    }
   
}

document.addEventListener('DOMContentLoaded', async () => {
    //függvények meghívása
    oldalGenerálás()


    let kosarGomb = document.getElementById("kosarba")
    kosarGomb.addEventListener("click",KosarbaRak)

    var adat = document.getElementById('Tbtn');
    let tovGomb = document.getElementById("tovabb")
    tovGomb.addEventListener("click",()=>{
        window.location.href = "/Adatlap"
    })
    //mennyiség maximalizálása
    adat.addEventListener('click', function () {
            this.classList.add('active');
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    
    
});
const modalHiba = (hiba)=>{
//hibás kitöltés kezelése
        
        document.getElementById('vissza').style.display = 'block';
        document.getElementById('Sokhiba').style.display = 'block';
        document.getElementById('siker').setAttribute('hidden', true);
         document.getElementById('tovabb').setAttribute('hidden', true);
         hiba = false;
        
}
const modalJo = ()=>{
//hibás kitöltés kezelése
        
        document.getElementById('Sokhiba').style.display = 'none';
    document.getElementById('vissza').style.display = 'none';
    document.getElementById('siker').removeAttribute('hidden',false);
    document.getElementById('tovabb').removeAttribute('hidden', true);
}