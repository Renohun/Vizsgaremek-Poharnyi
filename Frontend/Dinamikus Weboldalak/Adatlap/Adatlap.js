document.addEventListener("DOMContentLoaded",()=>{
    //A Sidebar gombjainak listája
    const gombok=[document.getElementById("Adatlap"),document.getElementById("Kedvencek"),document.getElementById("Koktélok"),document.getElementById("Jelentések"),document.getElementById("Kosár")]
    //Mindegyiknek adunk egy eventListenert
    for (let i = 0; i < gombok.length; i++) {
        gombok[i].addEventListener("click",()=>{oldalvaltas(i,gombok)})
        
    }
    document.getElementById("Törlés").addEventListener("click",()=>{
        fioktorles()
    })
    //Profilkep Változtatás
    let fajl=document.getElementById("input")
    let kep=document.getElementById("profilkep")
    fajl.addEventListener("change",()=>{
        kep.setAttribute("src",URL.createObjectURL(fajl.files[0]))
    })
    AdatlapLekeres()
})

//Megkeressük annak a gombnak a párját amit lenyomtunk, és azt mutatjuk, illetve átteszük az aláhúzást
function oldalvaltas(selected,gombok){
    //oldalak listája egy tömbben
    const oldalak=[document.getElementById("adatoldal"),document.getElementById("kedvencoldal"),document.getElementById("kokteloldal"),document.getElementById("reportoldal"),document.getElementById("kosároldal")]
    //végigmegyünk a tömbön, és a kiválasztott oldalt megmutatjuk, és a hozzá tartozó sidebar elemet aláhúzzuk
    for (let i = 0; i < oldalak.length; i++) {
        if(oldalak[i]==oldalak[selected]){
            oldalak[i].removeAttribute("hidden","true")
            gombok[i].classList.add("jelenlegi")
            betoltes(i)
        }
        else{
            oldalak[i].setAttribute("hidden","true")
            gombok[i].classList.remove("jelenlegi")
        }
    }
}
const AdatGet=async(url)=>{
    try {
      const ertek=await fetch(url,{
        method:"GET",
        headers:{"Content-Type":"application/json"}
      })  
      if (ertek.ok) {
        return ertek.json()
      }
      else{
        console.log("hiba");
        
      }
    } 
    catch (error) {
        console.error(error)
    }
}
const AdatGetKep=async(url)=>{
    try {
      const ertek=await fetch(url,{
        method: "POST",
        headers: {"Content-Type":"image/jpeg"}
      })  
      if (ertek.ok) {
        return ertek.blob()
      }
      else{
        console.log("hiba");
        
      }
    } 
    catch (error) {
        console.error(error)
    }
}
const AdatPost=async(url,data)=>{
    try {
      const ertek=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      })  
      if (ertek.ok) {
        return ertek.json(),ertek.status
      }
      else{
        console.log("hiba");
        
      }
    } 
    catch (error) {
        console.error(error)
    }
}

const AdatPostKep=async(url,data)=>{
    try {
      const ertek=await fetch(url,{
        method:"POST",
        body:data
      })  
      if (ertek.ok) {
        return ertek.json()
      }
      else{
        console.error(ertek.statusText);
        
      }
    } 
    catch (error) {
        console.error(error)
    }
}

//Bünti Sarok a Gomboknak Mert Folyamatosan Osztódnak
let kosárModMégse=document.createElement("input")
let kosárModIgen=document.createElement("input")
let AdatMentes=document.createElement("input")
let AdatMégse=document.createElement("input")

