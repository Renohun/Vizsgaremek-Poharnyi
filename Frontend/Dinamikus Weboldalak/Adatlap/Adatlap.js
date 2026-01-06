document.addEventListener("DOMContentLoaded",()=>{
    //A Sidebar gombjainak listája
    const gombok=[document.getElementById("Adatlap"),document.getElementById("Kedvencek"),document.getElementById("Koktélok"),document.getElementById("Jelentések"),document.getElementById("Kosár")]
    //Mindegyiknek adunk egy eventListenert
    for (let i = 0; i < gombok.length; i++) {
        gombok[i].addEventListener("click",()=>{oldalvaltas(i,gombok)})
        
    }
    //Profilkep Változtatás
    let fajl=document.getElementById("input")
    let kep=document.getElementById("profilkep")
    fajl.addEventListener("change",()=>{
        kep.setAttribute("src",URL.createObjectURL(fajl.files[0]))
        console.log(URL.createObjectURL(fajl.files[0]));
        
    })
    let NavProfil=document.getElementById("Profile")
    let mentes=document.getElementById("Mentés")
    let mégse=document.getElementById("Mégse")
    mentes.addEventListener("click",()=>{
        adatvaltas()
    })
    mégse.addEventListener("click",()=>{
        undo()
    })
    AdatlapLekeres()
})

