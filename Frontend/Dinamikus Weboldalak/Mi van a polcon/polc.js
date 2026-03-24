let felhosszetevok=[]   
let lista=[]

let osszetevoInput=document.getElementById("osszetevo")
let hozzaadasGomb=document.getElementById("hozzaad")
let opciokLista=document.getElementById("ideOpciok")
let valasztek=document.createElement("div")

const AdatGet=async(url)=>{
    try {
      const ertek=await fetch(url,{
        method:"GET",
        headers:{"Content-Type":"application/json"}
      })  
      if (ertek.ok) {
        return ertek.json()
      }
      else{
        console.log("hiba");
        
      }
    } 
    catch (error) {
        console.error(error)
    }
}
const AdatGetKep=async(url)=>{
    try {
      const ertek=await fetch(url,{
        method: "POST",
        headers: {"Content-Type":"image/jpeg"}
      })  
      if (ertek.ok) {
        return ertek.blob()
      }
      else{
        console.log("hiba");
        
      }
    } 
    catch (error) {
        console.error(error)
    }
}
const AdatPost=async(url,data)=>{
    try {
      const ertek=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      })  
      if (ertek.ok) {
        return ertek.json()
      }
      else{
        console.log("hiba");
        
      }
    } 
    catch (error) {
        console.error(error)
    }
}

document.addEventListener("DOMContentLoaded",async()=>{
    //A koktélok összevetőit tartalmazó lista
    let valasz=await AdatGet("/api/PolcKoktel/OsszetevoLekeres")
    lista=valasz.adat
    //A suggestion tömb létrehozása, és feltöltése
    
    //elemenként
    feltoltes()
    //Ha rámegyünk a szövegmezőre
    osszetevoInput.addEventListener("focusin",()=>{
        feltoltes()
        //Megjeleníjük a választható összetevőket
        opciokLista.removeAttribute("hidden")
        opciokLista.appendChild(valasztek)
    })
    //Ha
    opciokLista.addEventListener("",()=>{
        //Elrejtük a választható összetevőket
        opciokLista.setAttribute("hidden","")
        opciokLista.removeChild(valasztek)
    })
    //Amikor gépelünk
    osszetevoInput.addEventListener("input",()=>{
        //Eltüntetjük és kiürítjük az összetevők listáját
        opciokLista.removeChild(valasztek)
        valasztek.innerHTML=""
        //Ez a változó arra szolgál, hogy megtudjuk van e olyan összetevő ami megfelel a feltételeknek
        let vane=false
        //Végigmegyünk az összetevőkön
        for (let i = 0; i < lista.length; i++) {
            //Ha van olyan elem, ami a felhasználó által leírt szöveggel kezdődik, és még nincs kiválasztva
            if (lista[i].toLowerCase().includes(osszetevoInput.value.toLowerCase())&&felhosszetevok.includes(lista[i])==false) {
                //Létrehozzuk mint opció
                ossztetevoOpcio(lista[i],valasztek)
                vane=true
            }
        }
        if (vane==false) {
            valasztek.innerHTML="Nincs ilyen összetevőnk"
            hozzaadasGomb.setAttribute("disabled","")
        }
        else{
            hozzaadasGomb.removeAttribute("disabled","")
        }
        opciokLista.appendChild(valasztek)
        })
})

osszetevoInput.addEventListener("input",()=>{
    if (osszetevoInput.value.length==0) {
        hozzaadasGomb.setAttribute("disabled","")
    }
    else{
        hozzaadasGomb.removeAttribute("disabled","")
    }
})

hozzaadasGomb.addEventListener("click",()=>{
    if (osszetevoInput.value!="") {
        badge(osszetevoInput.value)
        console.log(felhosszetevok);
        osszetevoInput.value=""
    }
    hozzaadasGomb.setAttribute("disabled","")
})

function feltoltes(){
    valasztek.innerHTML=""
    for (let i = 0; i < lista.length; i++) {
        if (!(felhosszetevok.includes(lista[i]))) {
            //létrehozunk egy új elemet
            ossztetevoOpcio(lista[i],valasztek)
        }
    }
    if (valasztek.childNodes.length==0) {
        valasztek.innerHTML="Nincs több összetevő!"
    }
}

function ossztetevoOpcio(nev,div){
    //Adunk egy gombot
    let valasz=document.createElement("input")
    valasz.setAttribute("type","button")
    valasz.classList.add("ogomb")
    //Amire rákattintva
    valasz.addEventListener("click",()=>{
        //belerakjuk a input mezőbe és kiszedjük a listából
        osszetevoInput.value=nev
        opciokLista.removeChild(div)
        opciokLista.setAttribute("hidden","")

        if (hozzaadasGomb.hasAttribute("disabled")) {
            hozzaadasGomb.removeAttribute("disabled","")
        }
    })
    //A gomb szövege a lista i-edik elemének a tartalma lesz
    valasz.setAttribute("value",nev)
    //Hozzáadjuk a tömbhöz
    div.appendChild(valasz)
}

function badge(nev){
    let jelveny=document.createElement("span")
    jelveny.classList.add("badge","text-bg-secondary","me-1")
    jelveny.innerHTML=nev+" "
    felhosszetevok.push(nev)
    let jelvenygomb=document.createElement("input")
    jelvenygomb.setAttribute("type","button")
    jelvenygomb.setAttribute("value","x")
    jelvenygomb.classList.add("bgomb")
    jelvenygomb.addEventListener("click",()=>{
        document.getElementById("ideJelzok").removeChild(jelveny)
        felhosszetevok.splice(felhosszetevok.indexOf(nev),1)
        console.log(felhosszetevok);
    })
    jelveny.appendChild(jelvenygomb)
    document.getElementById("ideJelzok").appendChild(jelveny)
}

document.getElementById("kereses").addEventListener("click",async()=>{
    let adatok={
        osszetevok:felhosszetevok
    }
    let valasz=await AdatPost("/api/PolcKoktel/HelyesKoktelLekeres",adatok)
    console.log(valasz);
    
})