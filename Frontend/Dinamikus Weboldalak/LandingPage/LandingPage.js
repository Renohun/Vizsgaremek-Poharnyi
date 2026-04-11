const WebShopTovabb = async()=>{
    window.location.href = "/webshop"
}
const koktelTovabb = async()=>{
    window.location.href = "/Koktelok"
}
document.addEventListener("DOMContentLoaded",()=>{
    //Továbbítások
    let webshopGomb = document.getElementById("WebshopGomb")
    webshopGomb.addEventListener("click",WebShopTovabb)

    let KoktelGomb = document.getElementById("KoktelGomb")
    KoktelGomb.addEventListener("click",koktelTovabb)
})