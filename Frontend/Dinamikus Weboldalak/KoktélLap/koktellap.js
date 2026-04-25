let koktel=(window.location.href.split("/"))[4]
document.addEventListener("DOMContentLoaded",async()=>{
    //ez alapján lekérjük az adatokat
    const eredmeny=await AdatLekeres(`/api/Koktel/${koktel}`)
    let iranyok=await AdatLekeres(`/api/Koktel/SzomszedosKoktelok/${koktel}`)
    document.getElementById("elozo").setAttribute("href",iranyok.prev)
    document.getElementById("kovetkezo").setAttribute("href",iranyok.next)
    let bevanelepve=await statikusadatok(eredmeny)
    if (bevanelepve) {
        document.getElementById("KommSend").addEventListener("click",async()=>{await Kommentkuldes()})
        document.getElementById("komment").addEventListener("keyup",()=>{document.getElementById("szam").innerHTML=document.getElementById("komment").value.length})
        document.getElementById("Velemeny").classList.add("shadow-sm","p-2","koktelshadow")
        if (eredmeny.adat.UgyanazE) {
            document.getElementById("KoktJel").setAttribute("value","Koktél Törlése")
            document.getElementById("KoktJel").id="KoktDel"
            document.getElementById("KoktDel").addEventListener("click",async()=>{
                await AdatKuldes("/api/Koktel/DeleteKoktel",{id:koktel},"DELETE")
                window.location.href="/Koktelok"
            })
            await szerkesztes()
        }
        else{
            document.getElementById("KoktJel").addEventListener("click",()=>{jelentes(eredmeny.adat.KoktélID,"Koktél",eredmeny.adat.FelhID)})
            await kedveles()
        }
    }
    else{
        //Átalakítjuk a komment felületet egy tájékoztató szövegre
        document.getElementById("Velemeny").innerHTML="Komment írásához és a Koktél Értékeléséhez lépj be!"
        //Leromboljuk a jelentési gombokat, visszaélés elkerülése érdekében
        document.getElementById("ChangeSor").removeChild(document.getElementById("KoktJel"))
        document.getElementById("Cimsor").classList.remove("ps-4")
    }

    await kommentek(eredmeny,bevanelepve)
    await erteksetup()
    let rendezes=document.getElementById("order")
    rendezes.addEventListener("change",async()=>{
        await kommentek()
    })
})

const AdatLekeres=async(url)=>{
    const valasz=await fetch(url)
    if (valasz.ok) {
        return valasz.json()
    }
}
const AdatLekeresKep=async(url)=>{
    const valasz=await fetch(url,{
        method:"GET",
        headers:{"Content-Type":"image/jpg"}
    })
    if (valasz.ok) {
        return valasz.blob()
    }
}

const AdatKuldes=async(url,adat,tipus)=>{
    let valasz
    if (adat!="") {
        valasz=await fetch(url,{
            method:tipus,
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(adat)
        })
    }
    else{
        valasz=await fetch(url,{
            method:tipus,
            headers:{"Content-Type":"application/json"}
        })
    }
    if (valasz.ok) {
        return valasz.json()
    }
}

const AdatKuldesKep=async(url,adat,tipus)=>{
    let valasz=await fetch(url,{
            method:tipus,
            body:adat
    })
    if (valasz.ok) {
        return valasz.json()
    }
}