async function AdatlapLekeres(){
    //Adatok Lekérése
    const valasz=await AdatGet("/api/AdatlapLekeres/FelhAdatok/")
    const kep=await AdatGetKep("/api/AdatlapLekeres/KepLekeres/")
    //A Felhasználó Azon Adatai, amelyeket tud majd módosítani betöltése
    let ertek=valasz.tartalom[0][0];
    let kapottkep=URL.createObjectURL(kep)
    let AdatlapFelh=document.getElementById("Felhasználónév")
    let AdatlapEmail=document.getElementById("Email-cím")
    let AdatlapJelszo=document.getElementById("Jelszó")
    let AdatlapJelszo2=document.getElementById("Jelszó2")
    let AdatlapJelszoLabel2=document.getElementById("labelJelszo2")

    let AdatlapJelszoValtozatas=document.getElementById("pwChange")
    let AdatlapJelszoValtozatasLabel=document.getElementById("pwChangeLabel")

    let AdatlapKep=document.getElementById("profilkep")
    AdatlapFelh.value=ertek.Felhasználónév
    AdatlapEmail.value=ertek.Email
    AdatlapJelszo.value=ertek.Jelszó
    AdatlapKep.setAttribute("src",kapottkep)



    //A Módosítás Gomb Következményei
    let modosit=document.getElementById("Módosítás")
    let hovaGombok=document.getElementById("AdatlapGombok")
    let eredmény=document.getElementById("result")
    let titkos=document.getElementById("input")
    eredmény.innerHTML=""
    modosit.addEventListener("click",()=>{
        eredmény.innerHTML=""
        AdatMentes.setAttribute("type","button")
        AdatMentes.setAttribute("value","Mentés")
        AdatMentes.classList.add("btn","btn-success","me-1")

        AdatMégse.setAttribute("type","button")
        AdatMégse.setAttribute("value","Mégse")
        AdatMégse.classList.add("btn","btn-danger")

        let tempFelh=AdatlapFelh.value
        let tempMail=AdatlapEmail.value
        let tempJelszo=AdatlapJelszo.value
        let tempKep=kapottkep
        AdatlapFelh.removeAttribute("disabled","true")
        AdatlapEmail.removeAttribute("disabled","true")
        titkos.removeAttribute("disabled","true")
        modosit.setAttribute("disabled","true")
        AdatlapJelszoValtozatas.removeAttribute("hidden","true")
        AdatlapJelszoValtozatasLabel.removeAttribute("hidden","true")
        AdatlapJelszoValtozatas.addEventListener("click",()=>{
            if (AdatlapJelszoValtozatas.checked) {
                AdatlapJelszo.value=""
                AdatlapJelszo.removeAttribute("disabled","true")
                AdatlapJelszo2.removeAttribute("disabled","true")
                AdatlapJelszo2.removeAttribute("hidden","true")
                AdatlapJelszoLabel2.removeAttribute("hidden","true")
            }
            else{
                AdatlapJelszo.value=tempJelszo
                AdatlapJelszo.setAttribute("disabled","true")
                AdatlapJelszo2.setAttribute("disabled","true")
                AdatlapJelszo2.setAttribute("hidden","true")
                AdatlapJelszoLabel2.setAttribute("hidden","true")
            }
        })
        hovaGombok.appendChild(AdatMentes)
        hovaGombok.appendChild(AdatMégse)
        AdatMentes.addEventListener("click",async()=>{
        let valto=await adatvaltas()
        if (valto==true) 
        {
            eredmény.innerHTML="Sikeres Mentés!"
            GombOles()
        }
        else{
            eredmény.innerHTML="Hibás Adat!"
        }


        })
        AdatMégse.addEventListener("click",()=>{
                undo()
                GombOles()
        
        })
        function undo(){
            try {
                AdatlapFelh.value=tempFelh
                AdatlapEmail.value=tempMail
                AdatlapJelszo.value=tempJelszo
                AdatlapKep.setAttribute("src",tempKep)
                eredmény.innerHTML="Sikeres Törlés!"
            } 
            catch (error) {
                //redirect?
                eredmény.innerHTML="Hiba történt!"
            }
        }

        async function adatvaltas(){
            try {
                    let FelhAdatok={
                        Felhasználónév:AdatlapFelh.value,
                        Email:AdatlapEmail.value,
                    }
                    const data=new FormData()
                    //A Kép Eltárolása. Visszakapjuk a kép új nevét, amit továbbadunk az adatbázisnak   
                    if(titkos.files.length!=0){
                        if (titkos.files[0].type!="image/jpeg"&&titkos.files[0].type!="image/png"&&titkos.files[0].type!="image/bmp"&&titkos.files[0].type!="image/webp") {
                            return false
                        }
                        else{        
                            data.append("profilkep",titkos.files[0])
                            const kepUtvonal=await AdatPostKep("/api/AdatlapLekeres/KepFeltoltes",data)
                            FelhAdatok.KépÚtvonal=kepUtvonal.message
                        }
                    }
                    if(AdatlapJelszo2.value!=AdatlapJelszo.value&&AdatlapJelszoValtozatas.checked==true){
                        return false
                    }
                    else{
                        FelhAdatok.Jelszó=AdatlapJelszo.value
                        
                        await AdatPost("/api/AdatlapLekeres/Adatmodositas/",FelhAdatok)
                        return true
                    }
                    
            } 
            catch (error) {
                //redirect?
                console.log(error);
                
                eredmény.innerHTML="Hiba történt!"
                return false
            }

        }
    })


    function GombOles(){
        
        let mit=[]
        for (let i = 1; i < hovaGombok.children.length; i++) {
            mit.push(hovaGombok.children[i])
            
        }
        for (let i = 0; i < mit.length; i++) {
            hovaGombok.removeChild(mit[i])
            
        }
        AdatlapJelszoValtozatas.setAttribute("hidden","true")
        AdatlapJelszoValtozatasLabel.setAttribute("hidden","true")
        AdatlapFelh.setAttribute("disabled","true")
        AdatlapEmail.setAttribute("disabled","true")
        modosit.removeAttribute("disabled","true")
        titkos.setAttribute("disabled","true")
        AdatlapJelszo.setAttribute("disabled","true")
        AdatlapJelszo2.setAttribute("disabled","true")
        AdatlapJelszo2.setAttribute("hidden","true")
        AdatlapJelszoLabel2.setAttribute("hidden","true")
    }


    //Statisztikák

    //A Dátum Formázása
    let reg=ertek.RegisztracioDatuma.split('T')
    let regDate=reg[0]
    let regTime=(reg[1].split('.'))[0]
    //Feltöltés
    document.getElementById("RegDate").innerHTML=`${regDate} ${regTime}`
    document.getElementById("KeszitKoktelNum").innerHTML=(valasz.tartalom[4][0]).MAKEID
    document.getElementById("KedveltKoktelNum").innerHTML=(valasz.tartalom[1][0]).KEDVID
    document.getElementById("KommentNum").innerHTML=(valasz.tartalom[2][0]).KOMMID
    document.getElementById("ErtekNum").innerHTML=(valasz.tartalom[3][0]).RATEID

    
}
async function KedvencekLekeres() {
    const valasz=await AdatGet("/api/AdatlapLekeres/Kedvencek/")
    let hova=document.getElementById("IdeKedvenc")
    if (valasz.message!="Üres Lekérés!") {
        let kulsoertek=0
        let sorszam=Math.round((valasz.adat.length/4)+0.5)
        hova.innerHTML=""
        for (let i = 0; i < sorszam; i++) 
    {
        let sor=document.createElement("div")
        sor.classList.add("row","justify-content-center")
        let maxertek=4+i*4
        for (kulsoertek; kulsoertek < maxertek; kulsoertek++) 
        {
            if (valasz.adat[kulsoertek]!=null) {
                //elemek létrehozása
                let koktelDiv=document.createElement("div")
                let koktelCard=document.createElement("div")
                let koktelKep=document.createElement("img") //Pathinget ki kell még találni
                let koktelTartalom=document.createElement("div")
                let koktelNev=document.createElement("h4")
                let koktelErtekeles=document.createElement("span")
                let koktelSzoveg=document.createElement("div")
                let koktelBadge=document.createElement("div") //Jelenleg semmit se csinal
                let koktelOsszetevok=document.createElement("span")
                let koktelOsszetevoLista=document.createElement("ul")
                let koktelOldal=document.createElement("input")
                //bootstrap és css elemek megadása
                koktelDiv.classList.add("col-8","col-sm-7","col-md-6","col-lg-6","col-xl-3","col-xxl-3","mb-1")
                koktelCard.classList.add("card","h-100")
                koktelKep.classList.add("card-img-top","kep")
                koktelTartalom.classList.add("card-body","flex-column")
                koktelNev.classList.add("card-title")
                koktelSzoveg.classList.add("card-text")
                koktelOldal.classList.add("btn","btn-secondary","align-self-center")
                let id=valasz.adat[kulsoertek].kokteladatok[0].KoktélID
                koktelOldal.addEventListener("click",()=>{
                    window.location.href=`http://127.0.0.1:3000/Koktel/${id}`
                })
                //értékek megadása             
                let koktelkep=await AdatGetKep("/api/AdatlapLekeres/KoktelKepLekeres/"+valasz.adat[kulsoertek].kokteladatok[0].KoktélID)
                koktelKep.setAttribute("src",URL.createObjectURL(koktelkep))
                koktelKep.setAttribute("alt","Itt a koktélnak kéne megjelennie teljes gyönyörében.. de nincs itt.")
                koktelKep.setAttribute("title",`Így néz ki egy ${valasz.adat[kulsoertek].kokteladatok[0].KoktelCim}`)
                koktelNev.innerHTML=valasz.adat[kulsoertek].kokteladatok[0].KoktelCim
                koktelOsszetevok.innerHTML="Összetevők:"
                koktelOldal.setAttribute("type","button")
                koktelOldal.setAttribute("style","width:95%; margin-bottom:12px;")
                koktelOldal.setAttribute("value","Tovább a Receptre")
                //Van-e értékelés
                if (valasz.adat[kulsoertek].ertekeles[0].Osszert!=null) 
                {
                    koktelErtekeles.innerHTML=`Értékelés:${Math.round(valasz.adat[kulsoertek].ertekeles[0].Osszert * 10) / 10}/5`
                }
                else
                {
                     koktelErtekeles.innerHTML="Nincs még értékelés!"
                }
                //Összevetők kijelzése
                if (valasz.adat[kulsoertek].osszetevok.length>1) {
                    for (let i = 0; i < 2; i++)
                    {   
                        let Osszetevo=document.createElement("li")
                        Osszetevo.innerHTML=valasz.adat[kulsoertek].osszetevok[i].Osszetevő
                        koktelOsszetevoLista.appendChild(Osszetevo)
                    }
                    if (valasz.adat[kulsoertek].osszetevok.length==3)
                    {
                         let VegsoOsszetevo=document.createElement("li")
                         VegsoOsszetevo.innerHTML=valasz.adat[kulsoertek].osszetevok[2].Osszetevő
                         koktelOsszetevoLista.appendChild(VegsoOsszetevo)
                    }
                    else if (valasz.adat[kulsoertek].osszetevok.length>3)
                    {
                         let VegsoOsszetevo=document.createElement("li")
                         VegsoOsszetevo.innerHTML=`és ${(valasz.adat[kulsoertek].length)-2}`
                         koktelOsszetevoLista.appendChild(VegsoOsszetevo)
                    }
                }
                //Gonosz emberek illegális koktéljai
                else{
                        let VegsoOsszetevo=document.createElement("li")
                        VegsoOsszetevo.innerHTML=valasz.adat[kulsoertek].osszetevok[0].Osszetevő
                        koktelOsszetevoLista.appendChild(VegsoOsszetevo)
                }
                //Badgek Készítése
                //Color Scheme:
                //Piros Erősség
                //Sárga Allergén
                //Zöld íz
                for (let j = 0; j < valasz.adat[kulsoertek].koktelbadgek.length; j++) {
                    let jelveny=document.createElement("span")
                    jelveny.innerHTML=valasz.adat[kulsoertek].koktelbadgek[j][0].JelvényNeve
                    console.log(valasz.adat[kulsoertek].koktelbadgek[j][0].JelvenyKategoria);
                    
                    jelveny.classList.add("badge","me-1","text-white","rounded-pill")
                    switch (valasz.adat[kulsoertek].koktelbadgek[j][0].JelvenyKategoria) {
                        case "ízek":
                            jelveny.classList.add("bg-success")
                        break;

                        case "Allergének":
                            jelveny.classList.add("bg-warning")
                        break;

                        case "Erősség":
                            jelveny.classList.add("bg-danger")
                        break;
                    }
                    koktelBadge.appendChild(jelveny)
                }
                //feltöltés
                koktelCard.appendChild(koktelKep)
                koktelTartalom.appendChild(koktelNev)
                koktelTartalom.appendChild(koktelErtekeles)
                koktelSzoveg.appendChild(koktelBadge)
                koktelSzoveg.appendChild(koktelOsszetevok)
                koktelSzoveg.appendChild(koktelOsszetevoLista)
                koktelTartalom.appendChild(koktelSzoveg)
                koktelCard.appendChild(koktelTartalom)
                koktelCard.appendChild(koktelOldal)
                koktelDiv.appendChild(koktelCard)
                sor.appendChild(koktelDiv)
            }
            else
            {
                let koktelDiv=document.createElement("div")
                koktelDiv.classList.add("col-8","col-sm-7","col-md-6","col-lg-6","col-xl-3","col-xxl-3","mb-1")
                sor.appendChild(koktelDiv)
            }
            hova.appendChild(sor)
        }
        }
        }
    else{
        hova.innerHTML="Nincs Kedvenc Koktélod!"
    }
    
}
async function KoktelokLekeres() {
    const valasz=await AdatGet("/api/AdatlapLekeres/Koktelok/")
    
    let kulsoertek=0
    let sorszam=Math.round((valasz.adat.length/4)+0.5)
    console.log(valasz);
    
    let hova=document.getElementById("IdeSaját")
    hova.innerHTML=""
    for (let i = 0; i < sorszam; i++) 
    {
        let sor=document.createElement("div")
        sor.classList.add("row","justify-content-center")
        let maxertek=4+i*4
        for (kulsoertek; kulsoertek < maxertek; kulsoertek++) 
        {
            if (valasz.adat[kulsoertek]!=null) {
                //elemek létrehozása
                let koktelDiv=document.createElement("div")
                let koktelCard=document.createElement("div")
                let koktelKep=document.createElement("img") //Pathinget ki kell még találni
                let koktelTartalom=document.createElement("div")
                let koktelNev=document.createElement("h4")
                let koktelErtekeles=document.createElement("div")
                let koktelKomment=document.createElement("div")
                let koktelOldal=document.createElement("input")
                //bootstrap és css elemek megadása
                koktelDiv.classList.add("col-8","col-sm-7","col-md-6","col-lg-6","col-xl-3","col-xxl-3","mb-1")
                koktelCard.classList.add("card","h-100")
                koktelKep.classList.add("card-img-top","kep")
                koktelTartalom.classList.add("card-body")
                koktelNev.classList.add("card-title")
                koktelOldal.classList.add("btn","btn-secondary")
                //értékek megadása
                let koktelkep=await AdatGetKep("/api/AdatlapLekeres/KoktelKepLekeres/"+valasz.adat[kulsoertek].KoktélID)
                koktelKep.setAttribute("src",URL.createObjectURL(koktelkep))
                koktelKep.setAttribute("alt","Itt a koktélnak kéne megjelennie teljes gyönyörében.. de nincs itt.")
                koktelKep.setAttribute("title",`így néz ki egy ${valasz.adat[kulsoertek].KoktelCim}`)
                koktelNev.innerHTML=valasz.adat[kulsoertek].KoktelCim
                koktelOldal.setAttribute("type","button")
                koktelOldal.setAttribute("value","Tovább a Receptre")
                let id=valasz.adat[kulsoertek].KoktélID
                koktelOldal.addEventListener("click",()=>{
                    window.location.href=`http://127.0.0.1:3000/Koktel/${id}`
                })
                //Van-e értékelés
                if (valasz.ertek[kulsoertek][0].Osszert!=null) 
                {
                    koktelErtekeles.innerHTML=`Értékelés:${Math.round(valasz.ertek[kulsoertek][0].Osszert * 10) / 10}/5`
                }
                else
                {
                     koktelErtekeles.innerHTML="Nincs még értékelés!"
                }
                //Van-e komment
                if (valasz.kommnum[kulsoertek][0].Kommnum!=0) 
                {
                    koktelKomment.innerHTML=`Kommentek Száma:${valasz.kommnum[kulsoertek][0].KommNum}`
                }
                else
                {
                    koktelKomment.innerHTML="Nincs még komment!"
                }
                //Badgek 
                for (let i = 0; i < valasz.length; i++) {
                    
                    
                }
                //feltöltés
                koktelCard.appendChild(koktelKep)
                koktelTartalom.appendChild(koktelNev)
                koktelTartalom.appendChild(koktelErtekeles)
                koktelTartalom.appendChild(koktelKomment)
                koktelTartalom.appendChild(koktelOldal)
                koktelCard.appendChild(koktelTartalom)
                koktelDiv.appendChild(koktelCard)
                sor.appendChild(koktelDiv)
            }
            else
            {
                let koktelDiv=document.createElement("div")
                koktelDiv.classList.add("col-8","col-sm-7","col-md-6","col-lg-6","col-xl-3","col-xxl-3","mb-1")
                sor.appendChild(koktelDiv)
            }
            hova.appendChild(sor)
        }
    }
    
}
async function JelentesekLekeres() {
    const valasz=await AdatGet("/api/AdatlapLekeres/Jelentesek/")
    let hova=document.getElementById("IdeReport")
    console.log(valasz);
    
    hova.innerHTML=""
    if (valasz.message=="Nincs Jelentésed!") {
        hova.innerHTML="Nem jelentettél semmit."
    }
    else{
        for (let i = 0; i < valasz.adat.length; i++) {
            let JelentesDiv=document.createElement("div")
            let sortör=document.createElement("hr")
            let sortör2=document.createElement("hr")
            let JelentesNev=document.createElement("div")
            let JelentesText=document.createElement("div")
            let JelentesAllapota=document.createElement("div")
            let JelentesVisszavonasa=document.createElement("input")
            JelentesDiv.classList.add("card","m-1")
            JelentesDiv.classList.add("col-6","col-sm-7","col-md-3","col-lg-3","col-xl-2","col-xxl-2","mb-1")
            JelentesNev.classList.add("card-title","fs-4","text-center")
            JelentesVisszavonasa.classList.add("btn","btn-danger","mb-2","mt-2")
            JelentesVisszavonasa.setAttribute("type","button")
            JelentesVisszavonasa.setAttribute("value","Jelentés Visszavonása")
            JelentesAllapota.classList.add("text-center")
            console.log(valasz.adat[i][0].JelentesTipusa);
            
            if (valasz.adat[i][0].JelentesTipusa=="Koktél") {
                JelentesNev.innerHTML="Jelentett Koktél"
                JelentesText.innerHTML=`Feljelentetted ${valasz.rep[i][1].Felhasználónév} "${valasz.rep[i][0].KoktelCim}" című koktélját.<br>Indok:${valasz.adat[i][1].JelentesIndoka}`
                JelentesDiv.appendChild(JelentesNev)
                JelentesNev.appendChild(sortör)
                JelentesDiv.appendChild(JelentesText)
                
                
            }
            else if(valasz.adat[i][0].JelentesTipusa=="Komment"){
                JelentesNev.innerHTML="Jelentett Komment"
                console.log(valasz.rep[i][1]);
                
                JelentesText.innerHTML=`Feljelentetted ${valasz.rep[i][1][0].Felhasználónév} "${valasz.rep[i][0][0].Tartalom}" Kommentjét.<br>Indok:${valasz.adat[i][1].JelentesIndoka}`
                JelentesDiv.appendChild(JelentesNev)
                JelentesNev.appendChild(sortör)
                JelentesDiv.appendChild(JelentesText)
            }
            else{
                JelentesNev.innerHTML="Jelentett Felhasználó"
                console.log(valasz.rep[i][1]);
                
                JelentesText.innerHTML=`Feljelentetted ${valasz.rep[i][0].Felhasználónév} Felhasználót.<br>Indok:${valasz.adat[i][1].JelentesIndoka}`
                JelentesDiv.appendChild(JelentesNev)
                JelentesNev.appendChild(sortör)
                JelentesDiv.appendChild(JelentesText)
            }


            if (valasz.adat[i][0].JelentesAllapota=="0") {
                JelentesAllapota.innerHTML="Jelenlegi Állapota: Elküldve"
            }
            else if (valasz.adat[i][0].JelentesAllapota=="0") {
                JelentesAllapota.innerHTML="Jelenlegi Állapota: Elfogadva!"
            }
            else{
                JelentesAllapota.innerHTML="Jelenlegi Állapota: Elutasítva!"
            }

            JelentesVisszavonasa.addEventListener("click",()=>{
                console.log(valasz.adat[i][1].JelentésID);
                console.log(valasz.adat[i][0].JelentesTipusa);
                
                let mit={
                    tettes:valasz.adat[i][1].JelentésID,
                    id:4,
                    tipus:valasz.adat[i][0].JelentesTipusa
                }
                
                
                AdatPost("/api/AdatlapLekeres/JelentesTorles",mit)
                JelentesekLekeres()
            })

            JelentesText.appendChild(sortör2)
            JelentesText.appendChild(JelentesAllapota)
            JelentesDiv.appendChild(JelentesVisszavonasa)
            hova.appendChild(JelentesDiv)
        }
    }
}



