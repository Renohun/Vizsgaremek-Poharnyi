let nevTorles;
let mennyisegTorles;
let alapTorles;
let leirasTorles;
let osszetevodivTorles;
let megseTorles;
let kep;
let szoveg
let Osszetevok = [];
let osztvGomb;
let osszetevoDiv;
let szamlalo = 1;

document.addEventListener("DOMContentLoaded",()=>{
 
    osztvGomb = document.getElementById("osszetevogomb")
    osztvGomb.addEventListener("click",()=>{
    szamlalo ++;
    Osszetevok.push("osztv" + szamlalo)
        console.log(Osszetevok)
    })

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
    szoveg = document.getElementById("szoveg")
    kep = document.getElementById("iconkep")
    ImgView.style.border = "dashed"
    szoveg.removeAttribute("hidden",'true')
    kep.removeAttribute("hidden",'true')
    ImgView.style.backgroundImage = `url()`;
    osszetevoDiv = document.getElementById("osszetevoDiv")
    let apa;
    let nagypapa;
    for (let i = 0; i < Osszetevok.length; i++)
    {  
        console.log(Osszetevok[i]);
        
       let torles = document.getElementById(Osszetevok[i])
       apa = torles.parentElement;
       nagypapa = apa.parentElement;
       console.log(apa)
        console.log(nagypapa)
        osszetevoDiv.removeChild(nagypapa)
    }
    Osszetevok = [];
})
})
