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




const WebShopTovabb = async()=>{
    window.location.href = "/webshop"
}
const koktelTovabb = async()=>{
    window.location.href = "/Koktelok"
}
//népszerű koktél
const NepszeruKoktelok = async()=>{
    const data = await GetFetch("http://127.0.0.1:3000/api/Fooldal/NepszeruKoktelok")
    console.log(data)
}

document.addEventListener("DOMContentLoaded",async()=>{
    //Továbbítások
    let webshopGomb = document.getElementById("WebshopGomb")
    webshopGomb.addEventListener("click",WebShopTovabb)

    let KoktelGomb = document.getElementById("KoktelGomb")
    KoktelGomb.addEventListener("click",koktelTovabb)

    NepszeruKoktelok()
})