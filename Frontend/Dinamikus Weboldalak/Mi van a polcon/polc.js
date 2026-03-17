let felhosszetevok=[]
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

let osszetevoInput=document.getElementById("osszetevo")
let hozzaadasGomb=document.getElementById("hozzaad")
let opciokLista=document.getElementById("ideOpciok")



document.addEventListener("DOMContentLoaded",()=>{
    //A koktélok összevetőit tartalmazó lista
    let lista=["Whiskey","Tequilla","Tonic"]
    //A suggestion tömb létrehozása, és feltöltése
    let valasztek=document.createElement("div")
    //elemenként
    for (let i = 0; i < lista.length; i++) {
            //létrehozunk egy új elemet
            ossztetevoOpcio(lista[i],valasztek)
    }
    //Ha rámegyünk a szövegmezőre
    osszetevoInput.addEventListener("focusin",()=>{
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
            if (lista[i].toLowerCase().startsWith(osszetevoInput.value.toLowerCase())&&felhosszetevok.includes(lista[i])==false) {
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
})



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
    })
    //A gomb szövege a lista i-edik elemének a tartalma lesz
    valasz.setAttribute("value",nev)
    //Hozzáadjuk a tömbhöz
    div.appendChild(valasz)
}