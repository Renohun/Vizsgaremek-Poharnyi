let felhosszetevok=[]   
let lista=[]

let osszetevoInput=document.getElementById("osszetevo")
let hozzaadasGomb=document.getElementById("hozzaad")
let opciokLista=document.getElementById("ideOpciok")

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
        method: "GET",
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
    })
    //Ha
    osszetevoInput.addEventListener("",()=>{
        //Elrejtük a választható összetevőket
        opciokLista.setAttribute("hidden","")
    })
    //Amikor gépelünk
    osszetevoInput.addEventListener("input",()=>{
        //Eltüntetjük és kiürítjük az összetevők listáját
        opciokLista.innerHTML=""
        //Ez a változó arra szolgál, hogy megtudjuk van e olyan összetevő ami megfelel a feltételeknek
        let vane=false
        //Végigmegyünk az összetevőkön
        for (let i = 0; i < lista.length; i++) {
            //Ha van olyan elem, ami a felhasználó által leírt szöveggel kezdődik, és még nincs kiválasztva
            if (lista[i].toLowerCase().includes(osszetevoInput.value.toLowerCase())&&felhosszetevok.includes(lista[i])==false) {
                //Létrehozzuk mint opció
                ossztetevoOpcio(lista[i])
                vane=true
            }
        }
        if (vane==false) {
            let valasztek=document.createElement("option")
            valasztek.innerHTML="Nincs ilyen összetevőnk"
            valasztek.setAttribute("disabled","")
            valasztek.classList.add("text-dark")
            opciokLista.innerHTML=""
            opciokLista.appendChild(valasztek)
            hozzaadasGomb.setAttribute("disabled","")
        }
        else{
            hozzaadasGomb.removeAttribute("disabled","")
        }
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
        osszetevoInput.value=""
        opciokLista.innerHTML=""
        opciokLista.setAttribute("hidden","")
    }
    hozzaadasGomb.setAttribute("disabled","")
})

function feltoltes(){
    opciokLista.innerHTML=""
    for (let i = 0; i < lista.length; i++) {
        if (!(felhosszetevok.includes(lista[i]))) {
            //létrehozunk egy új elemet
            ossztetevoOpcio(lista[i])
        }
    }
    if (opciokLista.childNodes.length==0) {
        opciokLista.innerHTML="Nincs több összetevő!"
    }
}

function ossztetevoOpcio(nev){
    //Adunk egy gombot
    let valasz=document.createElement("option")
    valasz.classList.add("ogomb")
    //A gomb szövege a lista i-edik elemének a tartalma lesz
    valasz.innerHTML=nev
    //Hozzáadjuk a tömbhöz
    opciokLista.appendChild(valasz)
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
    })
    jelveny.appendChild(jelvenygomb)
    document.getElementById("ideJelzok").appendChild(jelveny)
}

document.getElementById("kereses").addEventListener("click",async()=>{
    let hova=document.getElementById("ideKoktel")
    if (felhosszetevok.length!=0) {
        
        let adatok={
            osszetevok:felhosszetevok
        }
        hova.innerHTML=""
        let valasz=(await AdatPost("/api/PolcKoktel/HelyesKoktelLekeres",adatok)).adatok
        for (let i = 0; i < valasz.length; i++) {
            await kartyakeszites(valasz[i])
        }
        while (hova.childNodes.length%4!=0) {
            let kamukartyaDiv=document.createElement("div")
            kamukartyaDiv.classList.add("col-10","col-sm-7","col-md-7","col-lg-6","col-xl-5","col-xxl-3","mb-1")
            hova.appendChild(kamukartyaDiv)
        }
    }
    else{
        hova.innerHTML=""
        var visszaJelzés = new bootstrap.Modal(document.getElementById('Visszajelzes'), {})
        document.getElementById("Okezo").addEventListener("click",()=>{
            visszaJelzés.hide()
        })   
        visszaJelzés.show()
    }
    
})

    //Amire rákattintva
opciokLista.addEventListener("change",()=>{
    //belerakjuk a input mezőbe és kiszedjük a listából
    osszetevoInput.value=opciokLista.value
    opciokLista.innerHTML=""
    opciokLista.setAttribute("hidden","")
    if (hozzaadasGomb.hasAttribute("disabled")) 
    {
        hozzaadasGomb.removeAttribute("disabled","")
    }
})


