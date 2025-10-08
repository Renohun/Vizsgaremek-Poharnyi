//Globális változók létrehozása
let kepfeltolt;
let koktelnev;
let koktelalap;
let koktelmennyiseg;
let osszetevok = [];
let osszetevogomb;
let gombnyomasszam = 1;
let koktelurlap = document.getElementById("koktelurlap")
let osszetevodiv;
let megsegomb;
document.addEventListener("DOMContentLoaded", () => 
{
//értékadás a kepfeltolt változónak
kepfeltolt = document.getElementById("kepfeltoltes")
//click listener meghívása
kepfeltolt.addEventListener("click",feltolt)
//új összetevő meghívására szolgáló gomb értékadása
osszetevogomb = document.getElementById("osszetevogomb")
//addeventlistener hozzáaadása
osszetevogomb.addEventListener("click",osszetevohozzaadas)

// megse gomb létrehozása és listener hozzáadása
megsegomb = document.getElementById("megse")
megsegomb.addEventListener("click", megsefugv)

})
//A koktél borítóképének feltöltésére szolgáló function
function feltolt()
{
    alert("sikeres feltöltés!")
}



//új összetevő hozzáadása function(alfa lol)
function osszetevohozzaadas()
{
    gombnyomasszam ++;
    //új összetevő input mezőjének létrehozása DOM segítségével és bootstrap osztályok hozzáadása
  
    osszetevodiv = document.getElementById("osszetevoDiv")
    let col = document.createElement("div")
    col.classList.add("col-sm-12")
    col.id ="osszetevoCol" + gombnyomasszam;
    let input = document.createElement("input")
    input.classList.add("form-control")
    input.type = "text"
    input.placeholder = "Összetevő" + " " + gombnyomasszam;
    input.id = "osszetevo" + gombnyomasszam
    input.style.marginTop = "5px"
    //parent-child viszonyok meghatározása
    
    osszetevodiv.appendChild(col)
    col.appendChild(input)
}

//megse gomb törlés függvény

function megsefugv()
{
    alert("sikeres törlés!")
}