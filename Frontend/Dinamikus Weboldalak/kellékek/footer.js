document.addEventListener('DOMContentLoaded',()=>{
    let hova=(document.getElementsByTagName("body"))[0]
    
    let footer=document.createElement("footer")
    footer.classList.add("fs-5","shadow","w-100")
    let container=document.createElement("div")
    container.classList.add("container")

    let jogok=document.createElement("div")
    jogok.classList.add("col-12","text-center")
    jogok.innerHTML="© 2026 Pohárnyi. Minden jog fenntartva."

    let gombok=document.createElement("div")
    gombok.classList.add("row")
    
    let padding1=document.createElement("div")
    padding1.classList.add("col-lg-4","col-md-12")

    let padding2=document.createElement("div")
    padding2.classList.add("col-lg-2","col-md-12")

    let bal=document.createElement("div")
    bal.classList.add("col-lg-2","col-md-12")

    let gombDiv1=document.createElement("div")
    gombDiv1.classList.add("text-lg-end","text-center")
    let gomb1=document.createElement("a")
    gomb1.innerHTML="Kapcsolat"
    gomb1.setAttribute("href","/KuldjUzenetet")
    gomb1.setAttribute("target","_blank")
    gombDiv1.appendChild(gomb1)

    let gombDiv2=document.createElement("div")
    gombDiv2.classList.add("text-lg-end","text-center")
    let gomb2=document.createElement("a")
    gomb2.innerHTML="Hibajelentés"
    gomb2.setAttribute("href","https://forms.gle/cp3o19kbEVdXiZ7L9")
    gomb2.setAttribute("target","_blank")
    gombDiv2.appendChild(gomb2)

    bal.appendChild(gombDiv1)
    bal.appendChild(gombDiv2)


    let jobb=document.createElement("div")
    jobb.classList.add("col-lg-4","col-md-12")

    let gombDiv3=document.createElement("div")
    gombDiv3.classList.add("text-lg-start","text-center")
    let gomb3=document.createElement("a")
    gomb3.innerHTML="Felhasználói kézikönyv"
    gomb3.setAttribute("href","https://docs.google.com/document/d/1v0a3spWwt7PhzVD1G-6yM7p9Nm0SlfVEdCAOln9patc/edit?tab=t.0")
    gomb3.setAttribute("target","_blank")
    gombDiv3.appendChild(gomb3)

    let gombDiv4=document.createElement("div")
    gombDiv4.classList.add("text-lg-start","text-center")
    let gomb4=document.createElement("a")
    gomb4.innerHTML="Adatkezelési Nyilatkozat"
    gomb4.setAttribute("href","")
    gomb4.setAttribute("target","_blank")
    gombDiv4.appendChild(gomb4)

    jobb.appendChild(gombDiv3)
    jobb.appendChild(gombDiv4)

    gombok.appendChild(padding1)
    gombok.appendChild(bal)
    gombok.appendChild(jobb)
    gombok.appendChild(padding2)

    container.appendChild(jogok)
    container.appendChild(gombok)
    footer.appendChild(container)

    hova.appendChild(footer)
})
