//A felhasználó által kiválaszott összetevők listája
let felhosszetevok=[]   
//Az összes összetevő listája
let osszetevoLista=[]

//Statikus elemek definiálása
let osszetevoInput=document.getElementById("osszetevo") //Ide írhat be nevet a felhasználó, illetve egy összetevőre kattintva ide fogja feltölteni a nevét
let hozzaadasGomb=document.getElementById("hozzaad") //Ezzek alakítjuk át kiválasztott összetevővé az osszetevoInput tartalmát
let opciokLista=document.getElementById("ideOpciok") //Ide fogjuk feltölteni az összes választható összetevőt


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
    //Lekérjük az összes összetevőt
    let valasz=await AdatGet("/api/PolcKoktel/OsszetevoLekeres")
    //Végigmegyünk a listán
    for (let i = 0; i < valasz.adat.length; i++) {
        //Hozzáadjuk a listához az elemeket, kisbetűsként
        osszetevoLista.push(valasz.adat[i].toLowerCase())
    }

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
        for (let i = 0; i < osszetevoLista.length; i++) {
            //Ha van olyan elem, ami a felhasználó által leírt szöveggel kezdődik, és még nincs kiválasztva
            if (osszetevoLista[i].toLowerCase().includes(osszetevoInput.value.toLowerCase())&&felhosszetevok.includes(osszetevoLista[i])==false) {
                //Létrehozzuk mint opció
                ossztetevoOpcio(osszetevoLista[i])
                vane=true
            }
        }
        //Ha nincs egy összetevő se ami megfelel a követelményeknek
        if (vane==false) {
            //Elvesszük a felhasználótól a lehetőséget arra hogy hozzáadja a semmit
            let valasztek=document.createElement("option")
            valasztek.innerHTML="Nincs ilyen összetevőnk"
            valasztek.setAttribute("disabled","")
            valasztek.classList.add("text-dark")

            opciokLista.innerHTML=""
            opciokLista.appendChild(valasztek)

            hozzaadasGomb.setAttribute("disabled","")
        }
        //Ha üres a bemeneti mező
        else if (osszetevoInput.value.length==0) {
            //Elvesszük a felhasználótól a lehetőséget arra hogy hozzáadja a semmit
            hozzaadasGomb.setAttribute("disabled","")
        }
        //Ha megfelelő a választék
        else{
            //Ha van akkor lesz lehetőségünk rányomni a gombra
            hozzaadasGomb.removeAttribute("disabled","")
        }
        })
})

//Amint rányom a hozzáadás gombra
hozzaadasGomb.addEventListener("click",()=>{
    //Ha nem üres a mező
    if (osszetevoInput.value!="") {
        //Eltároljuk jelvényként
        badge(osszetevoInput.value)
        //Majd kiűrítünk minden mást és elrejtjük az összetevőket
        osszetevoInput.value=""
        opciokLista.innerHTML=""
        opciokLista.setAttribute("hidden","")
    }
    //Majd kikapcsoljuk a gombot
    hozzaadasGomb.setAttribute("disabled","")
})

//A
function feltoltes(){
    opciokLista.innerHTML=""
    for (let i = 0; i < osszetevoLista.length; i++) {
        if (!(felhosszetevok.includes(osszetevoLista[i]))) {
            //létrehozunk egy új elemet
            ossztetevoOpcio(osszetevoLista[i])
        }
    }
    //Ha a felhasználó minden egyes lehetséges összetevőt kiválasztott már (edge case)
    if (opciokLista.childNodes.length==0) {
        //Akkor megmondjuk neki
        opciokLista.innerHTML="Nincs több összetevő!"
    }
}

//A kiválasztható összetevők megjelenítése
function ossztetevoOpcio(nev){
    //Adunk egy gombot
    let valasz=document.createElement("option")
    valasz.classList.add("ogomb")
    //A gomb szövege a lista i-edik elemének a tartalma lesz, kinézet kedvéért az első betűt nagybetűre cseréljük
    valasz.innerHTML=nev[0].toUpperCase()+nev.slice(1,nev.length)
    //Hozzáadjuk a tömbhöz
    opciokLista.appendChild(valasz)
}

