document.addEventListener("DOMContentLoaded",()=>{
    Betoltes()
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
async function Betoltes() {
    let koktel=window.location.href.split("/")
    const eredmeny=await AdatLekeres(`/api/Koktel/${koktel[koktel.length-1]}`)
    if (eredmeny==undefined) {
        window.location.href="/KoktelHiba"
    }
    const koktélAdat=eredmeny.adat[0]
    const jelvényAdat=eredmeny.jelvenyek
    const osszetevoAdat=eredmeny.osszetevok
    const kommentAdat=eredmeny.komment
    console.log(koktélAdat);
    console.log(jelvényAdat);
    console.log(osszetevoAdat);
    console.log(eredmeny);
    
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
        Ossztevo.innerHTML=`${osszetevoAdat[i].Osszetevő} - ${osszetevoAdat[i].Mennyiség} ml`
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
    for (let i = 0; i < kommentAdat.length; i++) {

        console.log(kommentAdat[i]);
        let KommIroRegDate=(kommentAdat[i].RegisztracioDatuma.split("T"))[0].split("-")
        let Komment=document.createElement("div")
        let KommentIro=document.createElement("label")
        let KommentIroTagsag=document.createElement("span")
        let KommentIroReport=document.createElement("input")
        let KommentTartalom=document.createElement("textarea")
        
        

        KommentIro.classList.add("ps-2","col-12")
        KommentIro.innerHTML=kommentAdat[i].Felhasználónév
        
        KommentIroTagsag.classList.add("text-primary")
        
        KommentIroReport.setAttribute("type","button")
        KommentIroReport.setAttribute("value","Jelentés")
        KommentIroReport.classList.add("btn","text-danger","float-end")
        
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
        KommentIro.appendChild(KommentIroReport)
        Komment.appendChild(KommentIro)
        Komment.appendChild(KommentTartalom)
        KommentekHelye.appendChild(Komment)
    }
    document.getElementById("KoktélKép").setAttribute("src",URL.createObjectURL(KepLekeres))
    document.getElementById("Cimsor").innerHTML=koktélAdat.KoktelCim
    document.getElementById("Madeby").innerHTML=koktélAdat.Felhasználónév + " -"
    document.getElementById("recept").innerHTML=koktélAdat.Recept
}

async function jelentes(id,tipus) {
    
}