//Megkeressük annak a gombnak a párját amit lenyomtunk, és azt mutatjuk, illetve átteszük az aláhúzást
function oldalvaltas(selected,gombok){
    //oldalak listája egy tömbben
    const oldalak=[document.getElementById("adatoldal"),document.getElementById("kedvencoldal"),document.getElementById("kokteloldal"),document.getElementById("reportoldal"),document.getElementById("kosároldal")]
    //végigmegyünk a tömbön, és a kiválasztott oldalt megmutatjuk, és a hozzá tartozó sidebar elemet aláhúzzuk
    for (let i = 0; i < oldalak.length; i++) {
        if(oldalak[i]==oldalak[selected]){
            oldalak[i].removeAttribute("hidden","true")
            gombok[i].classList.add("jelenlegi")
            betoltes(i)
        }
        else{
            oldalak[i].setAttribute("hidden","true")
            gombok[i].classList.remove("jelenlegi")
        }
    }
}
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
const AdatPost=async(url,data)=>{
    try {
      const ertek=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:data
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
async function AdatlapLekeres(){
    
    let celpontok=[document.getElementById("Felhasználónév"),document.getElementById("Email-cím"),document.getElementById("Jelszó"),document.getElementById("profilkep"),document.getElementById("RegDate")]
    let valtozok=["Felhasználónév","Email","Jelszó","ProfilkepUtvonal","RegisztracioDatuma"]
    const valasz=await AdatGet("/api/AdatlapLekeres/FelhAdatok/"+2)
    let ertek=valasz.tartalom[0][0];
    
    for (let index = 0; index < celpontok.length-1; index++) {
        celpontok[index].value=ertek[valtozok[index]]
        
    }
    celpontok[4].innerHTML=ertek[valtozok[4]]
    document.getElementById("KeszitKoktelNum").innerHTML=(valasz.tartalom[4][0]).MAKEID
    document.getElementById("KedveltKoktelNum").innerHTML=(valasz.tartalom[1][0]).KEDVID
    document.getElementById("KommentNum").innerHTML=(valasz.tartalom[2][0]).KOMMID
    document.getElementById("ErtekNum").innerHTML=(valasz.tartalom[3][0]).RATEID
}
async function KedvencekLekeres() {
    const valasz=await AdatGet("/api/AdatlapLekeres/Kedvencek/"+1)
    //Ideiglenes Számolás a soroknak. További adatok kellenek a tényleges "Stressz Teszthez"
    console.log(valasz.adat.length);
    console.log(valasz.adat.length/4);
    console.log(valasz.adat.length/4+0.5);
    console.log(Math.round(valasz.adat.length/4));
    console.log(Math.round((valasz.adat.length/4)+0.5));
    let kulsoertek=0
    let sorszam=Math.round((valasz.adat.length/4)+0.5)
    let hova=document.getElementById("kedvencoldal")
    for (let i = 0; i < sorszam; i++) 
    {
        let sor=document.createElement("div")
        sor.classList.add("row","justify-content-center")
        let maxertek=4+i*4
        for (kulsoertek; kulsoertek < maxertek; kulsoertek++) 
        {
            if (valasz.adat[kulsoertek]!=null) {
                console.log(valasz.adat[kulsoertek]);
                //elemek létrehozása
                let koktelDiv=document.createElement("div")
                let koktelCard=document.createElement("div")
                let koktelKep=document.createElement("img") //Pathinget ki kell még találni
                let koktelTartalom=document.createElement("div")
                let koktelNev=document.createElement("h4")
                let koktelErtekeles=document.createElement("span")
                let koktelSzoveg=document.createElement("div")
                let koktelBadge=document.createElement("div") //Jelenleg semmit se csinal
                let koktelOsszetevok=document.createElement("span")
                let koktelOsszetevoLista=document.createElement("ul")
                let koktelOldal=document.createElement("input")
                //bootstrap és css elemek megadása
                koktelDiv.classList.add("col-8","col-sm-7","col-md-6","col-lg-6","col-xl-3","col-xxl-3","mb-1")
                koktelCard.classList.add("card","h-100")
                koktelKep.classList.add("card-img-top","kep")
                koktelTartalom.classList.add("card-body")
                koktelNev.classList.add("card-title")
                koktelSzoveg.classList.add("card-text")
                koktelOldal.classList.add("btn","btn-secondary")
                //értékek megadása
                koktelKep.setAttribute("src",valasz.adat[kulsoertek].BoritoKepUtvonal)
                koktelKep.setAttribute("alt","Itt a koktélnak kéne megjelennie teljes gyönyörében.. de nincs itt.")
                koktelKep.setAttribute("title",`így néz ki egy ${valasz.adat[kulsoertek].KoktelCim}`)
                koktelNev.innerHTML=valasz.adat[kulsoertek].KoktelCim
                koktelOsszetevok.innerHTML="Összetevők:"
                koktelOldal.setAttribute("type","button")
                koktelOldal.setAttribute("value","Tovább a Receptre")
                //Van-e értékelés
                if (valasz.ertek[kulsoertek][0].Osszert!=null) 
                {
                    koktelErtekeles.innerHTML=`Értékelés:${valasz.ertek[kulsoertek][0].Osszert}/5`
                }
                else
                {
                     koktelErtekeles.innerHTML="Nincs még értékelés!"
                }
                //Összevetők kijelzése
                for (let i = 0; i < 2; i++)
                {   
                    let Osszetevo=document.createElement("li")
                    Osszetevo.innerHTML=valasz.ossztev[kulsoertek][i].Osszetevő
                    koktelOsszetevoLista.appendChild(Osszetevo)
                }
                if (valasz.ossztev[kulsoertek].length==3) //nincs 1 elemű koktél(Ami legális) szoval nem kell azzal szenvedni
                {
                     let VegsoOsszetevo=document.createElement("li")
                     VegsoOsszetevo.innerHTML=valasz.ossztev[kulsoertek][2].Osszetevő
                     koktelOsszetevoLista.appendChild(VegsoOsszetevo)
                }
                else if (valasz.ossztev[kulsoertek].length>3) //nincs 1 elemű koktél(Ami legális) szoval nem kell azzal szenvedni
                {
                     let VegsoOsszetevo=document.createElement("li")
                     VegsoOsszetevo.innerHTML=`és ${(valasz.ossztev[kulsoertek].length)-2}`
                     koktelOsszetevoLista.appendChild(VegsoOsszetevo)
                }
                //feltöltés
                koktelCard.appendChild(koktelKep)
                koktelTartalom.appendChild(koktelNev)
                koktelTartalom.appendChild(koktelErtekeles)
                koktelSzoveg.appendChild(koktelBadge)
                koktelSzoveg.appendChild(koktelOsszetevok)
                koktelSzoveg.appendChild(koktelOsszetevoLista)
                koktelTartalom.appendChild(koktelSzoveg)
                koktelTartalom.appendChild(koktelOldal)
                koktelCard.appendChild(koktelTartalom)
                koktelDiv.appendChild(koktelCard)
                sor.appendChild(koktelDiv)
            }
            else
            {

            }
            hova.appendChild(sor)
        }
    }
    
}
async function KoktelokLekeres() {
    console.log("Koktél");
    const valasz=await AdatGet("/api/AdatlapLekeres/Koktelok/"+2)
    
}
async function JelentesekLekeres() {
    const valasz=await AdatGet("/api/AdatlapLekeres/Jelentesek/"+2)
    console.log("Jelentés");
    
}
async function KosarLekeres() {
    const valasz=await AdatGet("/api/AdatlapLekeres/Kosar/"+2)
    console.log("Kosár");
    
}

function betoltes(oldal){
    let oldalak=[AdatlapLekeres,KedvencekLekeres,KoktelokLekeres,JelentesekLekeres,KosarLekeres]
    oldalak[oldal]()
    
}
function undo(){
    try {
        alert("Sikeres Törlés")
    } 
    catch (error) {
        
    }
}