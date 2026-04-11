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
        method: "GET",
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
const AdatPost=async(url,data,tipus)=>{
    try {
        let ertek
        if (data!=null) {
            ertek=await fetch(url,{
                method:tipus,
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            })  
        }
        else{
            ertek=await fetch(url,{
                method:tipus,
                headers:{"Content-Type":"application/json"}
            })  
        }
        if (ertek.ok) {
          return ertek.status
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

let AdatMentes=document.createElement("input")
let AdatMégse=document.createElement("input")

async function AdatlapLekeres(){
    //Adatok Lekérése
    const valasz=await AdatGet("/api/AdatlapLekeres/FelhAdatok/")
    console.log(valasz);
    
    const kep=await AdatGetKep("/api/AdatlapLekeres/KepLekeres/"+valasz.tartalom.adat.ProfilkepUtvonal)
    //A Felhasználó Azon Adatai, amelyeket tud majd módosítani betöltése
    let ertek=valasz.tartalom.adat;
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
                        
                    }//" " a space ellenőrzés
                    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(AdatlapEmail.value)&&/^[a-zA-Z0-9_]{2,30}$/.test(AdatlapFelh.value)) {
                            FelhAdatok.Felhasználónév=AdatlapFelh.value
                            FelhAdatok.Email=AdatlapEmail.value
                    }
                    else{
                        eredmény.innerHTML="A felhasználónév / email-cím nem felel meg a követelményeknek!"
                        return false
                    }
                    FelhAdatok.Felhasználónév=AdatlapFelh.value
                    FelhAdatok.Email=AdatlapEmail.value
                    const data=new FormData()
                    //A Kép Eltárolása. Visszakapjuk a kép új nevét, amit továbbadunk az adatbázisnak   
                    if(titkos.files.length!=0){
                        if (titkos.files[0].type!="image/jpeg"&&titkos.files[0].type!="image/png"&&titkos.files[0].type!="image/bmp"&&titkos.files[0].type!="image/webp") {
                            eredmény.innerHTML="A megadott fájl nem felel meg a követelményeknek!"
                            return false
                        }
                        else{
                            data.append("profilkep",titkos.files[0])
                            const kepUtvonal=await AdatPostKep("/api/AdatlapLekeres/KepFeltoltes",data)
                            FelhAdatok.KépÚtvonal=kepUtvonal.message
                        }
                    }
                    if(AdatlapJelszo2.value!=AdatlapJelszo.value&&AdatlapJelszoValtozatas.checked==true){
                        eredmény.innerHTML="A kettő jelszó nem egyezik!"

                        return false
                    }
                    else if(AdatlapJelszo2.value==AdatlapJelszo.value&&AdatlapJelszoValtozatas.checked==true&&/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(AdatlapJelszo)==false){
                        eredmény.innerHTML="A Jelszó nem felel meg a követelményeknek!"
                        return false
                    }
                    else{

                        FelhAdatok.Jelszó=AdatlapJelszo.value
                        
                        let valasz=await AdatPost("/api/AdatlapLekeres/Adatmodositas/",FelhAdatok,"PUT")
                        console.log(valasz);
                        if (valasz=="200") {
                            return true
                        }
                        else{
                            eredmény.innerHTML="Váratlan hiba történt!"
                            return false
                        }
                    }
                    
            } 
            catch (error) {
                //redirect?
                console.log(error);
                
                eredmény.innerHTML="Váratlan hiba történt!"
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
    document.getElementById("KeszitKoktelNum").innerHTML=valasz.tartalom.keszitett.MAKEID
    document.getElementById("KedveltKoktelNum").innerHTML=valasz.tartalom.kedvenc.KEDVID
    document.getElementById("KommentNum").innerHTML=valasz.tartalom.komment.KOMMID
    document.getElementById("ErtekNum").innerHTML=valasz.tartalom.ertekeles.RATEID

    
}
async function KedvencekLekeres() {
    const valasz=await AdatGet("/api/AdatlapLekeres/Kedvencek/")

    let hova=document.getElementById("IdeKedvenc")
    hova.innerHTML=""
    for (let i = 0; i < valasz.adat.length; i++) {
        let koktel=kartyakeszites(valasz.adat[i])
        koktelextrak(koktel,valasz.adat[i])
        hova.appendChild(koktel)
    }
    while (hova.childNodes.length%4!=0) {
        let kamukartyaDiv=document.createElement("div")
        kamukartyaDiv.classList.add("col-10","col-sm-7","col-md-7","col-lg-6","col-xl-5","col-xxl-3","mb-1")
        hova.appendChild(kamukartyaDiv)
    }

    
}
async function KoktelokLekeres() {
    const valasz=await AdatGet("/api/AdatlapLekeres/Koktelok/")

    let hova=document.getElementById("IdeSaját")
    hova.innerHTML=""
    for (let i = 0; i < valasz.adat.length; i++) {
        let koktel=kartyakeszites(valasz.adat[i])
        koktelextrak(koktel,valasz.adat[i])
        hova.appendChild(koktel)
    }
    while (hova.childNodes.length%4!=0) {
        let kamukartyaDiv=document.createElement("div")
        kamukartyaDiv.classList.add("col-10","col-sm-7","col-md-7","col-lg-6","col-xl-5","col-xxl-3","mb-1")
        hova.appendChild(kamukartyaDiv)
    }

    
    
    
}
async function JelentesekLekeres() {
    const valasz=await AdatGet("/api/AdatlapLekeres/Jelentesek/")
    let hova=document.getElementById("IdeReport")
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
            if (valasz.adat[i][0].JelentesTipusa=="Koktél") {
                JelentesNev.innerHTML="Jelentett Koktél"
                JelentesText.innerHTML=`Feljelentetted ${valasz.rep[i][1].Felhasználónév} "${valasz.rep[i][0].KoktelCim}" című koktélját.<br>Indok:${valasz.adat[i][1].JelentesIndoka}`
                JelentesDiv.appendChild(JelentesNev)
                JelentesNev.appendChild(sortör)
                JelentesDiv.appendChild(JelentesText)
                
                
            }
            else if(valasz.adat[i][0].JelentesTipusa=="Komment"){
                JelentesNev.innerHTML="Jelentett Komment"
                JelentesText.innerHTML=`Feljelentetted ${valasz.rep[i][1][0].Felhasználónév} "${valasz.rep[i][0][0].Tartalom}" Kommentjét.<br>Indok:${valasz.adat[i][1].JelentesIndoka}`
                JelentesDiv.appendChild(JelentesNev)
                JelentesNev.appendChild(sortör)
                JelentesDiv.appendChild(JelentesText)
            }
            else{
                JelentesNev.innerHTML="Jelentett Felhasználó"
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
                let mit={
                    tettes:valasz.adat[i][1].JelentésID,
                    id:4,
                    tipus:valasz.adat[i][0].JelentesTipusa
                }
                
                
                AdatPost("/api/AdatlapLekeres/JelentesTorles",mit,"DELETE")
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

    let kosárMódosít=document.getElementById("KosárEdit")
    let kosárModMégse=document.createElement("input")
    let kosárModIgen=document.createElement("input")

    let kosárFizet=document.getElementById("KosárFizet")

    let kosárÜrít=document.getElementById("KosárDelete")

    let kosárGombok=document.getElementById("KosárGombok")

    let hova=document.getElementById("IdeKosár")
    //Ez a változó jelöli a tényleges kártyák számát
    let valodi=0
    hova.innerHTML=""
    if (valasz.message=="Üres Kosár") {
        document.getElementById("KosarAllapot").innerHTML="Üres A Kosarad!"
        kosárGombok.innerHTML=""
    }
    else{
        
        for (let i = 0; i < valasz.adat.length; i++) {
            let kosar=kartyakeszites(valasz.adat[i])
            await kosarextrak(kosar,valasz.adat[i])
            let mennyiseg=(kosar.getElementsByClassName("mennyiseg"))[0]
            let osszar=(kosar.getElementsByClassName("osszar"))[0]

            mennyiseg.innerHTML=valasz.adat[i].kosarAdatok.Darabszam
            osszar.innerHTML=mennyiseg.innerHTML*valasz.adat[i].kosarAdatok.EgysegAr
            hova.appendChild(kosar)
            //Jelezzuk hogy elkeszult egy kartya
            valodi++
        }
        osszeg()
        
        //Szeretnénk hogy a tördelés rendesen működjön a részleges sorokban is, így kamu kártyákat helyzünk el a tördelési elemekkel benne hogy úgy viselkedjen
        while (hova.childNodes.length%4!=0) {
            let kamukartyaDiv=document.createElement("div")
            kamukartyaDiv.classList.add("col-10","col-sm-7","col-md-7","col-lg-6","col-xl-5","col-xxl-3","mb-1")
            hova.appendChild(kamukartyaDiv)
        }

        kosárMódosít.addEventListener("click",()=>{
            gombrejtes()
            for (let i = 0; i < valodi; i++) {
                let mennyiseg=(hova.children[i].getElementsByClassName("mennyiseg"))[0]

                let kosárDbMod=document.createElement("input")
                kosárDbMod.setAttribute("type","number")
                kosárDbMod.setAttribute("min","1")
                kosárDbMod.setAttribute("max",valasz.adat[i].termAdatok.TermekKeszlet)
                kosárDbMod.setAttribute("value",mennyiseg.innerHTML)
                mennyiseg.innerHTML=""
                mennyiseg.appendChild(kosárDbMod)

                let termekKuka=document.createElement("input")
                termekKuka.setAttribute("type","button")
                termekKuka.classList.add("btn","kuka","fs-3")
                termekKuka.setAttribute("value","🗑︎")
                termekKuka.addEventListener("click",()=>{
                    AdatPost("/api/AdatlapLekeres/TermekUrites/",{termék:valasz.adat[i].kosarAdatok.TermekID},"DELETE")
                    KosarLekeres()
                })
                hova.children[i].children[0].appendChild(termekKuka)
            }
            kosárModIgen.setAttribute("type","button")
            kosárModIgen.setAttribute("value","Mentés")
            kosárModIgen.classList.add("btn","btn-success","me-1")
            kosárModIgen.addEventListener("click",async()=>{
                for (let i = 0; i < valodi; i++) {
                    let mennyiseg=(hova.children[i].getElementsByClassName("mennyiseg"))[0]
                    let ujMennyiseg=mennyiseg.childNodes[0].value
                    if (ujMennyiseg>valasz.adat[i].termAdatok.TermekKeszlet) {
                        
                    }
                    else{
                        mennyiseg.innerHTML=ujMennyiseg
                        await AdatPost("/api/AdatlapLekeres/TermekFrissites",{termék:valasz.adat[i].kosarAdatok.TermekID,count:ujMennyiseg},"PATCH")
                    }
                    hova.children[i].children[0].removeChild(hova.children[i].children[0].children[3])
                }
                osszeg()
                gombhivas()
            })
            kosárGombok.appendChild(kosárModIgen)

            kosárModMégse.setAttribute("type","button")
            kosárModMégse.setAttribute("value","Mégse")
            kosárModMégse.classList.add("btn","btn-danger")
            kosárGombok.appendChild(kosárModMégse)

        })

        //Kosár kiürítése
        kosárÜrít.addEventListener("click",()=>{
            try {
                AdatPost("/api/AdatlapLekeres/Kosarurites/",null,"DELETE")
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
    function osszeg(){
        let osszeg=0
        for (let i = 0; i < valodi; i++) {
            let osszar=(hova.childNodes[i].getElementsByClassName("osszar"))[0]
            let mennyiseg=(hova.childNodes[i].getElementsByClassName("mennyiseg"))[0]
        
            osszar.innerHTML=parseInt(mennyiseg.innerHTML)*parseInt(valasz.adat[i].kosarAdatok.EgysegAr)
            osszeg+=parseInt(mennyiseg.innerHTML)*parseInt(valasz.adat[i].kosarAdatok.EgysegAr)
        }
        document.getElementById("KosárFizetésGomb").innerHTML="Összesen: "+osszeg+" Ft"
    }
    function gombrejtes(){
        kosárMódosít.setAttribute("hidden","true")
        kosárFizet.setAttribute("hidden","true")
        kosárÜrít.setAttribute("hidden","true")

    }
    function gombhivas(){
        kosárMódosít.removeAttribute("hidden","true")
        kosárFizet.removeAttribute("hidden","true")
        kosárÜrít.removeAttribute("hidden","true")
        //mivel törlődik a 3. elem ezért ha meghívom megint akkor a 4. ami mostmár 3. is törlődik
        kosárGombok.removeChild(kosárGombok.children[3])
        kosárGombok.removeChild(kosárGombok.children[3])
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
            await AdatPost("/api/AdatlapLekeres/Fioktorles","","DELETE")
            await AdatPost("/api/Kijelentkezes","","POST")
            window.location.href="/"
        }
        
    },{once:true})
    
    
    
}


async function fizetes(){
    let gombSáv=document.getElementById("KosárGombok")
    gombSáv.innerHTML=""
    let összJelző=document.getElementById("IdeKosár")
    összJelző.innerHTML=""
    let gombok=document.getElementById("KosárFizetésGomb")
    gombok.innerHTML=""

    let gomb=document.createElement("input")
    let kosar=await AdatGet("/api/AdatlapLekeres/Kosar")
    console.log(kosar);
    
    let termekek=kosar.adat
    console.log(termekek);
    
    
    
    gomb.setAttribute("type","button")
    gomb.setAttribute("value","Vissza")
    gomb.classList.add("btn","btn-secondary")
    //Visszaépítem a Gombokat mert nem dinamikusak de törölhetőek
    gomb.addEventListener("click",()=>{
        visszaepites()
        KosarLekeres()
    })
    gombSáv.appendChild(gomb)
    gombok.classList.add("mt-2","dark")
    let total=0
    //Termék Adatok
    let termékekList=document.createElement("div")
    gombok.classList.add("row","justify-content-md-center","justify-content-sm-center","justify-content-lg-between")
    termékekList.classList.add("col-12","col-lg-4","col-md-6","col-sm-12","bg-light","rounded","p-2","border","border-dark")
    let szoveg=document.createElement("div")
    szoveg.innerHTML="Termék Adatok"
    termékekList.appendChild(szoveg)

    for (let i = 0; i < termekek.length; i++) {
        let termekadatok=kosar.adat[i].kosarAdatok
        let sor=document.createElement("div")
        sor.classList.add("border-top","border-dark")
        sor.innerHTML=termekek[i].termAdatok.TermekCim+" - "+`${termekadatok.Darabszam}db `+(termekadatok.EgysegAr*termekadatok.Darabszam)+" Ft"
        total+=termekadatok.EgysegAr*termekadatok.Darabszam
        termékekList.appendChild(sor)
    }
    let osszeg=document.createElement("div")
    osszeg.classList.add("border-top","border-dark","fs-4")
    osszeg.innerHTML="Összesen: "+total+" Ft"
    termékekList.appendChild(osszeg)
    //Számlázási Adatok
    let PayList=document.createElement("form")
    PayList.classList.add("col-12","col-lg-4","col-md-6","col-sm-12","border","border-dark","bg-light","rounded","p-2","needs-validation")
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
            await AdatPost("/api/AdatlapLekeres/Fizetes",adat,"POST")
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
    gombok.appendChild(termékekList)
    gombok.appendChild(PayList)
    //összJelző.innerHTML=`Összesen: ${total} Ft`
    //összJelző.classList.add("ps-3")
    //await AdatPost()
    //KosarLekeres()
}

function visszaepites(){    
        let gombSáv=document.getElementById("KosárGombok")
        gombSáv.innerHTML=""
        let összJelző=document.getElementById("IdeKosár")
        összJelző.innerHTML=""
        //összJelző.classList.remove("ps-3")
        let gombok=document.getElementById("KosárFizetésGomb")
        gombok.innerHTML=""
        gombok.classList.remove("mt-2","dark")
        document.getElementById("KosarAllapot").innerHTML="A Kosárban lévő termékek"
        let fizgom=document.createElement("input")
        let delgom=document.createElement("input")
        let modgom=document.createElement("input")
        fizgom.setAttribute("type","button")
        fizgom.setAttribute("id","KosárFizet")
        fizgom.setAttribute("value","Fizetés")
        fizgom.classList.add("btn","btn-success")        
        delgom.setAttribute("type","button")
        delgom.setAttribute("id","KosárDelete")
        delgom.setAttribute("value","Kosár Ürítése")
        delgom.classList.add("btn","btn-danger","ms-1")        
        modgom.setAttribute("type","button")
        modgom.setAttribute("id","KosárEdit")
        modgom.setAttribute("value","Kosár Módosítása")
        modgom.classList.add("btn","btn-info","ms-1")
        gombSáv.innerHTML=""
        
        gombSáv.appendChild(fizgom)
        gombSáv.appendChild(delgom)
        gombSáv.appendChild(modgom)
}

function betoltes(oldal){
    let oldalak=[AdatlapLekeres,KedvencekLekeres,KoktelokLekeres,JelentesekLekeres,KosarLekeres]
    oldalak[oldal]()
    
}


function kartyakeszites(adatok){
    let kartyaDiv=document.createElement("div") //A kártya divje
    let kartya=document.createElement("div") //A kártya
    let kartyaBody=document.createElement("div") //A kártya többi adatának a divje

    let kartyaKep=document.createElement("img") //kép
    let kartyaTitle=document.createElement("h4") //cim
    let kartyaErtekeles=document.createElement("div") //ertekeles
    let kartyaKommentek=document.createElement("div") //kommentek
    let kartyaMisc=document.createElement("div") //Minden nem általános dolog ide fog menni
    let kartyaGombDiv=document.createElement("div")
    let kartyaGomb=document.createElement("input") //Gomb
    
    kartyaDiv.classList.add("col-10","col-sm-7","col-md-7","col-lg-6","col-xl-5","col-xxl-3","mb-1")
    kartya.classList.add("card","h-100","justify-content-between","d-flex")
    kartyaKep.classList.add("card-img-top","kep")
    kartyaBody.classList.add("card-body","flex-column")
    kartyaGombDiv.classList.add("px-3","pb-3")
    kartyaTitle.classList.add("card-title")
    kartyaGomb.classList.add("btn","btn-secondary","w-100","mt-auto")
    kartyaMisc.classList.add("misc") // Referencia érdekében
    
    
    //
    if (adatok.ertekeles.Osszert!=null) 
    {
        let csillagert=Math.ceil(adatok.ertekeles.Osszert)
        let csillagok=""
        for (let i = 0; i < csillagert; i++) {
            csillagok+="★"
        }
        for (let i = 0; i < 5-csillagert; i++) {
            csillagok+="☆"
            
        }
        kartyaErtekeles.innerHTML=`Értékelés:${csillagok} (${Math.fround(adatok.ertekeles.Osszert)})`
    }
    else
    {
        kartyaErtekeles.innerHTML="Nincs még értékelés!"
    }
    //Van-e komment
    if (adatok.kommentek.Kommnum!=0) 
    {
        kartyaKommentek.innerHTML=`Kommentek Száma:${adatok.kommentek.KommNum}`
    }
    else
    {
        kartyaKommentek.innerHTML="Nincs még komment!"
    }                

    //Összeépítés
    kartyaBody.appendChild(kartyaTitle)
    kartyaBody.appendChild(kartyaErtekeles)
    kartyaBody.appendChild(kartyaMisc)
    kartyaBody.appendChild(kartyaKommentek)
    kartyaGombDiv.appendChild(kartyaGomb)
    kartya.appendChild(kartyaKep)
    kartya.appendChild(kartyaBody)
    kartya.appendChild(kartyaGombDiv)
    kartyaDiv.appendChild(kartya)
    return kartyaDiv
}

async function koktelextrak(dolog,adat){
    let kep=dolog.getElementsByClassName("kep")[0]
    kep.setAttribute("src",URL.createObjectURL(await AdatGetKep("/api/AdatlapLekeres/KepLekeres/"+adat.adat.BoritoKepUtvonal)))
    let badgek=dolog.getElementsByClassName("misc")[0]
    let kartyaTitle=dolog.getElementsByClassName("card-title")[0]
    kartyaTitle.innerHTML=adat.adat.KoktelCim

    let gomb=dolog.getElementsByClassName("btn-secondary")[0]
    gomb.setAttribute("value","Tovább a Koktélra")
    gomb.addEventListener("click",()=>{
        window.location.href=`http://127.0.0.1:3000/Koktel/${adat.adat.KoktélID}`
    })
    
    let badgeDiv=document.createElement("div")
    for (let i = 0; i < adat.jelvenyek.length; i++) {
        let badge=document.createElement("span")
        badge.innerHTML=adat.jelvenyek[i].JelvényNeve
        badge.classList.add("badge","me-1","text-white","rounded-pill")
        switch (adat.jelvenyek[i].JelvenyKategoria) {
           case "ízek":
               badge.classList.add("bg-success")
           break;

           case "Allergének":
               badge.classList.add("bg-warning")
           break;

           case "Erősség":
               badge.classList.add("bg-danger")
           break;
        }
        badgeDiv.appendChild(badge)
    }    
    badgek.appendChild(badgeDiv)
    let osszetevokDiv=document.createElement("div")
    let osszetevokHeader=document.createElement("div")
    osszetevokHeader.innerHTML="Összetevők:"
    let osszetevok=document.createElement("ul")
    if (adat.osszetevok.length>3) {
        for (let i = 0; i < 3; i++) {
            let osszetevo=document.createElement("li")
            osszetevo.innerHTML=adat.osszetevok[i].Osszetevő
            osszetevok.appendChild(osszetevo)
        }
        let osszetevo=document.createElement("li")
        osszetevo.innerHTML=`És további ${adat.osszetevok.length-3} összetevő`
        osszetevok.appendChild(osszetevo)
    }
    else{
        for (let i = 0; i < adat.osszetevok.length; i++) {
            let osszetevo=document.createElement("li")
            osszetevo.innerHTML=adat.osszetevok[i].Osszetevő
            osszetevok.appendChild(osszetevo)
        }
        for (let i = 0; i < 4-adat.osszetevok.length; i++) {
            let osszetevo=document.createElement("div")
            osszetevo.style.height="24px"
            osszetevok.appendChild(osszetevo)
        }
    }

    osszetevokDiv.appendChild(osszetevokHeader)
    osszetevokDiv.appendChild(osszetevok)
    badgek.appendChild(osszetevokDiv)

}

async function kosarextrak(dolog,adat){
    let kep=dolog.getElementsByClassName("kep")[0]
    kep.setAttribute("src",URL.createObjectURL(await AdatGetKep("/api/AdatlapLekeres/KepLekeres/"+adat.termAdatok.TermekKepUtvonal)))
    let adatok=dolog.getElementsByClassName("misc")[0]
    let kartyaTitle=dolog.getElementsByClassName("card-title")[0]
    kartyaTitle.innerHTML=adat.termAdatok.TermekCim

    let gomb=dolog.getElementsByClassName("btn-secondary")[0]
    gomb.setAttribute("value","Tovább a Termékre")
    gomb.addEventListener("click",()=>{
        window.location.href=`http://127.0.0.1:3000/Koktel/${adat.kosarAdatok.TermekID}`
    })


    let termekLeiras=document.createElement("div")
    //Mivel nem szükséges/előnyös kiírni a teljes leírást a cardba, egy adott hossz után levágjuk,ha a felhasználó többet akar olvalsni, akkor rá fog nyomni a gombra
    let szoveg=""
    //kiszedjük az összes spacet a leírásból, és ennek a hosszát ellenőrizzük
    //ha ez nagyobb mint 40 karakter akkor csak 37-et és 3 pontot írunk ki, ha kissebb vagy annyi akkor az egészet
    if ((adat.termAdatok.TermekLeiras.replaceAll(" ","")).length>40) {
        for (let i = 0; i < 37; i++) {
           szoveg+=adat.termAdatok.TermekLeiras[i]
        }
        szoveg+="..."
    }
    else{
        szoveg=adat.termAdatok.TermekLeiras
    }
    
    termekLeiras.innerHTML=szoveg
    
    let termekAdatok=document.createElement("div")
    termekAdatok.classList.add("py-2")

    let termekEgysegar=document.createElement("div")
    termekEgysegar.innerHTML="Egységár: "+adat.kosarAdatok.EgysegAr+"/db"

    let termekDarabszamDiv=document.createElement("div")
    let termekDarabszam=document.createElement("span")
    termekDarabszam.classList.add("mennyiseg")
    termekDarabszamDiv.innerHTML="Rendelt mennyiség: "
    termekDarabszamDiv.appendChild(termekDarabszam)
    termekDarabszamDiv.innerHTML+="db"

    let termekOsszarDiv=document.createElement("div")
    let termekOsszar=document.createElement("span")
    termekOsszar.classList.add("osszar")
    termekOsszarDiv.innerHTML="Összesen: "
    termekOsszarDiv.appendChild(termekOsszar)
    termekOsszarDiv.innerHTML+="Ft."

    adatok.appendChild(termekLeiras)
    termekAdatok.appendChild(termekEgysegar)
    termekAdatok.appendChild(termekDarabszamDiv)
    termekAdatok.appendChild(termekOsszarDiv)
    adatok.appendChild(termekAdatok)

}