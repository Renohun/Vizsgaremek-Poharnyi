//Fetchek

const GetFetch = async(url)=>{
    try {
        const valasz = await fetch(url);
        if (valasz.ok) {
            return valasz.json();
        }
    } catch (error) {
        throw new Error(error);
    }
}

const KepFetch=async(url)=>{
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


const WebShopTovabb = async()=>{
    window.location.href = "/webshop"
}
const koktelTovabb = async()=>{
    window.location.href = "/Koktelok"
}
const KeszitTovabb = async()=>{
        window.location.href = "/Keszites"
}
const polcTovabb = async()=>{
    window.location.href = "/PolcKoktel"
}
//népszerű koktél
const NepszeruKoktelok = async()=>{
    const data = await GetFetch("http://127.0.0.1:3000/api/Fooldal/NepszeruKoktelok")
    console.log(data)
    let hova = document.getElementById("NepszeruKoktelDiv")
    for (let i = 0; i < data.data.length; i++) {
        const kep = await KepFetch(`http://127.0.0.1:3000/api/Fooldal/KepLekeres/${data.data[i].KoktélID}`)
        let kartya = document.createElement("div")
        kartya.classList.add("NepszeruKartya")
        
        kartya.addEventListener("click",()=>{
            window.location.href = `/Koktel/${data.data[i].KoktélID}`
        })

        let kepdiv = document.createElement("div")
        kepdiv.classList.add("NepszeruKepDiv")

        let img = document.createElement("img")
        img.classList.add("nepszeruKep","img-fluid")
        img.src = URL.createObjectURL(kep)
        kepdiv.appendChild(img)
        kartya.appendChild(kepdiv)
        
        let kartyaBody = document.createElement("div")
        kartyaBody.classList.add("KartyaBody")
        
        let cim = document.createElement("h3")
        cim.innerHTML = data.data[i].KoktelCim
        cim.classList.add("nepszeruCim")
        kartyaBody.appendChild(cim)

        kartya.appendChild(kartyaBody)
        hova.appendChild(kartya)
    }
}

document.addEventListener("DOMContentLoaded",async()=>{
    //Továbbítások
    let webshopGomb = document.getElementById("WebshopGomb")
    webshopGomb.addEventListener("click",WebShopTovabb)

    let KoktelGomb = document.getElementById("KoktelGomb")
    KoktelGomb.addEventListener("click",koktelTovabb)

    let KeszitGomb = document.getElementById("KeszitGomb")
    KeszitGomb.addEventListener("click",KeszitTovabb)

    let MivanApolcon = document.getElementById("kattint")
    MivanApolcon.addEventListener("click",polcTovabb)
    NepszeruKoktelok()
})