async function statikusadatok(adatok)
{
    //ha nincs ilyen köktélunk
    if (adatok==undefined) {
        //Átirányítjuk a hibaoldalra
        window.location.href="/KoktelHiba"
    }
    //Külön változókban tároljuk el a kapott adatokat
    const koktélAdat=adatok.adat
    const jelvényAdat=adatok.jelvenyek
    const osszetevoAdat=adatok.osszetevok
    const BadgeHely=document.getElementById("badgek")
    BadgeHely.innerHTML=""
    for (let i = 0; i < jelvényAdat.length; i++) {
        
        let adat=jelvényAdat[i][0]
        let badge=document.createElement("span")
        badge.innerHTML=adat.JelvényNeve
        badge.classList.add("badge","bg-primary","ms-1")
        //megnézzük hogy milyen típusú jelvény és az alapján színezzük be  
        switch (adat.JelvenyKategoria) {
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
        badge.addEventListener("click",()=>{
            window.location.href=`/Koktelok/#${adat.JelvenyKategoria}/#${adat.JelvényNeve}`
        })
        //Majd hozzáadjuk a badge divhez
        BadgeHely.appendChild(badge)
    }
    if (koktélAdat.Alkoholos==0) {
        let badge=document.createElement("span")
        badge.innerHTML="Alkoholmentes"
        badge.classList.add("badge","ms-1","mentes")
        badge.addEventListener("click",()=>{
            window.location.href="/Koktelok/#AlkoholosE/#Alkoholmentes"
        })
        BadgeHely.appendChild(badge)  
    }

    //Összetevők létrehozása
    const OssztevHely=document.getElementById("Ossztev")
    const MennyisegHely=document.getElementById("mennyiseg")
    OssztevHely.innerHTML=""
    for (let i = 0; i < osszetevoAdat.length; i++) {
        let Ossztevo=document.createElement("li")
        Ossztevo.innerHTML=`${osszetevoAdat[i].Osszetevő} - ${osszetevoAdat[i].Mennyiség} ${osszetevoAdat[i].Mertekegyseg.toLowerCase()}`
        OssztevHely.appendChild(Ossztevo)
    }
    document.getElementById("adag").addEventListener("click",async()=>{
        MennyisegHely.value=1
        MennyisegHely.setAttribute("step",1)
        await mennyisegValtozas()
    })
    document.getElementById("ml").addEventListener("click",async()=>{
        MennyisegHely.setAttribute("step",50)
        MennyisegHely.value=koktélAdat.AlapMennyiseg
        await mennyisegValtozas()
    })
    MennyisegHely.addEventListener("change",async()=>{
        await mennyisegValtozas()
    })
    //A koktél képének lekérése és megadása
    const KepLekeres=await AdatLekeresKep("/api/AdatlapLekeres/KepLekeres/"+koktélAdat.BoritoKepUtvonal)
    document.getElementById("KoktélKép").setAttribute("src",URL.createObjectURL(KepLekeres))

    //A koktél készítőjének képének lekérése és megadása
    const FelhKep=await AdatLekeresKep("/api/AdatlapLekeres/KepLekeres/"+koktélAdat.ProfilkepUtvonal)
    document.getElementById("keszKep").setAttribute("src",URL.createObjectURL(FelhKep))
    document.getElementById("keszKep").classList.add("profilkep","m-0")

    //Készítő regisztrációja óta eltelt idő számítása és kijelzése
    let keszitesDate=(koktélAdat.RegisztracioDatuma.split('T')[0]).split("-");
    document.getElementById("Tagsag").innerText=tagsagOta(keszitesDate)
    document.getElementById("Cimsor").innerHTML=koktélAdat.KoktelCim
    document.getElementById("OldalCim").innerHTML="Pohárnyi | "+koktélAdat.KoktelCim
    document.getElementById("Madeby").innerHTML=koktélAdat.Felhasználónév + " -"
    document.getElementById("kokteldate").innerHTML="Készült: "+koktélAdat.KeszitesDatuma.split('T')[0]
    document.getElementById("recept").innerHTML=koktélAdat.Recept
    MennyisegHely.value=koktélAdat.AlapMennyiseg 

    document.getElementById("keszKep").addEventListener("click",async()=>{
        let FelhAdatok=await AdatLekeres("/api/Koktel/FelhasznaloAdat/"+koktélAdat.FelhID)
        let kep=await AdatLekeresKep("/api/AdatlapLekeres/KepLekeres/"+FelhAdatok.adat.ProfilkepUtvonal)
        document.getElementById("ProfilCim").innerHTML=`${FelhAdatok.adat.Felhasználónév} Adatai:`
        document.getElementById("profkep").setAttribute("src",URL.createObjectURL(kep))
        document.getElementById("RegDate").innerHTML=`Regisztráció dátuma: `+((FelhAdatok.adat.RegisztracioDatuma).split("T"))[0]
        document.getElementById("Nev").innerHTML=`Felhasználónév: `+FelhAdatok.adat.Felhasználónév
        document.getElementById("KeszitNum").innerHTML=`Készített koktélok: `+FelhAdatok.statisztika.KoktelDB
        if (adatok.belepette==true&&koktélAdat.UgyanazE!=true) {
                let jelentesGomb=document.createElement("input")
                jelentesGomb.setAttribute("type","button")
                jelentesGomb.setAttribute("value","Felhasználó Jelentése")
                jelentesGomb.classList.add("btn","btn-danger","border-0","w-100")
                document.getElementById("ReportGomb").innerHTML=""
                document.getElementById("ReportGomb").appendChild(jelentesGomb)
                jelentesGomb.addEventListener("click",()=>{
                    jelentes(koktélAdat[i].FelhID,"Felhasználó",koktélAdat[i].FelhID)
                    JelIv.hide()
                })
        }
        var JelIv = new bootstrap.Modal(document.getElementById('ProfilAdat'), {})   
        //és megmutatása
        JelIv.show()
    })


    return adatok.belepette

}

async function mennyisegValtozas() {
    const OssztevHely=document.getElementById("Ossztev")
    const MennyisegHely=document.getElementById("mennyiseg")
    const osszetevoAdat=(await AdatLekeres(`/api/Koktel/${koktel}`)).osszetevok
    const koktélAdat=(await AdatLekeres(`/api/Koktel/${koktel}`)).adat
    OssztevHely.innerHTML=""
    for (let i = 0; i < osszetevoAdat.length; i++) {
        let Ossztevo=document.createElement("li")
        if (document.getElementById("adag").checked) 
        {
            if (osszetevoAdat[i].Mertekegyseg=="cl") {
                Ossztevo.innerHTML=`${osszetevoAdat[i].Osszetevő} - ${Math.round((osszetevoAdat[i].Mennyiség)*(MennyisegHely.value))} ${osszetevoAdat[i].Mertekegyseg.toLowerCase()}`
            }
            else{
                Ossztevo.innerHTML=`${osszetevoAdat[i].Osszetevő} - ${Math.round(osszetevoAdat[i].Mennyiség*(MennyisegHely.value))} ${osszetevoAdat[i].Mertekegyseg.toLowerCase()}`
            }
        }
        else
        {
            if (osszetevoAdat[i].Mertekegyseg=="cl") {
                Ossztevo.innerHTML=`${osszetevoAdat[i].Osszetevő} - ${Math.round(((osszetevoAdat[i].Mennyiség*10)*(MennyisegHely.value/koktélAdat.AlapMennyiseg))*10)/100} ${osszetevoAdat[i].Mertekegyseg.toLowerCase()}`
            }
            else{
                Ossztevo.innerHTML=`${osszetevoAdat[i].Osszetevő} - ${Math.round((osszetevoAdat[i].Mennyiség*(MennyisegHely.value/koktélAdat.AlapMennyiseg))*10)/10} ${osszetevoAdat[i].Mertekegyseg.toLowerCase()}`
            }
        }
        OssztevHely.appendChild(Ossztevo)
    }
}



async function kommentek() {
    let KommentekHelye=document.getElementById("Kommentek")

    let adatok=await AdatLekeres(`/api/Koktel/${koktel}`)
    let kommentek=adatok.komment

    if (kommentek.length==0) {
        KommentekHelye.classList.add("p-0")
        KommentekHelye.classList.remove("koktelshadow","p-2")
        document.getElementById("order").setAttribute("hidden","true")
    }
    else{
        if (KommentekHelye.classList.contains("koktelshadow")==false) {
            KommentekHelye.classList.add("koktelshadow")
        }
        if (KommentekHelye.classList.contains("p-0")) {
            KommentekHelye.classList.remove("p-0")
        }
        if (KommentekHelye.classList.contains("p-2")==false) {
            KommentekHelye.classList.add("p-2")
        }
        if (document.getElementById("order").hasAttribute("hidden","true")) {
            document.getElementById("order").removeAttribute("hidden","true")
        }

    }
    let rendezes=document.getElementById("order")

    if (rendezes.value=="date") {
       KommentekHelye.innerHTML=""
       for (let i = kommentek.length-1; i > -1 ; i--) {
           KommentekHelye.appendChild(await kommentCreate(kommentek[i],i,adatok))
       }
    }
   else if(rendezes.value=="rate"){
        let sorrend=(await AdatLekeres("/api/Koktel/KommentRendezes/"+koktel)).adat
        KommentekHelye.innerHTML=""

        for (let i = sorrend.length-1; i > -1 ; i--) {

           KommentekHelye.appendChild(await kommentCreate(sorrend[i],i,adatok))
        }
   }
    
    
}

async function kommentCreate(adat,i,adatok) {
        //elemek létrehozása
        let Komment=document.createElement("div")
        Komment.classList.add("kommentdiv")
        
        //Kommentelő képének megadása és classok megadása

        let kep=await AdatLekeresKep("/api/AdatlapLekeres/KepLekeres/"+adat.ProfilkepUtvonal)
        let KommenteloKep=document.createElement("img")
        KommenteloKep.setAttribute("src",URL.createObjectURL(kep))
        KommenteloKep.classList.add("profilkep","col-1","col-sm-1","col-md-1","col-lg-1","col-xl-1")

        KommenteloKep.addEventListener("click",async()=>{
            let Kommadatok=await AdatLekeres("/api/Koktel/FelhasznaloAdat/"+adat.Keszito)
            let kep=await AdatLekeresKep("/api/AdatlapLekeres/KepLekeres/"+Kommadatok.adat.ProfilkepUtvonal)

            document.getElementById("ProfilCim").innerHTML=`${Kommadatok.adat.Felhasználónév} Adatai:`
            document.getElementById("profkep").setAttribute("src",URL.createObjectURL(kep))
            document.getElementById("RegDate").innerHTML=`Regisztráció dátuma: `+((Kommadatok.adat.RegisztracioDatuma).split("T"))[0]
            document.getElementById("Nev").innerHTML=`Felhasználónév: `+Kommadatok.adat.Felhasználónév
            document.getElementById("KeszitNum").innerHTML=`Készített koktélok: `+Kommadatok.statisztika.KoktelDB
            
            if (adatok.belepette==true&&(adatok.adat.FelhID!=adat.Keszito)==true) {
                
                let jelentesGomb=document.createElement("input")
                jelentesGomb.setAttribute("type","button")
                jelentesGomb.setAttribute("value","Felhasználó Jelentése")
                jelentesGomb.classList.add("btn","btn-danger","border-0","w-100")
                document.getElementById("ReportGomb").innerHTML=""
                document.getElementById("ReportGomb").appendChild(jelentesGomb)
                jelentesGomb.addEventListener("click",()=>{
                    jelentes(adat.Keszito,"Felhasználó",adat.Keszito)
                    JelIv.hide()
                })
            }

            var JelIv = new bootstrap.Modal(document.getElementById('ProfilAdat'), {})   
            //és megmutatása
            JelIv.show()
        })



        //Hozzáadás a headerhez és alsó margin megadás
        let KommentHeader=document.createElement("div")
        KommentHeader.classList.add("mb-1","d-flex","w-100")
        KommentHeader.appendChild(KommenteloKep)
        
        
        //Jelentés Gomb formázása
        let KommentIroReport=document.createElement("input")
        KommentIroReport.classList.add("col-3","col-sm-1","col-md-1","col-lg-1","col-xl-1","p-0","text-end","flex-fill")
        
        //Felhasználónév mező megadása
        let KommentIro=document.createElement("label")
        KommentIro.classList.add("col-8","col-sm-8","col-md-8","col-lg-10","col-xl-10","flex-fill")
        KommentIro.innerHTML=adat.Felhasználónév+" - "
        KommentHeader.appendChild(KommentIro)

        //Komment Összecsukása
        let KommentCollapse=document.createElement("input")
        KommentCollapse.setAttribute("type","button")
        KommentCollapse.setAttribute("value","↑")
        KommentCollapse.classList.add("btn","col-md-1","col-sm-2","border-0")
        KommentHeader.appendChild(KommentCollapse)

        //Átszínezés
        let KommIroRegDate=(adat.RegisztracioDatuma.split("T"))[0].split("-")
        let KommentIroTagsag=document.createElement("span")
        KommentIroTagsag.classList.add("text-primary")
        KommentIroTagsag.innerText=tagsagOta(KommIroRegDate)
        
        //Textarea tartalom és stílus megadása
        let KommentTartalom=document.createElement("textarea")
        KommentTartalom.setAttribute("rows","3")
        KommentTartalom.setAttribute("style","resize: none; text-align: left; box-sizing: border-box")
        KommentTartalom.setAttribute("disabled","true")
        KommentTartalom.classList.add("w-100","komment")
        KommentTartalom.innerHTML=adat.Tartalom
        
        KommentCollapse.addEventListener("click",()=>{
            if (KommentTartalom.hasAttribute("hidden")) {
                KommentTartalom.removeAttribute("hidden","true")
                KommentCollapse.setAttribute("value","↑")
            }
            else{
                KommentTartalom.setAttribute("hidden","true")
                KommentCollapse.setAttribute("value","↓")
            }
        })
        
        let pozitiv=document.createElement("span")
        let pozitivSzam=document.createElement("span")
        pozitivSzam.innerHTML=adat.Pozitiv
        let upvote=document.createElement("input")
        upvote.setAttribute("type","button")
        upvote.setAttribute("value","👍")
        upvote.classList.add("btn","border-0")
        pozitiv.classList.add("col-2")
        pozitiv.appendChild(upvote)
        pozitiv.appendChild(pozitivSzam)

        let negativ=document.createElement("span")
        let negativSzam=document.createElement("span")
        negativSzam.innerHTML=adat.Negativ
        let downvote=document.createElement("input")
        downvote.setAttribute("type","button")
        downvote.setAttribute("value","👎")
        downvote.classList.add("btn","border-0")
        negativ.classList.add("col-2","ps-4")
        negativ.appendChild(downvote)
        negativ.appendChild(negativSzam)

        //Ha a felhasználó be van lépve
        if (adatok.belepette) {
            //Létrehozzuk a jelentés gombot minden komment felett
            KommentIroReport.setAttribute("type","button")
            KommentIroReport.classList.add("btn","text-danger","float-end","border-0")
            if (adat.UgyanazE==false) {
                //Értékelések
                upvote.addEventListener("click",async()=>{
                    await AdatKuldes("/api/Koktel/SendKommentRating/"+adat.KommentID,{ert:"Pozitiv"},"PATCH")
                    pozitivSzam.innerHTML=((await AdatLekeres(`/api/Koktel/${koktel}`)).komment[i].Pozitiv)
                    negativSzam.innerHTML=((await AdatLekeres(`/api/Koktel/${koktel}`)).komment[i].Negativ)
                })
                downvote.addEventListener("click",async()=>{
                    await AdatKuldes("/api/Koktel/SendKommentRating/"+adat.KommentID,{ert:"Negativ"},"PATCH")
                    pozitivSzam.innerHTML=((await AdatLekeres(`/api/Koktel/${koktel}`)).komment[i].Pozitiv)
                    negativSzam.innerHTML=((await AdatLekeres(`/api/Koktel/${koktel}`)).komment[i].Negativ)
                })
                KommentIroReport.setAttribute("value","Jelentés")
                //Ha rányom
                KommentIroReport.addEventListener("click",()=>{
                    //Elküldjük jelentésre a kommentet
                    jelentes(adat.KommentID,"Komment",adat.Keszito)
                })
            }
            //Azonban magát nem tudja feljelenteni sem értékelni
            else{
                //Kikapcsoljuk az értékelést
                downvote.setAttribute("disabled","true")
                upvote.setAttribute("disabled","true")
                upvote.classList.add("border-0")
                downvote.classList.add("border-0")

                //Ezért helyette ki tudja törölni a kommentet inkább
                KommentIroReport.setAttribute("value","Törlés")
                KommentIroReport.addEventListener("click",()=>{
                    kommentTorles(adat.KommentID)
                })
            }
            KommentHeader.appendChild(KommentIroReport)
        }
        KommentIro.appendChild(KommentIroTagsag)
        
        Komment.appendChild(KommentHeader)
        Komment.appendChild(KommentTartalom)
        Komment.appendChild(pozitiv)
        Komment.appendChild(negativ)
        return Komment
}


function tagsagOta(regDate){
    let jelenDate=new Date()
    let miota
    if (jelenDate.getFullYear()!=regDate[0]) {
        miota=`${jelenDate.getFullYear()-regDate[0]} Éve Tag`
    }
    else if(jelenDate.getMonth()+1!=regDate[1]){
        miota=`${jelenDate.getMonth()+1-regDate[1]} Hónapja Tag`
    }
    else{
        miota=`${jelenDate.getDate()-regDate[2]} Napja Tag`
    }
    return miota
}
async function Kommentkuldes() {
    //Megkapjuk a koktél idjét a link utolsó részéből

    //Egy objectbe eltároljuk
    let tartalom={
        //A komment szövegét
        Tartalom:document.getElementById("komment").value,
        //Melyik koktélhoz írták
        Koktél:koktel
    }
    //Elküldjük a kommentet a backendre
    await AdatKuldes(`/api/Koktel/SendKomment`,tartalom,"POST")
    document.getElementById("komment").value=""
    document.getElementById("szam").innerText="0"
    //Úrjatöltjük az oldlat
    await kommentek()
}
async function kommentTorles(id){
     await AdatKuldes("/api/Koktel/DeleteKomment",{id:id},"DELETE")
     await kommentek()
     
}

let csillag=document.createElement("input")
async function kedvencek(){
    const eredmeny=await AdatLekeres(`/api/Koktel/${koktel}`)

    if (eredmeny.kedveltee) {
        csillag.setAttribute("value","★")
    }
    else{
        csillag.setAttribute("value","☆")
    }
}
async function kedveles() {
    csillag.setAttribute("type","button")
    csillag.classList.add("btn","fs-1","m-0","p-0","border-0")
    let kedvenc=document.getElementById("fav")
    csillag.addEventListener("click",async()=>{
        await AdatKuldes("/api/Koktel/SendKedvenc",{Koktél:koktel},"POST")
        kedvencek()
    })
    kedvenc.appendChild(csillag)
    kedvencek()
}
async function jelentes(mit,tipus,kit) {
    //A jelentési felület lekérése
    var JelIv = new bootstrap.Modal(document.getElementById('JelentesLap'), {})   
    //és megmutatása
    JelIv.show()
    //Az elküldés gomb után
    document.getElementById("JelSend").addEventListener("click",async()=>{
        //egy objektumba eltároljuk
        let adatok={
            //Hogy kit jelentünk fel
            JelentettID:kit,
            //Mi a jelentett tartalom idje
            JelentettTartalomID:mit,
            //Mi a jelentett tartalom típusa
            JelentesTipusa:tipus,
            //Mi a jelentett tartalom jelentési indoka
            Indok:document.getElementById("indok").value
        }

        //ezeket elküldjük az endpointra, ahol feldolgozzuk és a választ eltároljuk
        const jelentesSend=await AdatKuldes(`/api/Koktel/SendJelentes`,adatok,"POST")

        //Ha nincs hiba
        if (jelentesSend.message==false) {
            document.getElementById("visszajelzes").innerHTML="Sikeres Jelentés"
        }
        //Ha van hiba, avagy jelentette már a dolgot
        else{
            document.getElementById("visszajelzes").innerHTML="Már tett jelentést ez ellen!"
        }
        //Kikapcsoljuk a küldési lehetőséget
        document.getElementById("JelNvm").setAttribute("hidden","true")
        document.getElementById("JelSend").setAttribute("hidden","true")
        //És előhozzuk a nyugtázó gombot
        document.getElementById("JelKonf").removeAttribute("hidden","true")
        document.getElementById("JelKonf").addEventListener("click",()=>
        {
            //elrejtük a felületet, és visszaállítjuk az alaphelyzetbe, hogyha megint rányom a felhasználó, ugyan úgy nézzen ki mint amikor betölt az oldal
            document.getElementById("JelNvm").removeAttribute("hidden","true")
            document.getElementById("JelSend").removeAttribute("hidden","true")
            document.getElementById("JelKonf").setAttribute("hidden","true")
            document.getElementById("visszajelzes").innerHTML=""
            document.getElementById("indok").value=""
            JelIv.hide()

        },{once:true})

    },{once:true})

    //A vissza gomb után egyszerűen csak elrejtük a felületet
    document.getElementById("JelNvm").addEventListener("click",()=>{
        JelIv.hide()
    },{once:true})

}
async function erteksetup() {

    const eredmeny=await AdatLekeres(`/api/Koktel/${koktel}`)

    if (eredmeny.adat.UgyanazE) {
        document.getElementById("ertekeles").innerHTML=""
    }
    else if(eredmeny.belepette==false){
        
    }
    else{
        let csillagok=document.getElementById("csillagok").children
        //ez alapján lekérjük az adatokat
        if (eredmeny.ertekeltee) {
            csillagsetup(eredmeny.ertekeles)
            csillagok=""
            document.getElementById("rateDisplay").innerHTML="Ön már értékelte ezt a koktélt!"
            document.getElementById("Velemeny").children[0].removeChild((document.getElementById("ErtSend")))
        }
        else{
            
            for (let i = 0; i < csillagok.length; i++) {
                csillagok[i].addEventListener("click",()=>{
                    csillagsetup(i+1)
                })
            }
            document.getElementById("ErtSend").addEventListener("click",async()=>{
                
                let teliCsillagok=0
                for (let i = 0; i < csillagok.length; i++) {
                    if (csillagok[i].value=="★") {
                        teliCsillagok++
                    }
                    
                }
                if (teliCsillagok!=0) {
                    //Aminek a hosszát elküljük a backendre a koktél idjével
                    await AdatKuldes("/api/Koktel/SendErtekeles",{Tartalom:teliCsillagok,Koktél:koktel},"POST")
                    await erteksetup()
                }
            })
        }
    }
}
function csillagsetup(meddig){
    let csillagok=document.getElementById("csillagok").children
    for (let i = 0; i < meddig; i++) {
        csillagok[i].setAttribute("value","★")
    }
    for (let i = meddig; i < 5; i++) {
        csillagok[i].setAttribute("value","☆")
    }
}
async function szerkesztes() {
    const eredmeny=await AdatLekeres(`/api/Koktel/${koktel}`)
    let szerk=document.createElement("input")
    szerk.setAttribute("value","✎")
    szerk.setAttribute("type","button")
    szerk.classList.add("btn","fs-1","m-0","p-0","border-0")
    szerk.addEventListener("click",async()=>{
        document.getElementById("fav").removeChild(szerk)

        //ඞ Ugyan az az input mező, az eventlistener nélkül
        let imposztor=document.createElement("input")
        imposztor.classList.add("form-control")
        imposztor.setAttribute("value",document.getElementById("Osszetevok").childNodes[3].value)
        document.getElementById("Osszetevok").replaceChild(imposztor,document.getElementById("Osszetevok").childNodes[3]);
        
        let yes=document.createElement("input")
        yes.setAttribute("type","button")
        yes.setAttribute("value","Módosítás")
        yes.classList.add("btn","btn-success","me-2")


        let no=document.createElement("input")
        no.setAttribute("type","button")
        no.setAttribute("value","Mégse")
        no.classList.add("btn","btn-danger")
        no.addEventListener("click",()=>{
            window.location.reload()
        })

        document.getElementById("Gombok").appendChild(yes)
        document.getElementById("Gombok").appendChild(no)

        let cim=document.createElement("input")
        let eredeticim=document.getElementById("Cimsor")
        let alapcim=eredeticim.innerHTML
        cim.setAttribute("value",alapcim)
        cim.classList.add("text-center")
        eredeticim.innerHTML=""
        eredeticim.appendChild(cim)

        let recept=document.createElement("textarea")
        let eredetirecept=document.getElementById("recept")
        let alapszoveg=eredetirecept.innerHTML
        recept.innerHTML=alapszoveg
        recept.classList.add("form-control")
        eredetirecept.innerHTML=""
        eredetirecept.appendChild(recept)

        let osszetevoLista=document.getElementById("Ossztev")
        osszetevoLista.classList.add("p-0")
        osszetevoLista.innerHTML=""
        for (let i = 0; i < eredmeny.osszetevok.length; i++) {
            let opcio=await osszetevo(eredmeny.osszetevok[i])
            osszetevoLista.appendChild(opcio)
        }
        let more=document.createElement("input")
        more.setAttribute("type","button")
        more.setAttribute("value","Új Összetevő")
        more.classList.add("btn","btn-secondary","w-100","mb-2")
        more.addEventListener("click",async()=>{
            let opcio=await osszetevo("")
            osszetevoLista.appendChild(opcio)
        })
        document.getElementById("Osszetevok").appendChild(more)

        let kepFeltolt=document.createElement("input")
        kepFeltolt.setAttribute("type","file")
        kepFeltolt.setAttribute("hidden","true")
        kepFeltolt.setAttribute("name","file")
        document.getElementById("kepModosit").appendChild(kepFeltolt)
        let kepvalt=false
        kepFeltolt.addEventListener("change",()=>{
            document.getElementById("KoktélKép").setAttribute("src",URL.createObjectURL(kepFeltolt.files[0]))
            kepvalt=true
        })




        yes.addEventListener("click",async()=>{
            let adatok={}
            adatok.Cim=cim.value
            adatok.Recept=recept.value
            let osszetevok=[]
            let mltotal=0
            for (let i = 0; i < osszetevoLista.childNodes.length; i++) {
                let osszetevoDarab=osszetevoLista.childNodes[i].childNodes[0].childNodes
               
                let osszetev=[]
                for (let j = 0; j < osszetevoDarab.length-2; j++) {
                    osszetev.push(osszetevoDarab[j].value)
                }
                let opctiok=osszetevoDarab[osszetevoDarab.length-2].childNodes
                for (let j = 0; j < opctiok.length; j++) {
                    if (opctiok[j].dataset.selected=="true") {
                        osszetev.push(opctiok[j].innerHTML)
                        
                        if (opctiok[j].innerHTML=="ml") {
                            mltotal+=parseInt(osszetevoDarab[1].value)
                        }
                        else if(opctiok[j].innerHTML=="cl"){
                            //1cl=10ml
                            mltotal+=(parseInt(osszetevoDarab[1].value)*10)
                        }
                    }
                }
                osszetevok.push(osszetev)
                
            }
            adatok.Osszetevok=osszetevok
            adatok.Mennyiseg=imposztor.value



            //A jelentési felület lekérése
            var ResIv = new bootstrap.Modal(document.getElementById('ReplyModal'), {})   
            if (parseInt(adatok.Mennyiseg)!=mltotal) {
                document.getElementById("cim").innerHTML="Hiba!"
                document.getElementById("response").innerHTML="A koktél mennyisége nem felel meg a megadott értékeknek!"
                //és megmutatása
                ResIv.show()
            }
            else if(adatok.Recept.length>1000){
                document.getElementById("cim").innerHTML="Hiba!"
                document.getElementById("response").innerHTML="A recept túl hosszú!"
                //és megmutatása
                ResIv.show()
            }
            else{
                //TODO:ENDPOINT
                if (kepvalt) {
                    let adat=new FormData()
                    adat.append("profilkep",kepFeltolt.files[0]);
                    adatok.Kep=(await AdatKuldesKep("/api/AdatlapLekeres/KepFeltoltes",adat,"POST")).message
                }
                let valasz=(await AdatKuldes("/api/Koktel/KoktelModositas/"+koktel,adatok,"PATCH")).message
                if (valasz=="Siker") {
                    window.location.reload()
                }
                else{
                    document.getElementById("cim").innerHTML="Hiba!"
                    document.getElementById("response").innerHTML="Váratlan Hiba Történt!"
                    //és megmutatása
                    ResIv.show()
                }
            }
            
        })
    })
    document.getElementById("fav").appendChild(szerk)
}
async function osszetevo(adat)
{
    let osszetevoLista=document.getElementById("Ossztev")
    let opcioDiv=document.createElement("div")
    opcioDiv.classList.add("mt-1")

    let opcio=document.createElement("div")
    opcio.classList.add("flex-row")

    let osszetevoNev=document.createElement("input")
    osszetevoNev.classList.add("col-4","col-sm-5","Onev")
    
    let osszetevoMennyiseg=document.createElement("input")
    osszetevoMennyiseg.setAttribute("type","number")
    osszetevoMennyiseg.classList.add("col-2","col-sm-2","Omer")

    
    let mertekegysegek=document.createElement("select")
    mertekegysegek.classList.add("col-4","col-sm-4","Omer")
    let db=document.createElement("option")
    db.innerHTML="darab"
    let ml=document.createElement("option")
    ml.innerHTML="ml"
    let gr=document.createElement("option")
    gr.innerHTML="gr"    
    let cl=document.createElement("option")
    cl.innerHTML="cl"
    
    mertekegysegek.appendChild(ml)
    mertekegysegek.appendChild(db)
    mertekegysegek.appendChild(gr)
    mertekegysegek.appendChild(cl)

    let selectopt=mertekegysegek.childNodes
    if (adat!="") {
        osszetevoNev.setAttribute("value",adat.Osszetevő)
        osszetevoMennyiseg.setAttribute("value",adat.Mennyiség)
        let kicsi=adat.Mertekegyseg.toLowerCase()

        for (let i = 0; i < selectopt.length; i++) {
            if (selectopt[i].innerHTML==kicsi) {
                mertekegysegek.selectedIndex=i
                selectopt[i].dataset.selected="true"
            }
            else{
                selectopt[i].dataset.selected="false"
            }
        }
    }
    else{

        for (let i = 0; i < selectopt.length; i++) {
            selectopt[i].dataset.selected="false"
        }
        
        selectopt[0].dataset.selected="true"
    }
    mertekegysegek.addEventListener("change",()=>{
        for (let i = 0; i < mertekegysegek.childNodes.length; i++) {
            if (mertekegysegek.childNodes[i].innerHTML==mertekegysegek.value) {
                selectopt[i].dataset.selected="true"
            }
            else{
                selectopt[i].dataset.selected="false"
            }
        }
        
    })
    let törlés=document.createElement("input")
    törlés.classList.add("col-2","col-sm-1","Oopc","bg-danger","text-white")
    törlés.setAttribute("type","button")
    törlés.setAttribute("value","X")
    törlés.addEventListener("click",()=>{
        osszetevoLista.removeChild(opcioDiv)
    })

    opcio.appendChild(osszetevoNev)
    opcio.appendChild(osszetevoMennyiseg)
    opcio.appendChild(mertekegysegek)
    opcio.appendChild(törlés)
    opcioDiv.appendChild(opcio)

    return opcioDiv
}