async function KosarLekeres() {
    visszaepites()
    const valasz=await AdatGet("/api/AdatlapLekeres/Kosar/")
    if (valasz.message=="Üres Kosár") {
        document.getElementById("KosárGombok").innerHTML="Üres A Kosarad!"
    }
    else{    
        //Termékek létrehozása
        let hova=document.getElementById("IdeKosár")
        hova.innerHTML=""
        let összár=0
        for (let i = 0; i < valasz.kosár.length; i++) {
            let kosárDiv=document.createElement("div")
            let kosárKépDiv=document.createElement("div")
            let kosárKép=document.createElement("img")
            let kosárNév=document.createElement("div")
            let kosárText=document.createElement("div")
            let kosárDBÁr=document.createElement("div")
            let kosárMennyiség=document.createElement("span")
            let kosárEgységÁr=document.createElement("span")
            let kosárÖssz=document.createElement("div")

            kosárDiv.classList.add("card","p-0","ms-2")
            kosárDiv.classList.add("col-9","col-sm-9","col-md-4","col-lg-4","col-xl-2","col-xxl-2","mb-1")
            kosárNév.classList.add("card-title","fs-4","border-bottom","border-black")
            kosárKép.classList.add("card-img-top")
            kosárKépDiv.classList.add("justify-content-space-between")
            kosárText.classList.add("border-bottom","border-black")

            kosárNév.innerHTML=`${valasz.termekek[i].TermekCim}`
            kosárText.innerHTML=`${valasz.termekek[i].TermekLeiras}`
            kosárDBÁr.innerHTML=`Mennyiség:`
            kosárMennyiség.innerHTML=`${valasz.kosár[i].Darabszam}`
            kosárEgységÁr.innerHTML=`db Egységár:${valasz.kosár[i].EgysegAr}Ft`
            kosárÖssz.innerHTML=`Összár:${valasz.kosár[i].EgysegAr*valasz.kosár[i].Darabszam}Ft`

            let kosárkep=await AdatGetKep("/api/AdatlapLekeres/TermekKepLekeres/"+valasz.kosár[i].TermekID)
            kosárKép.setAttribute("src",URL.createObjectURL(kosárkep))
            kosárDBÁr.appendChild(kosárMennyiség)
            kosárDBÁr.appendChild(kosárEgységÁr)
            kosárKépDiv.appendChild(kosárKép)
            kosárDiv.appendChild(kosárKépDiv)
            kosárDiv.appendChild(kosárNév)
            kosárDiv.appendChild(kosárText)
            kosárDiv.appendChild(kosárDBÁr)
            kosárDiv.appendChild(kosárÖssz)

            összár+=parseInt(valasz.kosár[i].EgysegAr*valasz.kosár[i].Darabszam)
            hova.appendChild(kosárDiv)
        }
        let hovaÖsszeg=document.getElementById("KosárFizetésGomb")
        hovaÖsszeg.innerHTML=""
        let kosárÖsszeg=document.createElement("div")
        kosárÖsszeg.innerHTML=`Összesen: ${összár} Ft`
        hovaÖsszeg.appendChild(kosárÖsszeg)

        //Gombok
        let kosárMódosít=document.getElementById("KosárEdit")
        let kosárFizet=document.getElementById("KosárFizet")
        let kosárÜrít=document.getElementById("KosárDelete")

        //Kosár termékek módosítása
        kosárMódosít.addEventListener("click",()=>{
            kosárMódosít.setAttribute("disabled","true")
            kosárFizet.setAttribute("disabled","true")
            kosárÜrít.setAttribute("disabled","true")
            let kosárGombok=document.getElementById("KosárGombok")
            for (let i = 0; i < hova.children.length; i++) {
            let kosárDbMod=document.createElement("input")
            kosárDbMod.setAttribute("type","number")
            kosárDbMod.setAttribute("min","1")
            //valasz.termekek[i].TermekKeszlet
            kosárDbMod.setAttribute("max","10")
            let kosárTartalék=hova.children[i].childNodes[3].childNodes[1].innerHTML
            kosárDbMod.value=hova.children[i].childNodes[3].childNodes[1].innerHTML
            hova.children[i].childNodes[3].childNodes[1].innerHTML=""
            hova.children[i].childNodes[3].childNodes[1].appendChild(kosárDbMod)
            let koktelKuka=document.createElement("input")
            koktelKuka.setAttribute("type","button")
            koktelKuka.classList.add("btn","text-black","fs-4","align-top","float-end","kuka")
            koktelKuka.setAttribute("value","🗑︎")
            koktelKuka.addEventListener("click",()=>{
                console.log(valasz.kosár[i].TermekID);
                let mitürít={
                    termék:valasz.kosár[i].TermekID
                }
                AdatPost("/api/AdatlapLekeres/TermekUrites/",mitürít)
            })
            hova.children[i].childNodes[0].appendChild(koktelKuka)

            kosárModMégse.setAttribute("type","button")
            kosárModIgen.setAttribute("type","button")
            kosárModMégse.setAttribute("value","Mégse")
            kosárModIgen.setAttribute("value","Mentés")
            kosárModIgen.classList.add("btn","btn-success","me-1")
            kosárModMégse.classList.add("btn","btn-danger")
            kosárGombok.appendChild(kosárModIgen)
            kosárGombok.appendChild(kosárModMégse)
            kosárModIgen.addEventListener("click",()=>{
                hova.children[i].childNodes[3].childNodes[1].innerHTML=kosárDbMod.value
                mitürít={
                    termék:valasz.kosár[i].TermekID,
                    count:kosárDbMod.value
                }
                AdatPost("/api/AdatlapLekeres/TermekFrissites",mitürít)
                tisztitas()
            })
            kosárModMégse.addEventListener("click",()=>{
                hova.children[i].childNodes[3].childNodes[1].innerHTML=kosárTartalék
                tisztitas()

            })
        function tisztitas(){   
            hova.children[i].childNodes[0].removeChild(koktelKuka)
            kosárGombok.removeChild(kosárModIgen)
            kosárGombok.removeChild(kosárModMégse)
            kosárMódosít.removeAttribute("disabled","true")
            kosárFizet.removeAttribute("disabled","true")
            kosárÜrít.removeAttribute("disabled","true")
            KosarLekeres()
            }}

        })
        //Kosár kiürítése
        kosárÜrít.addEventListener("click",()=>{
            try {
                //dinamikusan kell a FelhID-t odaadni
                let mitürít={
                    tartalom:1
                }
                AdatPost("/api/AdatlapLekeres/Kosarurites/",mitürít)
                KosarLekeres()
                alert("Siker!")

            } 
            catch (error) {
                alert("Hiba Történt!")
            }
        })
        //Fizetés
        kosárFizet.addEventListener("click",()=>{
            fizetes()
        })
    }
    
}