//A kiválasztott összetevő jelvényben megjelenítése
function badge(nev){
    //Létrehozunk egy badget, ami az összetevő nevét tartalmazza
    let jelveny=document.createElement("span")
    jelveny.classList.add("badge","text-bg-secondary","me-1")
    jelveny.innerHTML=nev+" " //Azért kell a space hogy ne legyen rácsúszva a törlő gomb a szövegre
    
    //eltároljuk a felhasználó által kiválasztott összetevők közé az összetevőt
    felhosszetevok.push(nev.toLowerCase())
    //Csinálunk egy X gombot, ami kitörli onnan az összetevőt
    let jelvenygomb=document.createElement("input")
    jelvenygomb.setAttribute("type","button")
    jelvenygomb.setAttribute("value","x")
    jelvenygomb.classList.add("bgomb")
    jelvenygomb.addEventListener("click",()=>{
        document.getElementById("ideJelzok").removeChild(jelveny)
        felhosszetevok.splice(felhosszetevok.indexOf(nev),1)
    })
    //Hozzáadjuk a jelvényhez a gombot, a jelvényt a weblaphoz
    jelveny.appendChild(jelvenygomb)
    document.getElementById("ideJelzok").appendChild(jelveny)
}

//Ha rányom a keresés gombra
document.getElementById("kereses").addEventListener("click",async()=>{
    //Betöltjük a koktélok helyét és ki is űrítjük
    let hova=document.getElementById("ideKoktel")
    hova.innerHTML=""
    //Ha van kiválasztott összetevő
    if (felhosszetevok.length!=0) {
        //Lekérjük az összes olyan koktélt ami tartalmaz olyan összetevőt ami ki van választva
        let adatok={
            osszetevok:felhosszetevok
        }
        let valasz=(await AdatPost("/api/PolcKoktel/HelyesKoktelLekeres",adatok)).adatok

        //Minden kapott koktélt hozzáadunk a koktélhoz
        for (let i = 0; i < valasz.length; i++) {
            await kartyakeszites(valasz[i])
        }
        //Tördelés érdekében csinálunk annyi üres divet, amennyi kell
        while (hova.childNodes.length%4!=0) {
            let kamukartyaDiv=document.createElement("div")
            kamukartyaDiv.classList.add("col-10","col-sm-7","col-md-7","col-lg-6","col-xl-5","col-xxl-3","mb-1")
            hova.appendChild(kamukartyaDiv)
        }
    }
    //Ha nincs összetevő kiválasztva
    else{
        //Szólunk a felhasználónak
        var visszaJelzés = new bootstrap.Modal(document.getElementById('Visszajelzes'), {})
        document.getElementById("Okezo").addEventListener("click",()=>{
            visszaJelzés.hide()
        })   
        visszaJelzés.show()
    }
    
})

//Ha rányomunk egy összetevőre a listából
opciokLista.addEventListener("click",()=>{
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
    let kartyaGombDiv=document.createElement("div") //A Gombot tároló div
    let kartyaGomb=document.createElement("input") //Gomb
    
    kartyaDiv.classList.add("col-10","col-sm-7","col-md-7","col-lg-6","col-xl-5","col-xxl-3","mb-1")
    kartya.classList.add("card","h-100","justify-content-between","d-flex")
    kartyaKep.classList.add("card-img-top","kep")
    kartyaBody.classList.add("card-body","flex-column")
    kartyaGombDiv.classList.add("px-3","pb-3")
    kartyaTitle.classList.add("card-title")
    kartyaGomb.classList.add("btn","btn-secondary","w-100","mt-auto")
    
    //Ellenőrizzük, hogy van e értékelés és az alapján kijelezzük
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

    //Kimutatjuk milyen összetevők hiányoznak a koktél elkészítéséhez még
    let osszetevokDiv=document.createElement("div")
    let osszetevokHeader=document.createElement("div")
    let hianyzoosszetevok=[]
    for (let i = 0; i < adatok.osszetevok.length; i++) {
        //Ha a kiválasztott összetevők nem tartalmazzák ezt az összetevőt, hozzáadjuk a hiányzó listához
        if (felhosszetevok.includes(adatok.osszetevok[i].Osszetevő.toLowerCase())==false) {
            hianyzoosszetevok.push(adatok.osszetevok[i].Osszetevő)
        }
    }
    //Ha nincs meg az összes összetevő
    if (hianyzoosszetevok.length!=0) {
        //Kimutatjuk mi kell
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
    //Ha meg van, értesítjük a felhasználót erről
    else{
        osszetevokHeader.innerHTML="A koktélhoz mindened megvan! :)"
        osszetevokDiv.appendChild(osszetevokHeader)
    }
    
    kartyaOsszetevok.appendChild(osszetevokDiv)
    document.getElementById("ideKoktel").appendChild(kartyaDiv)
}