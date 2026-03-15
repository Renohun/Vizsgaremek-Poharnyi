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
    let lista=["Whiskey","Tequilla","Tonic"]
    let valasztek=document.createElement("div")
    for (let i = 0; i < lista.length; i++) {
                let valasz=document.createElement("input")
                valasz.setAttribute("type","button")
                valasz.classList.add("ogomb")
                valasz.addEventListener("click",()=>{
                    osszetevoInput.value=lista[i]
                    opciokLista.removeChild(valasztek)
                    opciokLista.setAttribute("hidden","")
                })
                valasz.setAttribute("value",lista[i])
                valasztek.appendChild(valasz)
        }
    osszetevoInput.addEventListener("focusin",()=>{
        
        opciokLista.removeAttribute("hidden")
        opciokLista.appendChild(valasztek)
    })

    osszetevoInput.addEventListener("input",()=>{
        opciokLista.removeChild(valasztek)
        valasztek.innerHTML=""
        let hanydb=0
        for (let i = 0; i < lista.length; i++) {

            if (lista[i].toLowerCase().startsWith(osszetevoInput.value.toLowerCase())&&felhosszetevok.includes(lista[i])==false) {
                
                let valasz=document.createElement("input")
                valasz.setAttribute("type","button")
                valasz.classList.add("ogomb")
                valasz.addEventListener("click",()=>{
                    osszetevoInput.value=lista[i]
                    opciokLista.removeChild(valasztek)
                    opciokLista.setAttribute("hidden","")
                    hozzaadasGomb.removeAttribute("disabled","")
                })
                valasz.setAttribute("value",lista[i])
                valasztek.appendChild(valasz)
                hanydb++
            }
        }
        if (hanydb==0) {
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