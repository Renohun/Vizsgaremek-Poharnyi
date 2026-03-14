function badge(nev){
    let jelveny=document.createElement("span")
    jelveny.classList.add("badge","text-bg-secondary","me-1")
    jelveny.innerHTML=nev+" "
    let jelvenygomb=document.createElement("input")
    jelvenygomb.setAttribute("type","button")
    jelvenygomb.setAttribute("value","x")
    jelvenygomb.classList.add("bgomb")
    jelvenygomb.addEventListener("click",()=>{
        document.getElementById("ideJelzok").removeChild(jelveny)
    })
    jelveny.appendChild(jelvenygomb)
    document.getElementById("ideJelzok").appendChild(jelveny)
}

document.addEventListener("DOMContentLoaded",()=>{
    badge("Whiskey")
    badge("Rum")
    badge("Tequilla")
    badge("Tonic")
    let lista=["Whiskey","Tequilla","Tonic"]
    let valasztek=document.createElement("div")
    for (let i = 0; i < lista.length; i++) {
                let valasz=document.createElement("input")
                valasz.setAttribute("type","button")
                valasz.classList.add("ogomb")
                valasz.addEventListener("click",()=>{
                    document.getElementById("osszetevo").value=lista[i]
                    document.getElementById("ideOpciok").removeChild(valasztek)
                    document.getElementById("ideOpciok").setAttribute("hidden","")
                })
                valasz.setAttribute("value",lista[i])
                valasztek.appendChild(valasz)
        }
    document.getElementById("osszetevo").addEventListener("focusin",()=>{
        
        document.getElementById("ideOpciok").removeAttribute("hidden")
        document.getElementById("ideOpciok").appendChild(valasztek)
    })

    document.getElementById("osszetevo").addEventListener("input",()=>{
        document.getElementById("ideOpciok").removeChild(valasztek)
        valasztek.innerHTML=""
        let hanydb=0
        for (let i = 0; i < lista.length; i++) {
            if (lista[i].toLowerCase().startsWith(document.getElementById("osszetevo").value.toLowerCase())) {
                
                let valasz=document.createElement("input")
                valasz.setAttribute("type","button")
                valasz.classList.add("ogomb")
                valasz.addEventListener("click",()=>{
                    document.getElementById("osszetevo").value=lista[i]
                    document.getElementById("ideOpciok").removeChild(valasztek)
                    document.getElementById("ideOpciok").setAttribute("hidden","")
                })
                valasz.setAttribute("value",lista[i])
                valasztek.appendChild(valasz)
                hanydb++
            }
        }
        if (hanydb==0) {
            valasztek.innerHTML="Nincs ilyen összetevőnk"
        }
        document.getElementById("ideOpciok").appendChild(valasztek)
        })
        
})

document.getElementById("hozzaad").addEventListener("click",()=>{
    badge(document.getElementById("osszetevo").value)
    document.getElementById("osszetevo").value=""
})