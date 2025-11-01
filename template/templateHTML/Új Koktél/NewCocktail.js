//Globális változók létrehozása
let kepfeltolt;
let koktelnev;
let koktelalap;
let koktelmennyiseg;
let osszetevok = ["osztv1"];
let osszetevogomb;
let gombnyomasszam = 1;
let koktelurlap = document.getElementById("koktelurlap")
let osszetevodiv;
let megsegomb;
let radioMentes;
let radioAlk;
let alap;
let alapInput;
let osszetevoform;
let torlesgomb
let DeleteOsszetevo;
let osszetevo;
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
        alap.hidden = false
       
    }   

})
radioMentes.addEventListener("change",()=>{
 if(radioMentes.checked == true)
    {
        alapInput = document.getElementById("alap")
        alap = document.getElementById("alapEltuntet")
        alap.hidden = true
        alapInput.value = "";
        
    }   

})
//elso osztv törlése
osszetevo = document.getElementById("osztv1")
osszetevo.addEventListener("click",()=>{
osszetevodiv = document.getElementById("osszetevoDiv")
let elsoOsztv = document.getElementById("elsoOsszetevo")
osszetevodiv.removeChild(elsoOsztv)
console.log("kala")
})
})





//új összetevő hozzáadása function(alfa lol)
function osszetevohozzaadas()
{
    gombnyomasszam ++;
    //új összetevő input mezőjének létrehozása DOM segítségével és bootstrap osztályok hozzáadása
    osszetevoform = document.createElement("form")
    osszetevodiv = document.getElementById("osszetevoDiv")
    torlesgomb = document.createElement("button")
    torlesgomb.type ="button"
    torlesgomb.innerText = "X"
    torlesgomb.classList.add("Osszetevobtn")
    torlesgomb.id = "osztv" + gombnyomasszam;
    let col = document.createElement("div")
    col.classList.add("row","mt-1")
    col.id ="osszetevoCol" + gombnyomasszam;
    let input = document.createElement("input")
    input.classList.add("OsszetevoBar")
    input.type = "text"
    input.placeholder = "Összetevő";
    input.id = "osszetevo" + gombnyomasszam 
    //parent-child viszonyok meghatározása
    col.appendChild(osszetevoform)
    osszetevoform.appendChild(input)
    osszetevoform.appendChild(torlesgomb)
    osszetevodiv.appendChild(col)
    osszetevok.push(torlesgomb.id);
    console.log(osszetevok)
   
    //torles
    torlesgomb.addEventListener("click",()=>{
    osszetevodiv.removeChild(col)
        
    })

}

//megse gomb törlés függvény

function megsefugv()
{
    alert("sikeres törlés!")
}


