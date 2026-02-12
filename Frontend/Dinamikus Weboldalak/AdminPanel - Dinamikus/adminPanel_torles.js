async function GETfetch(url) {
    try{
        const data = await fetch(url)
        if(data.ok){
            return data.json()
        }
        else{throw new Error("hiba van a GET fetch-ben")}
    }
    catch(err){ throw new Error(err)}
}
async function POSTfetch(url,obj) {
    try{
        const data = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        })
        if(data.ok){
            return data.json()
        }
        else{throw new Error("hiba van a GET fetch-ben")}
    }
    catch(err){ throw new Error(err)}
}
document.addEventListener("DOMContentLoaded", () => 
    {
        (async() => {
            const data = await GETfetch("http://127.0.0.1:3000/api/koktelNevek")
            const selectElement = document.getElementById("koktelSelect")

            data.lekertAdat.forEach(nev => {
                const optElement = document.createElement("option")
                //console.log(nev.KoktelCim);
                optElement.innerText = nev.KoktelCim
                selectElement.appendChild(optElement)
            });
            
        })()

        document.getElementById("torlesGomb").addEventListener("click", async()=> 
            {
                const valasztottErtek = document.getElementById("koktelSelect").value
                const data = await POSTfetch(`http://127.0.0.1:3000/api/koktelTorles/${valasztottErtek}`)
                console.log(data);
                
            })
    })