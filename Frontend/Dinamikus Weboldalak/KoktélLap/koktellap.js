let megtortentemar=false
document.addEventListener("DOMContentLoaded",async()=>{
    //megvárjuk hogy betöltsön a weboldal és eltároljuk a bool ertéket hogy be van e lépve
    let be=await Betoltes()
    //ha be van
    if (be) {
        //Bekapcsoljuk a komment küldési felületet
        document.getElementById("KommSend").addEventListener("click",async()=>{
            await Kommentkuldes()
        })
        document.getElementById("komment").addEventListener("keyup",()=>{
                document.getElementById("szam").innerHTML=document.getElementById("komment").value.length
        })
    }
    //ha nincs
    else{
        //Átalakítjuk a komment felületet egy tájékoztató szövegre
        document.getElementById("Velemeny").innerHTML="Komment írásához és a Koktél Értékeléséhez lépj be!"
        //Leromboljuk a jelentési gombokat, visszaélés elkerülése érdekében
        Obfuszkacio()
        document.getElementById("KoktJel").setAttribute("type","")
        document.getElementById("KoktJel").classList.remove("btn","text-danger")
        document.getElementById("KoktJel").setAttribute("hidden","true")

        document.getElementById("FelhJel").setAttribute("id","")
        document.getElementById("KoktJel").setAttribute("id","")
        
    }
})

const AdatLekeres=async(url)=>{
    const valasz=await fetch(url)
    if (valasz.ok) {
        return valasz.json()
    }
}
const AdatLekeresKep=async(url)=>{
    const valasz=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"image/jpg"}
    })
    if (valasz.ok) {
        return valasz.blob()
    }
}

const AdatKuldes=async(url,adat)=>{
    const valasz=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(adat)
    })
    if (valasz.ok) {
        return valasz.json()
    }
}