async function kartyakeszites(adatok){
    let kartyaDiv=document.createElement("div") //A kártya divje
    let kartya=document.createElement("div") //A kártya
    let kartyaBody=document.createElement("div") //A kártya többi adatának a divje

    let kartyaKep=document.createElement("img") //kép
    let kartyaTitle=document.createElement("h4") //cim
    let kartyaErtekeles=document.createElement("div") //ertekeles
    let kartyaOsszetevok=document.createElement("div") //A koktél összetevői
    let kartyaGombDiv=document.createElement("div")
    let kartyaGomb=document.createElement("input") //Gomb
    
    kartyaDiv.classList.add("col-10","col-sm-7","col-md-7","col-lg-6","col-xl-5","col-xxl-3","mb-1")
    kartya.classList.add("card","h-100","justify-content-between","d-flex")
    kartyaKep.classList.add("card-img-top","kep")
    kartyaBody.classList.add("card-body","flex-column")
    kartyaGombDiv.classList.add("px-3","pb-3")
    kartyaTitle.classList.add("card-title")
    kartyaGomb.classList.add("btn","btn-secondary","w-100","mt-auto")
    
    if (adatok.ertekeles.AtlagErt!=null) 
    {
        let csillagert=Math.ceil(adatok.ertekeles.AtlagErt)
        let csillagok=""
        for (let i = 0; i < csillagert; i++) {
            csillagok+="★"
        }
        for (let i = 0; i < 5-csillagert; i++) {
            csillagok+="☆"
            
        }
        kartyaErtekeles.innerHTML=`Értékelés:${csillagok} (${Math.round(adatok.ertekeles.AtlagErt * 10) / 10})`
    }
    else
    {
        kartyaErtekeles.innerHTML="Nincs még értékelés!"
    }

    //Összeépítés
    kartyaBody.appendChild(kartyaTitle)
    kartyaBody.appendChild(kartyaErtekeles)
    kartyaBody.appendChild(kartyaOsszetevok)
    kartyaGombDiv.appendChild(kartyaGomb)
    kartya.appendChild(kartyaKep)
    kartya.appendChild(kartyaBody)
    kartya.appendChild(kartyaGombDiv)
    kartyaDiv.appendChild(kartya)
    
    kartyaKep.setAttribute("src",URL.createObjectURL(await AdatGetKep("/api/AdatlapLekeres/KepLekeres/"+adatok.adatok.BoritoKepUtvonal)))
    kartyaTitle.innerHTML=adatok.adatok.KoktelCim


    kartyaGomb.setAttribute("value","Tovább a Koktélra")
    kartyaGomb.addEventListener("click",()=>{
        window.location.href=`/Koktel/${adatok.adatok.KoktélID}`
    })

    let osszetevokDiv=document.createElement("div")
    let osszetevokHeader=document.createElement("div")
    let hianyzoosszetevok=[]
    for (let i = 0; i < adatok.osszetevok.length; i++) {
        if (felhosszetevok.includes(adatok.osszetevok[i].Osszetevő)==false) {
            hianyzoosszetevok.push(adatok.osszetevok[i].Osszetevő)
        }
    }
    if (hianyzoosszetevok.length!=0) {
        osszetevokHeader.innerHTML="A koktélhoz kell még:"
        let osszetevok=document.createElement("ul")
        if (hianyzoosszetevok.length>3) {
            for (let i = 0; i < 3; i++) {
                let osszetevo=document.createElement("li")
                osszetevo.innerHTML=hianyzoosszetevok[i]
                osszetevok.appendChild(osszetevo)
            }
            let osszetevo=document.createElement("li")
            osszetevo.innerHTML=`És további ${hianyzoosszetevok.length-3} összetevő`
            osszetevok.appendChild(osszetevo)
            osszetevokDiv.appendChild(osszetevokHeader)
            osszetevokDiv.appendChild(osszetevok)
        }
        else{
            for (let i = 0; i < hianyzoosszetevok.length; i++) {
                let osszetevo=document.createElement("li")
                osszetevo.innerHTML=hianyzoosszetevok[i]
                osszetevok.appendChild(osszetevo)
            }
            for (let i = 0; i < 4-hianyzoosszetevok.length; i++) {
                let osszetevo=document.createElement("div")
                osszetevo.style.height="24px"
                osszetevok.appendChild(osszetevo)
            }
            osszetevokDiv.appendChild(osszetevokHeader)
            osszetevokDiv.appendChild(osszetevok)
        }
    }
    else{
        osszetevokHeader.innerHTML="A koktélhoz mindened megvan! :)"
        osszetevokDiv.appendChild(osszetevokHeader)
    }
    




    kartyaOsszetevok.appendChild(osszetevokDiv)
    document.getElementById("ideKoktel").appendChild(kartyaDiv)
}