function fioktorles(){
    var JelIv = new bootstrap.Modal(document.getElementById('Fioktorles'), {})   
    JelIv.show()
    document.getElementById("DelNvm").addEventListener("click",()=>{
        
        document.getElementById("DelConfText").value=""
        JelIv.hide()
    },{once:true})
    document.getElementById("DelConf").addEventListener("click",async()=>{
        if (document.getElementById("DelConfText").value!="TÖRLÉS") {
            document.getElementById("feedback").innerHTML="A mező nem tartalmazza a helyes szavat!"
        }
        else{
            document.getElementById("feedback").innerHTML="Detonation"
            await AdatPost("/api/AdatlapLekeres/Fioktorles")
            window.location.href="/"
        }
        
    },{once:true})
    
    
    
}


async function fizetes(){
    let gombSáv=document.getElementById("KosárGombok")
    gombSáv.innerHTML=""
    let összJelző=document.getElementById("IdeKosár")
    összJelző.innerHTML=""
    let c=document.getElementById("KosárFizetésGomb")
    c.innerHTML=""

    let gomb=document.createElement("input")
    let kosar=await AdatGet("/api/AdatlapLekeres/Kosar")
    console.log(kosar);
    let termekek=kosar.termekek
    let termekadatok=kosar.kosár
    
    
    gomb.setAttribute("type","button")
    gomb.setAttribute("value","Vissza")
    gomb.classList.add("btn","btn-secondary")
    //Visszaépítem a Gombokat mert nem dinamikusak de törölhetőek
    gomb.addEventListener("click",()=>{
        visszaepites()
        KosarLekeres()
    })
    gombSáv.appendChild(gomb)
    c.classList.add("mt-2")
    let total=0
    //Termék Adatok
    let termékekList=document.createElement("div")
    c.classList.add("row","justify-content-md-between","justify-content-sm-center")
    termékekList.classList.add("col-12","col-lg-4","col-md-4","col-sm-12","bg-light","rounded","p-2","border","border-dark")
    let szoveg=document.createElement("div")
    szoveg.innerHTML="Termék Adatok"
    termékekList.appendChild(szoveg)

    for (let i = 0; i < termekek.length; i++) {
        let sor=document.createElement("div")
        sor.classList.add("border-top","border-dark")
        sor.innerHTML=termekek[i].TermekCim+" - "+`${termekadatok[i].Darabszam}db `+(termekadatok[i].EgysegAr*termekadatok[i].Darabszam)+" Ft"
        total+=termekadatok[i].EgysegAr*termekadatok[i].Darabszam
        termékekList.appendChild(sor)
    }
    //Számlázási Adatok
    let PayList=document.createElement("form")
    PayList.classList.add("col-12","col-lg-4","col-md-4","col-sm-12","border","border-dark","bg-light","rounded","p-2","needs-validation")
    let payszoveg=document.createElement("div")
    payszoveg.innerHTML="Számlázási Adatok"
    //PayList.setAttribute("novalidate","true")
    PayList.appendChild(payszoveg)
    //Email
    let mailLab=document.createElement("label")
    let mail=document.createElement("input")
    mail.setAttribute("placeholder","pelda@email.cim")
    mail.setAttribute("required","true")
    mail.setAttribute("id","fizmail")
    mail.classList.add("form-control")
    mailLab.setAttribute("for","fizmail")
    mailLab.innerHTML="Email-Cím"
    PayList.appendChild(mailLab)
    PayList.appendChild(mail)
    //Név
    let nameLab=document.createElement("label")
    let name=document.createElement("input")
    name.setAttribute("placeholder","Minta László")
    name.setAttribute("required","true")
    name.setAttribute("id","fizname")
    name.classList.add("form-control")
    nameLab.setAttribute("for","fizname")
    nameLab.innerHTML="Teljes Név"
    PayList.appendChild(nameLab)
    PayList.appendChild(name)

    //Cím
    let locLab=document.createElement("label")
    let loc=document.createElement("input")
    loc.setAttribute("placeholder","1234 MintaVáros Minta u. 5")
    loc.setAttribute("required","true")
    loc.setAttribute("id","fizplace")
    loc.classList.add("form-control")
    locLab.setAttribute("for","fizplace")
    locLab.innerHTML="Teljes Cím"
    PayList.appendChild(locLab)
    PayList.appendChild(loc)
    
    //TelSzám
    let numLab=document.createElement("label")
    let num=document.createElement("input")
    num.setAttribute("placeholder","+36201234567")
    num.setAttribute("type","tel")
    num.setAttribute("id","fiznum")
    num.setAttribute("required","true")
    num.classList.add("form-control")
    numLab.setAttribute("for","fiznum")
    numLab.innerHTML="Telefonszám"
    PayList.appendChild(numLab)
    PayList.appendChild(num)
    
    //Kártya Vagy Készpénz
    let typeLab=document.createElement("label")
    typeLab.innerHTML="Fizetési Mód"
    typeLab.setAttribute("for","fizmod")
    let type=document.createElement("select")
    type.classList.add("form-select")
    type.id="fizmod"
    let kar=document.createElement("option")
    kar.innerHTML="Kártyás Fizetés"
    let kesz=document.createElement("option")
    kesz.innerHTML="Fizetés Átvételkor"
    kar.classList.add("form-option")
    kesz.classList.add("form-option")
    type.appendChild(kar)
    type.appendChild(kesz)

    let karszam=document.createElement("input")
    karszam.id="kszam"
    let karszamlab=document.createElement("label")
    karszamlab.setAttribute("for","kszam")
    karszamlab.innerHTML="Kártyaszám"  
    karszam.setAttribute("placeholder","6795 5431 6342 6542")
    karszam.classList.add("form-control")

    let karexp=document.createElement("input")
    karexp.id="kexp"
    let karexplab=document.createElement("label")
    karexplab.setAttribute("for","kexp")
    karexplab.innerHTML="Lejárati Dátum"
    karexp.setAttribute("placeholder","23/01")
    karexp.classList.add("form-control")

    let karcsv=document.createElement("input")
    karcsv.id="kcsv"
    let karcsvlab=document.createElement("label")
    karcsvlab.setAttribute("for","kcsv")
    karcsvlab.innerHTML="CSV"
    karcsv.setAttribute("type","number")   
    karcsv.setAttribute("placeholder","123")
    karcsv.classList.add("form-control")

    PayList.appendChild(typeLab)
    PayList.appendChild(type)
    if (type.selectedIndex==0) {
        PayList.appendChild(karszamlab)
        PayList.appendChild(karszam)
        PayList.appendChild(karexplab)
        PayList.appendChild(karexp)
        PayList.appendChild(karcsvlab)        
        PayList.appendChild(karcsv)    
        karszam.setAttribute("required","true")
        karexp.setAttribute("required","true")
        karcsv.setAttribute("required","true")
    }

    let rendgomb=document.createElement("input")    
    rendgomb.setAttribute("type","submit")
    rendgomb.setAttribute("value","Rendelés leadása")
    rendgomb.classList.add("btn","btn-success","mt-2","w-100")
    rendgomb.addEventListener("click",async()=>{
        //actual validacio^
        let valid=true
        let adat={}
        let hiba=""
        if (type.selectedIndex==0) {
            if (!(/^[0-9]{3}$/.test(karcsv.value)&&/^[0-9]{2}\/[0-9]{2}$/.test(karexp.value)&&/^[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/.test(karszam.value))) {
                valid=false
                hiba+="Kártya"
            }
        }
        if (!(/^\+[0-9]{11}$/.test(num.value)||/^[0-9]{11}$/.test(num.value)) ) {
            hiba+="Tel"
            valid=false 
        }
        if (name.value=="") {
            hiba+="Név"
            valid=false
        }
        if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail.value))) {
            hiba+="Mail"
            valid=false
        }
        if (valid) {
            //Mivel valójában nem szállítunk semmit (meglepő), nem számít hogy mit küldünk fel az endpointra, csak az számí hogy helyes az adat
            await AdatPost("/api/AdatlapLekeres/Fizetes",adat)
        }
        else{
            alert("Hiba történt!")
        }
    })
    PayList.appendChild(rendgomb)

    type.addEventListener("change",()=>{
        if (type.selectedIndex==0) {
            PayList.removeChild(rendgomb)
            PayList.appendChild(karszamlab)
            PayList.appendChild(karszam)
            PayList.appendChild(karexplab)
            PayList.appendChild(karexp)
            PayList.appendChild(karcsvlab)        
            PayList.appendChild(karcsv)        
            PayList.appendChild(rendgomb)
            karszam.setAttribute("required","true")
            karexp.setAttribute("required","true")
            karcsv.setAttribute("required","true")
        }
        else{            
            PayList.removeChild(rendgomb)
            PayList.removeChild(karszamlab)
            PayList.removeChild(karszam)
            PayList.removeChild(karexplab)
            PayList.removeChild(karexp)
            PayList.removeChild(karcsvlab)        
            PayList.removeChild(karcsv)
            PayList.appendChild(rendgomb)
            karszam.removeAttribute("required","true")
            karexp.removeAttribute("required","true")
            karcsv.removeAttribute("required","true")
        }
    })
    

    //PayList.appendChild()
    c.appendChild(termékekList)
    c.appendChild(PayList)
    összJelző.innerHTML=`Összesen: ${total} Ft`
    összJelző.classList.add("ps-3")
    //await AdatPost()
    //KosarLekeres()
}

