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
    console.log("Kedvenc");
    const valasz=await AdatGet("/api/AdatlapLekeres/Kedvencek/"+2)
    
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