//A fő betöltési function
async function Betoltes() {
    //Kiürítünk pár divet
    await Tisztitas()
    //Megkapjuk a koktélid-t a link végéről
    let koktel=window.location.href.split("/")
    //ez alapján lekérjük az adatokat
    const eredmeny=await AdatLekeres(`/api/Koktel/${koktel[koktel.length-1]}`)
    //ha nincs ilyen köktélunk
    if (eredmeny==undefined) {
        //Átirányítjuk a hibaoldalra
        window.location.href="/KoktelHiba"
    }
    //Külön változókban tároljuk el a kapott adatokat
    const koktélAdat=eredmeny.adat[0]
    const jelvényAdat=eredmeny.jelvenyek
    const osszetevoAdat=eredmeny.osszetevok
    const kommentAdat=eredmeny.komment
    
    //Koktél jelvényei
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
        //Majd hozzáadjuk a badge divhez
        BadgeHely.appendChild(badge)
    }

    //Összetevők létrehozása
    const OssztevHely=document.getElementById("Ossztev")
    OssztevHely.innerHTML=""
    for (let i = 0; i < osszetevoAdat.length; i++) {
        let Ossztevo=document.createElement("li")
        Ossztevo.innerHTML=`${osszetevoAdat[i].Osszetevő} - ${osszetevoAdat[i].Mennyiség} ${osszetevoAdat[i].Mertekegyseg}`
        OssztevHely.appendChild(Ossztevo)
    }

    //A koktél képének lekérése és megadása
    const KepLekeres=await AdatLekeresKep("/api/AdatlapLekeres/KoktelKepLekeres/"+koktélAdat.KoktélID)
    document.getElementById("KoktélKép").setAttribute("src",URL.createObjectURL(KepLekeres))

    //A koktél képének lekérése és megadása
    const FelhKep=await AdatLekeresKep("/api/Koktel/KommenteloKepLekeres/"+koktélAdat.ProfilkepUtvonal)
    document.getElementById("keszKep").setAttribute("src",URL.createObjectURL(FelhKep))
    document.getElementById("keszKep").classList.add("profilkep","m-0")

    //Készítő regisztrációja óta eltelt idő számítása és kijelzése
    let keszitesDate=(koktélAdat.RegisztracioDatuma.split('T')[0]).split("-");
    let jelenDate=new Date()
    let TagOta=document.getElementById("Tagsag")
    if (jelenDate.getFullYear()!=keszitesDate[0]) {
        TagOta.innerText=`${jelenDate.getFullYear()-keszitesDate[0]} Éve Tag`
    }
    else if(jelenDate.getMonth()+1!=keszitesDate[1]){
        TagOta.innerText=`${jelenDate.getMonth()+1-keszitesDate[1]} Hónapja Tag`
    }
    else{
        TagOta.innerText=`${jelenDate.getDate()-keszitesDate[2]} Napja Tag`
    }
    
    //Kommentek létrehozása
    let KommentekHelye=document.getElementById("Kommentek")
    KommentekHelye.innerHTML=""
    //Visszafele számolunk, így a legújjabb van felül
    for (let i = kommentAdat.length-1; i > -1 ; i--) {

        //elemek létrehozása
        let KommIroRegDate=(kommentAdat[i].RegisztracioDatuma.split("T"))[0].split("-")
        let Komment=document.createElement("div")
        let KommentHeader=document.createElement("div")
        let KommenteloKep=document.createElement("img")
        let KommentIro=document.createElement("label")
        let KommentIroTagsag=document.createElement("span")
        let KommentIroReport=document.createElement("input")
        let KommentTartalom=document.createElement("textarea")

        //Kommentelő képének megadása és classok megadása
        let kep=await AdatLekeresKep("/api/Koktel/KommenteloKepLekeres/"+kommentAdat[i].ProfilkepUtvonal)
        KommenteloKep.setAttribute("src",URL.createObjectURL(kep))
        KommenteloKep.classList.add("profilkep","col-1","col-sm-1","col-md-1")

        //Hozzáadás a headerhez és alsó margin megadás
        KommentHeader.appendChild(KommenteloKep)
        KommentHeader.classList.add("mb-1")

        //Jelentés Gomb formázása
        KommentIroReport.classList.add("col-2","col-sm-2","col-md-1","p-0","text-end")

        //Felhasználónév mező megadása
        KommentIro.classList.add("col-9","col-sm-9","col-md-10")
        KommentIro.innerHTML=kommentAdat[i].Felhasználónév
        
        //Átszínezés
        KommentIroTagsag.classList.add("text-primary")
        
        //Textarea tartalom és stílus megadása
        KommentTartalom.setAttribute("rows","3")
        KommentTartalom.setAttribute("style","resize: none; text-align: left; box-sizing: border-box")
        KommentTartalom.setAttribute("disabled","true")
        KommentTartalom.classList.add("w-100","komment")
        KommentTartalom.innerHTML=kommentAdat[i].Tartalom
        
        //Kitaláljuk mikor regisztrált a kommentelő
        if (jelenDate.getFullYear()!=KommIroRegDate[0]) {
            KommentIroTagsag.innerText+=` - ${jelenDate.getFullYear()-KommIroRegDate[0]} Éve Tag`
        }
        else if(jelenDate.getMonth()+1!=KommIroRegDate[1]){
            KommentIroTagsag.innerText+=` - ${jelenDate.getMonth()-KommIroRegDate[1]+1} Hónapja Tag`
        }
        else{
            KommentIroTagsag.innerText+=` - ${jelenDate.getDate()-KommIroRegDate[2]} Napja Tag`
        }
        //Ha a felhasználó be van lépve
        if (eredmeny.belepette) {

            //Létrehozzuk a jelentés gombot minden komment felett
            KommentIroReport.setAttribute("type","button")
            KommentIroReport.classList.add("btn","text-danger","float-end","border-0")

            if (kommentAdat[i].UgyanazE==false) {
                KommentIroReport.setAttribute("value","Jelentés")
                //Ha rányom
                KommentIroReport.addEventListener("click",()=>{
                    //Elküldjük jelentésre a kommentet
                    jelentes(kommentAdat[i].KommentID,"Komment",kommentAdat[i].Keszito)
                })
            }
            //Azonban magát nem tudja feljelenteni
            else{
                //Ezért helyette ki tudja törölni a kommentet inkább
                KommentIroReport.setAttribute("value","Törlés")
                KommentIroReport.addEventListener("click",()=>{
                    kommentTorles(kommentAdat[i].KommentID)
                })
            }
            KommentHeader.appendChild(KommentIroReport)
        }
        KommentIro.appendChild(KommentIroTagsag)
        KommentHeader.appendChild(KommentIro)
        Komment.appendChild(KommentHeader)
        Komment.appendChild(KommentTartalom)
        KommentekHelye.appendChild(Komment)
    }
    //Ha be van lépve
    if (eredmeny.belepette) {
        //Létrehozunk egy csillagot, amire kattintva a kedvencekhez adjuk a koktélt
        let hova=document.getElementById("fav")
        hova.innerHTML=""
        let gombkedv=document.createElement("input")
        gombkedv.setAttribute("type","button")
        gombkedv.classList.add("btn","float-end","fs-3","m-0","p-0","border-0")
        if (eredmeny.kedveltee==false) {            
            gombkedv.value="☆"
            gombkedv.addEventListener("click",async()=>{
                gombkedv.value="★"
                await kedveles(koktélAdat.KoktélID)
            },{once:true})
        }
        else{
            gombkedv.value="★"
            gombkedv.addEventListener("click",async()=>{
                gombkedv.value="☆"
                await kedveles(koktélAdat.KoktélID)
            },{once:true})
        }
        hova.appendChild(gombkedv)
        //Létrehozzuk az értékelés felületet, és ha kell kitöltjük
        ertekeles(eredmeny.ertekeltee,eredmeny.ertekeles)
        }
    //Közvetlen endpointról kapott információkat itt adunk meg
    document.getElementById("Cimsor").innerHTML=koktélAdat.KoktelCim
    document.getElementById("OldalCim").innerHTML="Pohárnyi - "+koktélAdat.KoktelCim
    document.getElementById("Madeby").innerHTML=koktélAdat.Felhasználónév + " -"
    document.getElementById("kokteldate").innerHTML="Készült: "+koktélAdat.KeszitesDatuma.split('T')[0]
    document.getElementById("recept").innerHTML=koktélAdat.Recept
    document.getElementById("mennyiseg").value=koktélAdat.AlapMennyiseg 
    //Ha ez a felhasználó készítette a koktélt
    if (koktélAdat.UgyanazE&&megtortentemar) {
        //ne tudja jelenteni magát
        Obfuszkacio()
        document.getElementById("FelhJel").setAttribute("id","")
        //A koktélt azonban ki tudja törölni
        document.getElementById("KoktJel").setAttribute("id","KoktDel")
        torles(koktélAdat.KoktélID)
    }
    //Ha nem
    else{
        //Akkor mind a felhasználót,mind a koktélt tudja jelenteni
        document.getElementById("FelhJel").addEventListener("click",()=>{jelentes(koktélAdat.FelhID,"Felhasználó",koktélAdat.FelhID)})
        document.getElementById("KoktJel").addEventListener("click",()=>{jelentes(koktélAdat.KoktélID,"Koktél",koktélAdat.FelhID)})
    }
    //Ha változtat a koktél mennyiségén
    document.getElementById("mennyiseg").addEventListener("change",()=>{
    OssztevHely.innerHTML=""
    //Helyesen kerekítve jelezzük ki az összetevőket
    for (let i = 0; i < osszetevoAdat.length; i++) {
            let Ossztevo=document.createElement("li")
            Ossztevo.innerHTML=`${osszetevoAdat[i].Osszetevő} - ${Math.round((osszetevoAdat[i].Mennyiség*(document.getElementById("mennyiseg").value/koktélAdat.AlapMennyiseg))*10)/10} ${osszetevoAdat[i].Mertekegyseg}`
            OssztevHely.appendChild(Ossztevo)
        }
    })

    //Továbbadjuk azt hogy be van e lépve
    return eredmeny.belepette
}

