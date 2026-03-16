
document.addEventListener("DOMContentLoaded",async()=>{
    let be=await Betoltes()
    if (be) {

        document.getElementById("KommSend").addEventListener("click",async()=>{
            await Kommentkuldes()
        })
        document.getElementById("komment").addEventListener("keyup",()=>{
                document.getElementById("szam").innerHTML=document.getElementById("komment").value.length
        })
    }
    else{
        document.getElementById("Velemeny").innerHTML="Komment írásához és a Koktél Értékeléséhez lépj be!"
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


async function Betoltes() {
    await Tisztitas()
    let koktel=window.location.href.split("/")
    const eredmeny=await AdatLekeres(`/api/Koktel/${koktel[koktel.length-1]}`)
    if (eredmeny==undefined) {
        window.location.href="/KoktelHiba"
    }
    const koktélAdat=eredmeny.adat[0]
    const jelvényAdat=eredmeny.jelvenyek
    const osszetevoAdat=eredmeny.osszetevok
    const kommentAdat=eredmeny.komment
    
    const BadgeHely=document.getElementById("badgek")
    for (let i = 0; i < jelvényAdat.length; i++) {
        let adat=jelvényAdat[i][0]
        let badge=document.createElement("span")
        badge.innerHTML=adat.JelvényNeve
        badge.classList.add("badge","bg-primary","ms-1")
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
        BadgeHely.appendChild(badge)
    }
    const OssztevHely=document.getElementById("Ossztev")
    for (let i = 0; i < osszetevoAdat.length; i++) {
        let Ossztevo=document.createElement("li")
        Ossztevo.innerHTML=`${osszetevoAdat[i].Osszetevő} - ${osszetevoAdat[i].Mennyiség} ${osszetevoAdat[i].Mertekegyseg}`
        OssztevHely.appendChild(Ossztevo)
    }
    const KepLekeres=await AdatLekeresKep("/api/AdatlapLekeres/KoktelKepLekeres/"+koktélAdat.KoktélID)
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
    
    let KommentekHelye=document.getElementById("Kommentek")
    for (let i = kommentAdat.length-1; i > -1 ; i--) {


        let KommIroRegDate=(kommentAdat[i].RegisztracioDatuma.split("T"))[0].split("-")
        let Komment=document.createElement("div")
        let KommentIro=document.createElement("label")
        let KommentIroTagsag=document.createElement("span")
        let KommentIroReport=document.createElement("input")
        let KommentTartalom=document.createElement("textarea")


        KommentIro.classList.add("ps-2","col-12")
        KommentIro.innerHTML=kommentAdat[i].Felhasználónév
        
        KommentIroTagsag.classList.add("text-primary")
        
        KommentTartalom.setAttribute("rows","3")
        KommentTartalom.setAttribute("style","resize: none; text-align: left; box-sizing: border-box")
        KommentTartalom.setAttribute("disabled","true")
        KommentTartalom.classList.add("w-100","komment")
        KommentTartalom.innerHTML=kommentAdat[i].Tartalom
        
        if (jelenDate.getFullYear()!=KommIroRegDate[0]) {
            KommentIroTagsag.innerText+=` - ${jelenDate.getFullYear()-KommIroRegDate[0]} Éve Tag`
        }
        else if(jelenDate.getMonth()+1!=KommIroRegDate[1]){
            KommentIroTagsag.innerText+=` - ${jelenDate.getMonth()-KommIroRegDate[1]} Hónapja Tag`
        }
        else{
            KommentIroTagsag.innerText+=` - ${jelenDate.getDate()-KommIroRegDate[2]} Napja Tag`
        }
        KommentIro.appendChild(KommentIroTagsag)
        Komment.appendChild(KommentIro)
        Komment.appendChild(KommentTartalom)
        if (eredmeny.belepette) {

            KommentIroReport.setAttribute("type","button")
            KommentIroReport.classList.add("btn","text-danger","float-end","border-0")
            if (kommentAdat[i].UgyanazE==false) {
                KommentIroReport.setAttribute("value","Jelentés")
                KommentIroReport.addEventListener("click",()=>{
                    jelentes(kommentAdat[i].KommentID,"Komment",kommentAdat[i].Keszito)
                })
            }
            else{
                KommentIroReport.setAttribute("value","Törlés")
                KommentIroReport.addEventListener("click",()=>{
                    kommentTorles(kommentAdat[i].KommentID)
                })
            }
            KommentIro.appendChild(KommentIroReport)
        }
        KommentekHelye.appendChild(Komment)
    }
    if (eredmeny.belepette) {
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
        ertekeles(eredmeny.ertekeltee,eredmeny.ertekeles)
        }
    document.getElementById("KoktélKép").setAttribute("src",URL.createObjectURL(KepLekeres))
    document.getElementById("Cimsor").innerHTML=koktélAdat.KoktelCim
    document.getElementById("OldalCim").innerHTML="Pohárnyi - "+koktélAdat.KoktelCim
    document.getElementById("Madeby").innerHTML=koktélAdat.Felhasználónév + " -"
    document.getElementById("kokteldate").innerHTML="Készült: "+koktélAdat.KeszitesDatuma.split('T')[0]
    document.getElementById("recept").innerHTML=koktélAdat.Recept
    document.getElementById("mennyiseg").value=koktélAdat.AlapMennyiseg 
    if (koktélAdat.UgyanazE) {
        Obfuszkacio()
        document.getElementById("FelhJel").setAttribute("id","")
        document.getElementById("KoktJel").setAttribute("id","KoktDel")
        torles(koktélAdat.KoktélID)
    }
    else{
        document.getElementById("FelhJel").addEventListener("click",()=>{jelentes(koktélAdat.FelhID,"Felhasználó",koktélAdat.FelhID)})
        document.getElementById("KoktJel").addEventListener("click",()=>{jelentes(koktélAdat.KoktélID,"Koktél",koktélAdat.FelhID)})
    }
    document.getElementById("mennyiseg").addEventListener("change",()=>{
    OssztevHely.innerHTML=""
    for (let i = 0; i < osszetevoAdat.length; i++) {
            let Ossztevo=document.createElement("li")
            Ossztevo.innerHTML=`${osszetevoAdat[i].Osszetevő} - ${Math.round((osszetevoAdat[i].Mennyiség*(document.getElementById("mennyiseg").value/koktélAdat.AlapMennyiseg))*10)/10} ${osszetevoAdat[i].Mertekegyseg}`
            OssztevHely.appendChild(Ossztevo)
        }
    })

    return eredmeny.belepette
}

async function Kommentkuldes() {
    let koktel=window.location.href.split("/")
    let tartalom={
        Tartalom:document.getElementById("komment").value,
        Koktél:koktel[koktel.length-1]
    }
    
    const eredmeny=await AdatKuldes(`/api/Koktel/SendKomment`,tartalom)
    Betoltes()
}



async function Tisztitas() {
    document.getElementById("komment").value=""
    document.getElementById("Kommentek").innerHTML=""
    document.getElementById("Ossztev").innerHTML=""
    document.getElementById("badgek").innerHTML=""
}






async function jelentes(mit,tipus,kit) {
    var JelIv = new bootstrap.Modal(document.getElementById('JelentesLap'), {})   
    JelIv.show()
    document.getElementById("JelSend").addEventListener("click",async()=>{
            

        let adatok={
            JelentettID:kit,
            JelentettTartalomID:mit,
            JelentesTipusa:tipus,
            Indok:document.getElementById("indok").value
        }

        const jelentesSend=await AdatKuldes(`/api/Koktel/SendJelentes`,adatok)

        
        if (jelentesSend.message==false) {
            document.getElementById("visszajelzes").innerHTML="Sikeres Jelentés"
        }
        else{
            document.getElementById("visszajelzes").innerHTML="Már tett jelentést ez ellen!"
        }
        document.getElementById("JelNvm").setAttribute("disabled","true")
        document.getElementById("JelSend").setAttribute("disabled","true")
        document.getElementById("JelKonf").removeAttribute("hidden","true")
        document.getElementById("JelKonf").addEventListener("click",()=>
        {
            document.getElementById("JelNvm").removeAttribute("disabled","true")
            document.getElementById("JelSend").removeAttribute("disabled","true")
            document.getElementById("JelKonf").setAttribute("hidden","true")
            document.getElementById("visszajelzes").innerHTML=""
            document.getElementById("indok").value=""
            JelIv.hide()

        },{once:true})

    },{once:true})

    document.getElementById("JelNvm").addEventListener("click",()=>{
        JelIv.hide()
    },{once:true})

}

function Obfuszkacio(){
        //Szétrobbantom ezeket a gombokat nehogy lehessen belekontárkodni bármibe is
        document.getElementById("FelhJel").setAttribute("type","")
        document.getElementById("FelhJel").classList.remove("btn","text-danger")
        document.getElementById("FelhJel").setAttribute("hidden","true")

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
    if (ertekelteE) {
        for (let i = 0; i < mennyire; i++) {
            ertek[i].value="★"
        }
        document.getElementById("ErtSend").setAttribute("hidden","true")
        document.getElementById("ErtSend").setAttribute("id","")
        document.getElementById("rateDisplay").innerHTML="Ön értékelte már a koktélt"
    }
    else{
        //Értékelést akar e adni a felhasználó
        let kattint=false
        //Csillagonként
        ertek.forEach(csillag => {
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