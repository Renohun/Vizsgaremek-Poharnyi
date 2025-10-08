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
let radioMentes;
let radioAlk;
let alap;
let alapInput;
document.addEventListener("DOMContentLoaded", () => 
{
//új összetevő meghívására szolgáló gomb értékadása
osszetevogomb = document.getElementById("osszetevogomb")
//addeventlistener hozzáaadása
osszetevogomb.addEventListener("click",osszetevohozzaadas)

// megse gomb létrehozása és listener hozzáadása
megsegomb = document.getElementById("megse")
megsegomb.addEventListener("click", megsefugv)
//radiogombok értékének lekérése
radioMentes = document.getElementById("mentes")
radioAlk = document.getElementById("alkoholos")
//melyik radiobutton van kiválasztva, ás attól függően eltüntetjük vagy visszahozzuk az alap div tartalmát


radioAlk.addEventListener("change",()=>{
 if(radioAlk.checked == true)
    {
        alap = document.getElementById("alapEltuntet")
        alap.style.visibility ="visible"
       
    }   

})
radioMentes.addEventListener("change",()=>{
 if(radioMentes.checked == true)
    {
        alapInput = document.getElementById("alap")
        alap = document.getElementById("alapEltuntet")
        alap.style.visibility ="hidden"
        alapInput.value = "";
        
    }   

})

})





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