function visszaepites(){    
        let gombSáv=document.getElementById("KosárGombok")
        gombSáv.innerHTML=""
        let összJelző=document.getElementById("IdeKosár")
        összJelző.innerHTML=""
        let c=document.getElementById("KosárFizetésGomb")
        c.innerHTML=""
        let termSzov=document.createElement("span")
        termSzov.innerHTML="A Kosárban lévő termékek"
        termSzov.classList.add("fs-3","align-middle")
        let fizgom=document.createElement("input")
        let delgom=document.createElement("input")
        let modgom=document.createElement("input")
        fizgom.setAttribute("type","button")
        fizgom.setAttribute("id","KosárFizet")
        fizgom.setAttribute("value","Fizetés")
        fizgom.classList.add("btn","btn-success","ms-1")        
        delgom.setAttribute("type","button")
        delgom.setAttribute("id","KosárDelete")
        delgom.setAttribute("value","Kosár Ürítése")
        delgom.classList.add("btn","btn-danger","ms-1")        
        modgom.setAttribute("type","button")
        modgom.setAttribute("id","KosárEdit")
        modgom.setAttribute("value","Kosár Módosítása")
        modgom.classList.add("btn","btn-info","ms-1")
        gombSáv.innerHTML=""
        gombSáv.appendChild(termSzov)
        gombSáv.appendChild(fizgom)
        gombSáv.appendChild(delgom)
        gombSáv.appendChild(modgom)
}

function betoltes(oldal){
    let oldalak=[AdatlapLekeres,KedvencekLekeres,KoktelokLekeres,JelentesekLekeres,KosarLekeres]
    oldalak[oldal]()
    
}
