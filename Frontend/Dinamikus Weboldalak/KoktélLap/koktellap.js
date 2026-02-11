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
        TagOta.innerText=`${keszitesDate[0]-jelenDate.getFullYear()} Éve Tag`
    }
    else if(jelenDate.getMonth()+1!=keszitesDate[1]){
        TagOta.innerText=`${keszitesDate[1]-jelenDate.getMonth()} Hónapja Tag`
    }
    else{
        TagOta.innerText=`${keszitesDate[2]-jelenDate.getDay()} Napja Tag`
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
        Komment.classList.add("p-0")
        KommentTartalom.setAttribute("rows","3")
        KommentIro.classList.add("p-0")
        KommentIroTagsag.classList.add("text-primary")
        KommentIroReport.setAttribute("type","button")
        KommentIroReport.setAttribute("value","!")
        KommentIroReport.classList.add("btn","text-danger")
        KommentTartalom.classList.add("w-100","p-0")
        KommentIro.innerHTML=kommentAdat[i].Felhasználónév
        KommentTartalom.innerHTML=kommentAdat[i].Tartalom
        if (jelenDate.getFullYear()!=KommIroRegDate[0]) {
            KommentIroTagsag.innerText+=` - ${KommIroRegDate[0]-jelenDate.getFullYear()} Éve Tag`
        }
        else if(jelenDate.getMonth()+1!=KommIroRegDate[1]){
            KommentIroTagsag.innerText+=` - ${KommIroRegDate[1]-jelenDate.getMonth()} Hónapja Tag`
        }
        else{
            KommentIroTagsag.innerText+=` - ${KommIroRegDate[2]-jelenDate.getDay()} Napja Tag`
        }
        KommentTartalom.setAttribute("disabled","true")
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