document.addEventListener("DOMContentLoaded",()=>{
    let adat=document.getElementById("Adatlap")
    let fav=document.getElementById("Kedvencek")
    let koktel=document.getElementById("Koktélok")
    let report=document.getElementById("Jelentések")

    let adatoldal=document.getElementById("adatoldal")
    let kedvoldal=document.getElementById("kedvencoldal")
    let koktoldal=document.getElementById("kokteloldal")
    let repoldal=document.getElementById("reportoldal")

    adat.addEventListener("click",()=>{
        adatoldal.removeAttribute("hidden","true")
        kedvoldal.setAttribute("hidden","true")
        koktoldal.setAttribute("hidden","true")
        repoldal.setAttribute("hidden","true")
    })
    fav.addEventListener("click",()=>{
        adatoldal.setAttribute("hidden","true")
        kedvoldal.removeAttribute("hidden","true")
        koktoldal.setAttribute("hidden","true")
        repoldal.setAttribute("hidden","true")
    })
    koktel.addEventListener("click",()=>{
        adatoldal.setAttribute("hidden","true")
        kedvoldal.setAttribute("hidden","true")
        koktoldal.removeAttribute("hidden","true")
        repoldal.setAttribute("hidden","true")
    })
    report.addEventListener("click",()=>{
        adatoldal.setAttribute("hidden","true")
        kedvoldal.setAttribute("hidden","true")
        koktoldal.setAttribute("hidden","true")
        repoldal.removeAttribute("hidden","true")
    })

})