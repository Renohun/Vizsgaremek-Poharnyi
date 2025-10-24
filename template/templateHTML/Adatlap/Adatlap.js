document.addEventListener("DOMContentLoaded",()=>{
    let gombok=[document.getElementById("Adatlap"),document.getElementById("Kedvencek"),document.getElementById("Koktélok"),document.getElementById("Jelentések")]
    for (let i = 0; i < gombok.length; i++) {
        gombok[i].addEventListener("click",()=>{oldalvaltas(i,gombok)})
        
    }
})

function oldalvaltas(selected,gombok){
    let oldalak=[document.getElementById("adatoldal"),document.getElementById("kedvencoldal"),document.getElementById("kokteloldal"),document.getElementById("reportoldal")]
    for (let i = 0; i < oldalak.length; i++) {
        if(oldalak[i]==oldalak[selected]){
            oldalak[i].removeAttribute("hidden","true")
            gombok[i].classList.add("jelenlegi")
        }
        else{
            oldalak[i].setAttribute("hidden","true")
            gombok[i].classList.remove("jelenlegi")
        }
    }
}