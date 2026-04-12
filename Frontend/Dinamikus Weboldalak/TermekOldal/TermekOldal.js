
//LEKERESEK
async function GETfetch(url) {
    try {
        const data = await fetch(url);
        if (data.ok) {
            return await data.json();
        } else {
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
    if (valasz.ok) {
        return valasz.json()
    }
}
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
  
    const data = await GETfetch(`http://127.0.0.1:3000/api/termek/lekeres/${id}`);
      console.log(data);
     return data;
   
};

const KepLekeres = async () => 
{
    let url = window.location.href.split('/');
    let id = url[4];
    console.log(id);
    const data = await TermekKepLekeres(`http://127.0.0.1:3000/api/termek/KepLekeres/${id}`)
    return data;
}

const oldalGenerálás =  async () =>{
    //Backendből kapott objectek
    const LekertTermekek = await termek_lekeres();
    console.log("awe")
    if (LekertTermekek.termek.length == 0) {
        window.location.href = "/HianyzoTermek"
    }

    const lekertKep = await  KepLekeres();
    //Cim
    let termekCimHely = document.getElementById("TermekCim")
    termekCimHely.innerHTML = LekertTermekek.termek[0].TermekCim

    //KépBetöltés
    let KepUrl = URL.createObjectURL(lekertKep)
    let KepHely = document.getElementById("TermekImg")
    KepHely.setAttribute("src",URL.createObjectURL(lekertKep))
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
   

    console.log(HasonlokData)
    for (let i = 0; i < HasonlokData.hasonlok.length; i++)
    {
        const KepData = await TermekKepLekeres(`http://127.0.0.1:3000/api/termek/KepLekeres/${HasonlokData.hasonlok[i].TermekID}`)
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
        console.log(meddig)
        if (meddig != 0) {
            
        }
        for (let i = 0; i < meddig.ert; i++) 
            {
                console.log("kapa")
                csillagok[i].innerHTML="★"
            }    
    }
    //Ar
    let ArHely = document.getElementById("arHely")
    ArHely.innerHTML = LekertTermekek.termek[0].Ar + "Ft"
    //EgysegAr
    if (LekertTermekek.termek[0].TermekAlkoholSzazalek != 0) {
        let EgysegArHely = document.getElementById("LiterAr")
        let ar1Szazalek = LekertTermekek.termek[0].Ar/(LekertTermekek.termek[0].TermekUrtartalom*100)
      
        EgysegArHely.innerHTML = "Literár: " + Math.round(ar1Szazalek*100) + "Ft/l"
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
        mennyisegHely.max = max;
        mennyisegHely.addEventListener("change",()=>{
            
            if (mennyisegHely.value > max) 
            {
                mennyisegHely.value = max;  
            }
        })
        PolcLabelHely.innerHTML = "Utolsó Darabok!"
        PolcLabelHely.classList.add("Utolso")
        console.log(PolcLabelHely)
    }
    else if(LekertTermekek.termek[0].TermekKeszlet > 5)
    {
        //a felhasználó maximum 99 terméket tud rendelni!
      
        let max = mennyisegHely.max
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
        })
        
        PolcLabelHely.innerHTML = "Raktáron!"
        PolcLabelHely.classList.add("VanPolcon")
        console.log(PolcLabelHely)
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

}

const ertekeles = (ErtekeltE,ertek) =>
{
    console.log(ErtekeltE)
    let Csillagok = document.getElementsByClassName("csillag")
    if(ErtekeltE == "nincsBejel"){
        console.log("asd")
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
            console.log("ad")
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
            console.log("asd")
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
            console.log(ertekszam, Termekid)
            await PostFetch("/api/Termek/ErtekelesKuldes",{Tid:Termekid,ertek:ertekszam})
            
           oldalGenerálás()
        })
    }
}

const KosarbaRak = async()=>
{
    let mennyiseg = document.getElementById("mennyisegInput").value
    let url = window.location.href.split('/');
    let Termekid = url[4];

    let postObj = {id:Termekid,mennyiseg:mennyiseg}

    const KosarData = await PostFetch("/api/Termek/KosarKuldes",postObj)
    console.log(KosarData)
    if(KosarData.hiba == "bejel")
    {
        alert("A termék kosárba helyezéséhez kérem jelentkezzen be!")
    }
    else if(KosarData.Siker != null){
        alert("Sikeresen kosárba rakta a terméket!")
    }
    else if(KosarData.hiba == "raktar"){
        alert("nincs elég termék raktáron, vagy túl sokat próbált egyszerre rendelni!")
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    //függvények meghívása
    oldalGenerálás()


    let kosarGomb = document.getElementById("kosarba")
    kosarGomb.addEventListener("click",KosarbaRak)

    var adat = document.getElementById('Tbtn');

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