async function Kommentkuldes() {
    //Megkapjuk a koktél idjét a link utolsó részéből
    let koktel=window.location.href.split("/")
    //Egy objectbe eltároljuk
    let tartalom={
        //A komment szövegét
        Tartalom:document.getElementById("komment").value,
        //Melyik koktélhoz írták
        Koktél:koktel[koktel.length-1]
    }
    //Elküldjük a kommentet a backendre
    await AdatKuldes(`/api/Koktel/SendKomment`,tartalom)
    //Úrjatöltjük az oldlat
    Betoltes()
}



async function Tisztitas() {
    //Több elemes dinamikus divek ürítése
    document.getElementById("komment").value=""
    document.getElementById("Kommentek").innerHTML=""
    document.getElementById("Ossztev").innerHTML=""
    document.getElementById("badgek").innerHTML=""
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
        const jelentesSend=await AdatKuldes(`/api/Koktel/SendJelentes`,adatok)

        //Ha nincs hiba
        if (jelentesSend.message==false) {
            document.getElementById("visszajelzes").innerHTML="Sikeres Jelentés"
        }
        //Ha van hiba, avagy jelentette már a dolgot
        else{
            document.getElementById("visszajelzes").innerHTML="Már tett jelentést ez ellen!"
        }
        //Kikapcsoljuk a küldési lehetőséget
        document.getElementById("JelNvm").setAttribute("disabled","true")
        document.getElementById("JelSend").setAttribute("disabled","true")
        //És előhozzuk a nyugtázó gombot
        document.getElementById("JelKonf").removeAttribute("hidden","true")
        document.getElementById("JelKonf").addEventListener("click",()=>
        {
            //elrejtük a felületet, és visszaállítjuk az alaphelyzetbe, hogyha megint rányom a felhasználó, ugyan úgy nézzen ki mint amikor betölt az oldal
            document.getElementById("JelNvm").removeAttribute("disabled","true")
            document.getElementById("JelSend").removeAttribute("disabled","true")
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

function Obfuszkacio(){
    if (!megtortentemar) {
        //Szétrobbantom ezeket a gombokat nehogy lehessen belekontárkodni bármibe is
        document.getElementById("FelhJel").setAttribute("type","")
        document.getElementById("FelhJel").classList.remove("btn","text-danger")
        document.getElementById("FelhJel").setAttribute("hidden","true")
    }
    megtortentemar=true

}

function torles(id){
    document.getElementById("KoktDel").value="Koktél Törlése"
    document.getElementById("KoktDel").addEventListener("click",async()=>{
        await AdatKuldes("/api/Koktel/DeleteKoktel",{id:id})
        window.location.reload()
    })
}

async function kommentTorles(id){
     await AdatKuldes("/api/Koktel/DeleteKomment",{id:id})
     Betoltes()
     
}

async function kedveles(id) {
    await AdatKuldes("/api/Koktel/SendKedvenc",{Koktél:id})
    Betoltes()
}


function ertekeles(ertekelteE,mennyire) {
    let koktel=window.location.href.split("/")
    let ertek=[document.getElementById("star1"),document.getElementById("star2"),document.getElementById("star3"),document.getElementById("star4"),document.getElementById("star5")]
    //Ha értékelve van már
    if (ertekelteE) {
        //Akkor a már megkapott értékelést megjelenítjük
        for (let i = 0; i < mennyire; i++) {
            ertek[i].value="★"
        }
        //És kikapcsoljuk a kattintást
        ertek.forEach(csillag => {
            csillag.classList.add("star")
            csillag.setAttribute("disabled","")
        });
        //És kitöröljük a gombot amivel lehet küldeni
        document.getElementById("ErtSend").setAttribute("hidden","true")
        document.getElementById("ErtSend").setAttribute("id","")
        document.getElementById("rateDisplay").innerHTML="Ön értékelte már a koktélt"
    }
    else{
        //Értékelést akar e adni a felhasználó
        let kattint=false
        //Csillagonként
        ertek.forEach(csillag => {
            csillag.classList.add("star")
            //Ha rákattintunk egy csillagra
            csillag.addEventListener("click",()=>{
                //kikapcsoljuk a hover funkciókat
                kattint=true
                //az összesnek a telítettségét nullázuk,
                csillagvaltoztatas(ertek.length,"☆")
                //és addig a csillagig betelítjük őket
                csillagvaltoztatas(ertek.indexOf(csillag)+1,"★")
            })

            //Ha rávisszük az egerünket egy csillagra
            csillag.addEventListener("pointerover",()=>{
                //de nem kattintottunk
                if (!kattint) {
                    //Akkor addig a csillagig betelítjük őket
                    csillagvaltoztatas(ertek.indexOf(csillag)+1,"★")
                }
            })
            //Ha elvisszük a csillagról az egerünket 
            csillag.addEventListener("pointerout",()=>{
                //és nem kattintottunk
                if (!kattint) {
                    //Akkor az összesnek a telítettségét nullázuk
                    csillagvaltoztatas(ertek.length,"☆")
                }
            });
        })
        function csillagvaltoztatas(honnan,mive){
            //Melyik csillagig
            for (let i = 0; i < honnan; i++) 
            {
                //Mi legyen kimutatva
                ertek[i].value=mive
            }
        }
        //Amikor le akarjuk fixálni az értékelést
        document.getElementById("ErtSend").addEventListener("click",async()=>{
            //Szűrés segítségével eltároljuk az összes csillagnak az elemét egy tömbben
            let a=ertek.filter(valaszott=>{  
                return valaszott.value=="★"
            }) 
            //Aminek a hosszát elküljük a backendre a koktél idjével
            await AdatKuldes("/api/Koktel/SendErtekeles",{Tartalom:a.length,Koktél:koktel[koktel.length-1]})
            //és újratöltjük az oldalt hogy ne adhasson új értékelést
            Betoltes()
        },{once:true})
    }

}