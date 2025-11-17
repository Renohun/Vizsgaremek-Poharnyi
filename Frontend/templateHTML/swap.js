const Valtas= async(url,data)=>{
    try {
        const keres = await fetch(url,{
            method:"POST",
            headers:{'Content-type':'application/json'},
            body:JSON.stringify(data)
        })
        if (!(keres).ok) {
            throw new Error("");
            
        }
        else{
            return await keres.json()
        }
        
    } 
    catch (error) {
        throw new Error("Hiba van jani"+error)
    }
}

async function Kommunikacio(hova) {
        const eredmeny={
            uzenet:hova
        }
        try {
            const data= await Valtas("http://127.0.0.1:8000/api/feldolgozas",eredmeny)
            console.log(data);
            
        } 
        catch (error) {
            console.error(error)
        }
    }


document.addEventListener("DOMContentLoaded",()=>{
    let oldalak=[document.getElementById("PohAlc")]
    for (let i = 0; i < oldalak.length; i++) {
        oldalak[i].addEventListener("click",()=>{
            console.log(oldalak[i].id);
            
            Kommunikacio(oldalak[i].id)
        })
        
    }

})