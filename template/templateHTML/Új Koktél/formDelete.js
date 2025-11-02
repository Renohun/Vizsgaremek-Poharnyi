let nevTorles;
let mennyisegTorles;
let alapTorles;
let leirasTorles;
let osszetevodivTorles;
let megseTorles;
let kep;
let szoveg;
document.addEventListener("DOMContentLoaded",()=>{


megseTorles = document.getElementById("megse")
megseTorles.addEventListener("click",()=>{
    const inputFile = document.getElementById("input-file");
    const ImgView = document.getElementById("img-view")
    nevTorles = document.getElementById("nev");
    mennyisegTorles = document.getElementById("mennyiseg")
    alapTorles= document.getElementById("alap")
    leirasTorles = document.getElementById("leiras")
     osszetevodivTorles = document.getElementById("osszetevoDiv")
    console.log("ad");
    
    nevTorles.value = "";
    mennyisegTorles.value = ""
    alapTorles.value = ""
    leirasTorles.value = "";
    inputFile.files[0] = "";
    szoveg = document.createElement("p")
    ImgView.style.backgroundImage = "none"
    szoveg.innerText = "Kattints ide, vagy húzd be a képet a feltöltéshez";
    ImgView.style.border = "dashed"
    kep = document.createElement("img")
    kep.src="NewCocktail_img/icon.png"
    kep.classList.add("icon")
    while(ImgView.children.length == 2){
            ImgView.appendChild(kep)
            ImgView.appendChild(szoveg)
            console.log("asda")
    }

    
    
    while(osszetevodivTorles.lastChild != osszetevodivTorles.firstChild)
    {
        osszetevodivTorles.removeChild(osszetevodivTorles.lastChild)
    }
})
})
