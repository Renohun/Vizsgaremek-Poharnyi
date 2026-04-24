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

    if (window.location.href.split("#")[1]!=undefined) {
        //https://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
        document.getElementById("Kosár").click()
    }
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
        if (ertek.status==200) {
            return ertek.json()
        }
        else{
            return "Üres"
        }
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

    let AdatlapJelszoMutatas=document.getElementById("pwShow")


    let AdatlapKep=document.getElementById("profilkep")
    AdatlapFelh.value=ertek.Felhasználónév
    AdatlapEmail.value=ertek.Email
    let csillagok=""
    for (let i = 0; i < ertek.JelszóHossza; i++) {
        csillagok+="*"
        
    }
    AdatlapJelszo.value=csillagok
    AdatlapKep.setAttribute("src",kapottkep)



    //A Módosítás Gomb Következményei
    let modosit=document.getElementById("Módosítás")
    let hovaGombok=document.getElementById("AdatlapGombok")
    let titkos=document.getElementById("input")
    modosit.addEventListener("click",()=>{
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
        modosit.setAttribute("hidden","true")

        document.getElementById("pwChangeDiv").removeAttribute("hidden","true")
        
        AdatlapJelszoValtozatas.addEventListener("click",()=>{
            if (AdatlapJelszoValtozatas.checked) {
                document.getElementById("pwShowDiv").removeAttribute("hidden","true")
                AdatlapJelszo.value=""
                AdatlapJelszo.removeAttribute("disabled","true")
                AdatlapJelszo2.removeAttribute("disabled","true")
                AdatlapJelszo2.removeAttribute("hidden","true")
                AdatlapJelszoLabel2.removeAttribute("hidden","true")

                AdatlapJelszoMutatas.addEventListener("click",()=>{
                    if (AdatlapJelszoMutatas.checked) {
                        AdatlapJelszo.setAttribute("type","text")
                        AdatlapJelszo2.setAttribute("type","text")
                    }
                    else{
                        AdatlapJelszo.setAttribute("type","password")
                        AdatlapJelszo2.setAttribute("type","password")
                    }
                })
            }
            else{
                document.getElementById("pwShowDiv").setAttribute("hidden","true")
                AdatlapJelszo.value=tempJelszo
                AdatlapJelszo.setAttribute("disabled","true")
                AdatlapJelszo2.setAttribute("disabled","true")
                AdatlapJelszo2.setAttribute("hidden","true")
                AdatlapJelszoLabel2.setAttribute("hidden","true")
            }
        })
        hovaGombok.appendChild(AdatMentes)
        hovaGombok.appendChild(AdatMégse)
        AdatMentes.addEventListener("click",async()=>
        {
            await adatvaltas()
        })
        AdatMégse.addEventListener("click",()=>
        {
                undo()
                GombOles()
        
        })
        function undo(){
            try {
                AdatlapFelh.value=tempFelh
                AdatlapEmail.value=tempMail
                AdatlapJelszo.value=tempJelszo
                AdatlapKep.setAttribute("src",tempKep)
                modal("Siker","Sikeres Visszavonás!")
            } 
            catch (error) {
                modal("Hiba","Váratlan Hiba Történt!")
            }
        }

        async function adatvaltas(){
            try {
                    let hiba=""
                    let FelhAdatok={
                        
                    }//" " a space ellenőrzés
                    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(AdatlapEmail.value)&&/^[a-zA-Z0-9_]{2,30}$/.test(AdatlapFelh.value)) {
                            FelhAdatok.Felhasználónév=AdatlapFelh.value
                            FelhAdatok.Email=AdatlapEmail.value
                    }
                    else{
                        hiba+="\t A felhasználónév / email-cím nem felel meg a követelményeknek!"
                    }
                    FelhAdatok.Felhasználónév=AdatlapFelh.value
                    FelhAdatok.Email=AdatlapEmail.value
                    const data=new FormData()
                    //A Kép Eltárolása. Visszakapjuk a kép új nevét, amit továbbadunk az adatbázisnak   
                    if(titkos.files.length!=0){

                        if (titkos.files[0].type!="image/jpeg"&&titkos.files[0].type!="image/png"&&titkos.files[0].type!="image/bmp"&&titkos.files[0].type!="image/webp") {
                            hiba+="\t A megadott fájl nem felel meg a követelményeknek!"
                        }
                        else{

                            data.append("profilkep",titkos.files[0])
                            const kepUtvonal=(await AdatPostKep("/api/AdatlapLekeres/KepFeltoltes",data)).message

                            FelhAdatok.KépÚtvonal=kepUtvonal
                        }
                    }
                    if (AdatlapJelszoValtozatas.checked==true) {
                        
                        if(AdatlapJelszo2.value!=AdatlapJelszo.value){
                            hiba+="\t A kettő jelszó nem egyezik!"
                        }
                        else if(AdatlapJelszo2.value==AdatlapJelszo.value&&AdatlapJelszoValtozatas.checked==true&&/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(AdatlapJelszo.value)==false){
                            hiba+="\t A Jelszó nem felel meg a követelményeknek!"
                        }
                        else{
                            FelhAdatok.Jelszó=AdatlapJelszo.value
                        }
                    }
                    else{
                        let valasz=await AdatPost("/api/AdatlapLekeres/Adatmodositas/",FelhAdatok,"PUT")
                        if (valasz=="200") {
                            modal("Sikeres Adatmódosítás!","Az Adatai sikeresen frissültek!")
                            document.getElementsByClassName("profil")[0].setAttribute("src",AdatlapKep.getAttribute("src"))
                            GombOles()
                        }
                        else{
                            modal("Hiba","Váratlan Hiba Történt!")
                        }
                    }
                    if (hiba!="") {
                        modal("Hibás adatok!","Az alábbi adatok hibásak:"+hiba)
                    }
                    
            } 
            catch (error) {
                modal("Hiba","Váratlan Hiba Történt!")
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
        AdatlapFelh.setAttribute("disabled","true")
        AdatlapEmail.setAttribute("disabled","true")
        modosit.removeAttribute("hidden","true")
        titkos.setAttribute("disabled","true")
        AdatlapJelszo.setAttribute("disabled","true")
        AdatlapJelszo2.setAttribute("disabled","true")        
        AdatlapJelszo2.setAttribute("hidden","true")        
        AdatlapJelszoLabel2.setAttribute("hidden","true")        
        AdatlapJelszo.setAttribute("type","password")
        AdatlapJelszo2.setAttribute("type","password")
        document.getElementById("pwShowDiv").setAttribute("hidden","true")
        document.getElementById("pwChangeDiv").setAttribute("hidden","true")
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
    if (valasz!="Üres") {
        
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
    else{
        hova.innerHTML="Nincs kedvenc koktélod!"
    }

    
}
async function KoktelokLekeres() {
    const valasz=await AdatGet("/api/AdatlapLekeres/Koktelok/")

    let hova=document.getElementById("IdeSaját")
    if (valasz!="Üres") {
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
    else{
        hova.innerHTML="Nincs saját koktélod!"
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
            let JelentesIndok=document.createElement("div")
            let JelentesNev=document.createElement("div")
            let JelentesText=document.createElement("div")
            let JelentesAllapota=document.createElement("div")
            let JelentesVisszavonasa=document.createElement("input")
            JelentesDiv.classList.add("card","col-10","col-sm-7","col-md-7","col-lg-6","col-xl-5","col-xxl-3","mb-1","d-flex")
            JelentesNev.classList.add("fs-4","text-center","pb-2","border-bottom","border-solid")
            //JelentesNev.style.height="50px"
            JelentesVisszavonasa.classList.add("btn","btn-danger","mb-2")
            JelentesVisszavonasa.setAttribute("type","button")
            JelentesVisszavonasa.setAttribute("value","Jelentés Visszavonása")
            JelentesAllapota.classList.add("text-center","mt-auto")  
            if (valasz.adat[i][0].JelentesTipusa=="Koktél") {
                JelentesNev.innerHTML="Jelentett Koktél"
                JelentesText.innerHTML=`Feljelentetted ${valasz.rep[i][1][0].Felhasználónév} "${valasz.rep[i][0][0].KoktelCim}" című koktélját.`
                JelentesDiv.appendChild(JelentesNev)
        
                JelentesDiv.appendChild(JelentesText)
                
                
            }
            else if(valasz.adat[i][0].JelentesTipusa=="Komment"){
                JelentesNev.innerHTML="Jelentett Komment"
                JelentesText.innerHTML=`Feljelentetted ${valasz.rep[i][1][0].Felhasználónév} "${valasz.rep[i][0][0].Tartalom}" Kommentjét.`
                JelentesDiv.appendChild(JelentesNev)
        
                JelentesDiv.appendChild(JelentesText)
            }
            else{
                JelentesNev.innerHTML="Jelentett Felhasználó"
                JelentesText.innerHTML=`Feljelentetted ${valasz.rep[i][0].Felhasználónév} Felhasználót.`
                JelentesDiv.appendChild(JelentesNev)
        
                JelentesDiv.appendChild(JelentesText)
            }
            JelentesIndok.innerHTML=`Indok:${valasz.adat[i][1].JelentesIndoka}`
            JelentesDiv.appendChild(JelentesIndok)
            if (valasz.adat[i][0].JelentesAllapota=="0") {
                JelentesAllapota.innerHTML="Jelenlegi Állapota: Elküldve"
            }
            else if (valasz.adat[i][0].JelentesAllapota=="2") {
                JelentesAllapota.innerHTML="Jelenlegi Állapota: Elfogadva!"
            }
            else{
                JelentesAllapota.innerHTML="Jelenlegi Állapota: Elutasítva!"
            }

            JelentesVisszavonasa.addEventListener("click",()=>{
                            
                AdatPost("/api/AdatlapLekeres/JelentesTorles",{tettes:valasz.adat[i][1].JelentésID},"DELETE")
                JelentesekLekeres()
            })

            
            JelentesDiv.appendChild(JelentesAllapota)
            JelentesDiv.appendChild(JelentesVisszavonasa)
            hova.appendChild(JelentesDiv)
        }
        while (hova.childNodes.length%4!=0) {
            let kamukartyaDiv=document.createElement("div")
            kamukartyaDiv.classList.add("col-10","col-sm-7","col-md-7","col-lg-6","col-xl-5","col-xxl-3","mb-1")
            hova.appendChild(kamukartyaDiv)
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
                kosárDbMod.addEventListener("change",()=>{
                    if (parseInt(kosárDbMod.value)>parseInt(valasz.adat[i].termAdatok.TermekKeszlet)) {
                        kosárDbMod.value=valasz.adat[i].termAdatok.TermekKeszlet
                    }
                })
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
            },{once:true})
            kosárGombok.appendChild(kosárModIgen)

            kosárModMégse.setAttribute("type","button")
            kosárModMégse.setAttribute("value","Mégse")
            kosárModMégse.classList.add("btn","btn-danger")
            kosárModMégse.addEventListener("click",()=>{
                KosarLekeres()
            },{once:true})
            
            kosárGombok.appendChild(kosárModMégse)

        })

        //Kosár kiürítése
        kosárÜrít.addEventListener("click",()=>{
            try {
                AdatPost("/api/AdatlapLekeres/Kosarurites/",null,"DELETE")
                KosarLekeres()
                modal("Siker!","Kosár sikeresen ürítve")

            } 
            catch (error) {
                modal("Hiba!","Hiba történt a kosár ürítésekor!")
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
    //Előhívjuk a modalt
    var JelIv = new bootstrap.Modal(document.getElementById('Fioktorles'), {})   
    JelIv.show()
    //Ha rányom a törlés gombra
    document.getElementById("DelConf").addEventListener("click",async()=>{
        //De helytelenül írta be a TÖRLÉS szót
        if (document.getElementById("DelConfText").value!="TÖRLÉS") {
            //Akkor nem engedjuk tovább 
            document.getElementById("feedback").innerHTML="A mező nem tartalmazza a helyes szavat!"
        }
        //Ellenben ha jól írta be
        else{
            //Kitöröljük a fiókját
            await AdatPost("/api/AdatlapLekeres/Fioktorles",null,"DELETE")
            //Kidobjuk a főoldalra
            window.location.reload()
        } 
    },{once:true})
    //Ha meggondolja magát
    document.getElementById("DelNvm").addEventListener("click",()=>{
        //Kiürítjuk a mezőt
        document.getElementById("DelConfText").value=""
        //elrejtük a modalt
        JelIv.hide()
    },{once:true})
    
    
    
}


async function fizetes(){
    //Itt lesz egy gomb ami visszavezet az "előző" felületre
    let gombSáv=document.getElementById("KosárGombok")
    
    //A felület ahol a fizetési panel és a számla fog helyezkedni
    let Fizetes=document.getElementById("IdeKosár")
    //Mindent ami a fizetés felületen volt kitörlök
    gombSáv.innerHTML=""
    document.getElementById("KosárGombok").innerHTML=""
    Fizetes.innerHTML=""
    Fizetes.classList.add("mt-2","dark","row","justify-content-md-center","justify-content-sm-center","justify-content-lg-between")

    //Újra a backendről kérem le az adatokat, manipulációt elkerülve
    let kosar=await AdatGet("/api/AdatlapLekeres/Kosar")
    let termekek=kosar.adat

    //Ha vissza akar menni a felhasználó akkor ez a gomb adja ezt a lehetőséget neki
    let gomb=document.createElement("input")
    gomb.setAttribute("type","button")
    gomb.setAttribute("value","Vissza")
    gomb.classList.add("btn","btn-secondary")
    gomb.addEventListener("click",()=>{
        //Visszaépítem a Gombokat mert nem dinamikusak de törölhetőek
        visszaepites()
        KosarLekeres()
    })
    gombSáv.appendChild(gomb)
    
    
    //Termék Adatok
    let termékekList=document.createElement("div")
    termékekList.classList.add("col-12","col-lg-4","col-md-6","col-sm-12","bg-light","rounded","p-2","border","border-dark")

    let szoveg=document.createElement("div")
    szoveg.innerHTML="Termék Adatok"
    termékekList.appendChild(szoveg)

    let total=0
    for (let i = 0; i < termekek.length; i++) {
        let termekadatok=kosar.adat[i].kosarAdatok
        let sor=document.createElement("div")
        sor.classList.add("border-top","border-dark")
        sor.innerHTML=termekek[i].termAdatok.TermekCim+" - "+`${termekadatok.Darabszam}db `+(termekadatok.EgysegAr*termekadatok.Darabszam)+" Ft"
        total+=termekadatok.EgysegAr*termekadatok.Darabszam
        termékekList.appendChild(sor)
    }

    //Itt látja a felhasználó az összesen fizetendő összeget
    let osszeg=document.createElement("div")
    osszeg.classList.add("border-top","border-dark","fs-4")
    osszeg.innerHTML="Összesen: "+total+" Ft"
    termékekList.appendChild(osszeg)

    //Számlázási Adatok Felülete
    //A form ami segít a validációban
    let PayList=document.createElement("form")
    PayList.classList.add("col-12","col-lg-4","col-md-6","col-sm-12","border","border-dark","bg-light","rounded","p-2","needs-validation")

    let payszoveg=document.createElement("div")
    payszoveg.innerHTML="Számlázási Adatok"
    PayList.appendChild(payszoveg)

    //Email
    let mailLab=document.createElement("label")
    mailLab.setAttribute("for","fizmail")
    mailLab.innerHTML="Email-Cím"
    PayList.appendChild(mailLab)

    let mail=document.createElement("input")
    mail.setAttribute("placeholder","pelda@email.cim")
    mail.setAttribute("id","fizmail")
    inputKezelo(mail)

    //Név és Labelje
    let nameLab=document.createElement("label")
    nameLab.setAttribute("for","fizname")
    nameLab.innerHTML="Teljes Név"
    PayList.appendChild(nameLab)

    let name=document.createElement("input")
    name.setAttribute("placeholder","Minta László")
    name.setAttribute("id","fizname")
    inputKezelo(name)

    //Cím és Labelje
    let locLab=document.createElement("label")
    locLab.setAttribute("for","fizplace")
    locLab.innerHTML="Teljes Cím"
    PayList.appendChild(locLab)

    let loc=document.createElement("input")
    loc.setAttribute("placeholder","1234 MintaVáros Minta u. 5")
    loc.setAttribute("id","fizplace")
    inputKezelo(loc)
    
    //Telefonszám és Labelje
    let numLab=document.createElement("label")
    numLab.innerHTML="Telefonszám"
    numLab.setAttribute("for","fiznum")
    PayList.appendChild(numLab)
    
    let num=document.createElement("input")
    num.setAttribute("placeholder","+36201234567")
    num.setAttribute("type","tel")
    num.setAttribute("id","fiznum")
    inputKezelo(num)

    function inputKezelo(dolog){
        dolog.setAttribute("required","true")
        dolog.classList.add("form-control")
        PayList.appendChild(dolog)
    }
    //Kártya Vagy Készpénz
    //Select és opcióinak létrehozása
    let typeLab=document.createElement("label")
    typeLab.innerHTML="Fizetési Mód"
    typeLab.setAttribute("for","fizmod")

    let type=document.createElement("select")
    type.classList.add("form-select")
    type.id="fizmod"

    let kar=document.createElement("option")
    kar.innerHTML="Kártyás Fizetés"
    kar.classList.add("form-option")
    type.appendChild(kar)

    let kesz=document.createElement("option")
    kesz.innerHTML="Fizetés Átvételkor"
    kesz.classList.add("form-option")
    type.appendChild(kesz)

    //A bankkártya száma
    //Formátum: 4 darab 4 számból álló szekció
    let karszam=document.createElement("input")
    karszam.id="kszam"
    let karszamlab=document.createElement("label")
    karszamlab.setAttribute("for","kszam")
    karszamlab.innerHTML="Kártyaszám"  
    karszam.setAttribute("placeholder","6795 5431 6342 6542")
    karszam.classList.add("form-control")
    //A bankkártya lejárati dátuma
    //Formátum: évszázad hanyadik éve/hónap
    let karexp=document.createElement("input")
    karexp.id="kexp"
    let karexplab=document.createElement("label")
    karexplab.setAttribute("for","kexp")
    karexplab.innerHTML="Lejárati Dátum"
    karexp.setAttribute("placeholder","23/01")
    karexp.classList.add("form-control")
    //Kártya Biztonsági Érték (CSV)
    //Formátum: 3 szám
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
    //ha kártyás fizetés van
    if (type.selectedIndex==0) {
        //Akkor megjelenítjuk a kártya információkat és kötelezővé tesszük kitöltését
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
        //Adatok validálása
        let valid=true
        let hiba=""
        //Ha a kártyás fizetés opció van kiválasztva
        if (type.selectedIndex==0) {
            //Ellenőrizzük hogy "hitelesek" a kártya adatok, avagy kinézetileg megfelelnek e egy igazinak
            //Ha nem
            if (!(/^[0-9]{3}$/.test(karcsv.value)&&/^[0-9]{2}\/[0-9]{2}$/.test(karexp.value)&&/^[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/.test(karszam.value))) {
                //akkor az hibás adat és eltároljuk hogy az volt hibás
                hiba+="Kártya"
                valid=false
            }
        }
        //Ha a telefonszám nem valós formátumú, avagy nem +36-os formátumú vagy 06-os formátumú
        //Külföldi számot is elfogadunk, csak példa értékű a fenti.
        if (!(/^\+[0-9]{11}$/.test(num.value)||/^[0-9]{11}$/.test(num.value)) ) {
            //akkor az hibás adat és eltároljuk hogy az volt hibás
            hiba+="Tel"
            valid=false 
        }
        //Ha nincs megadva név
        if (name.value=="") {
            //akkor az hibás adat és eltároljuk hogy az volt hibás
            hiba+="Név"
            valid=false
        }
        //Ha a megadott email cím nem tartalmaz legalább kettő karaktert egy @-al elválasztva, illetve urána egy pontot és a pont után 2 karaktert
        if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail.value))) {
            //akkor az hibás adat és eltároljuk hogy az volt hibás
            hiba+="Mail"
            valid=false
        }
        //ha minden adat helyes
        if (valid) {
            //Mivel valójában nem szállítunk semmit (meglepő), nem számít hogy mit küldünk fel az endpointra, csak az számít hogy helyes az adat
            await AdatPost("/api/AdatlapLekeres/Fizetes",null,"POST")
            modal("Siker!","Sikeres Fizetés!")
        }
        //Ha nem
        else{
            modal("Hibás adatok!","Az alábbi adatok nem felelnek meg a ")
        }
    })
    PayList.appendChild(rendgomb)

    //Ha a más opciót választ a felhasználó a selectben
    type.addEventListener("change",()=>{
        //ha kártyás fizetés van
        if (type.selectedIndex==0) {
            //Akkor megjelenítjuk a kártya információkat és kötelezővé tesszük kitöltését
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
        //Ha átvételes fizetés van
        else{            
            //akkor elrejtük a kártyás felületet és nem kötelező kitölteni őket
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
    

    Fizetes.appendChild(termékekList)
    Fizetes.appendChild(PayList)
}

function visszaepites(){    
        //Visszaállítom az eredeti állapotukra a diveket
        let gombSáv=document.getElementById("KosárGombok")
        gombSáv.innerHTML=""

        let összJelző=document.getElementById("IdeKosár")
        összJelző.innerHTML=""

        let gombok=document.getElementById("KosárFizetésGomb")
        gombok.innerHTML=""
        gombok.classList.remove("mt-2","dark")

        document.getElementById("KosarAllapot").innerHTML="A Kosárban lévő termékek"

        //Létrehozom a 3 alap gombot
        let fizgom=document.createElement("input")
        fizgom.setAttribute("type","button")
        fizgom.setAttribute("id","KosárFizet")
        fizgom.setAttribute("value","Fizetés")
        fizgom.classList.add("btn","btn-success")  
        
        let delgom=document.createElement("input")
        delgom.setAttribute("type","button")
        delgom.setAttribute("id","KosárDelete")
        delgom.setAttribute("value","Kosár Ürítése")
        delgom.classList.add("btn","btn-danger","ms-1")   
        
        let modgom=document.createElement("input")
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
    kartyaKommentek.classList.add("komment")
    kartyaGombDiv.classList.add("px-3","pb-3")
    kartyaTitle.classList.add("card-title")
    kartyaGomb.classList.add("btn","btn-secondary","w-100","mt-auto")
    kartyaMisc.classList.add("misc") // Referencia érdekében
    
    
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
        kartyaErtekeles.innerHTML=`Értékelés:${csillagok} (${Math.round(adatok.ertekeles.Osszert * 10) / 10})`
    }
    else
    {
        kartyaErtekeles.innerHTML="Nincs még értékelés!"
    }
    //Van-e komment
    if (adatok.kommentek!=undefined) 
    {
        if (adatok.kommentek.Kommnum!=0) 
        {
            kartyaKommentek.innerHTML=`Kommentek Száma:${adatok.kommentek.KommNum}`
        }
        else
        {
            kartyaKommentek.innerHTML="Nincs még komment!"
        }                
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
        window.location.href=`/Koktel/${adat.adat.KoktélID}`
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
    //Termékkép
    let kep=dolog.getElementsByClassName("kep")[0]
    kep.setAttribute("src",URL.createObjectURL(await AdatGetKep("/api/AdatlapLekeres/KepLekeres/"+adat.termAdatok.TermekKepUtvonal)))

    //Termékcím
    let kartyaTitle=dolog.getElementsByClassName("card-title")[0]
    kartyaTitle.innerHTML=adat.termAdatok.TermekCim

    //Átirányító gomb
    let gomb=dolog.getElementsByClassName("btn-secondary")[0]
    gomb.setAttribute("value","Tovább a Termékre")
    gomb.addEventListener("click",()=>{
        window.location.href=`/Termek/${adat.kosarAdatok.TermekID}`
    })

    //Rendelési adatok
    let adatok=dolog.getElementsByClassName("misc")[0]

    //Leírás
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
    
    //Egységár,Darabszám,Összár felületek
    let termekAdatok=document.createElement("div")
    termekAdatok.classList.add("py-2")

    //
    let termekEgysegar=document.createElement("div")

    if (adat.termAdatok.TermekDiscount!=null) {
        termekEgysegar.innerHTML="Egységár: "+adat.kosarAdatok.EgysegAr*(100-adat.termAdatok.TermekDiscount)/100+"/db"
    }
    else{
        termekEgysegar.innerHTML="Egységár: "+adat.kosarAdatok.EgysegAr+"/db"

    }

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


function modal(cim,szöveg){
    var visszaJelzés = new bootstrap.Modal(document.getElementById('Visszajelzes'), {})
    document.getElementById("infoCim").innerHTML=cim   
    document.getElementById("infoSzoveg").innerHTML=szöveg   
    document.getElementById("Okezo").addEventListener("click",()=>{
        document.getElementById("infoCim").innerHTML=""   
        document.getElementById("infoSzoveg").innerHTML=""   
        visszaJelzés.hide()
    })   
    visszaJelzés.show()
}