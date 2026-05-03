
const TestDeleteFetch=async(url,object)=>{
    const valasz=await fetch(url,{
        method:"DELETE",
        headers:{"Content-Type":"application/json"}
    })
    if (valasz.ok) {
        return valasz.json()
    }
}
const AdatPatch=async(url)=>{
    const valasz=await fetch(url,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"}
    })
    if (valasz.ok) {
        return valasz.json()
    }
}



document.addEventListener("DOMContentLoaded",async()=>{
    document.getElementById('ktest').addEventListener('click', async () => {
        let valasz = await AdatLekeres('/test/koktelTest');
        console.log(valasz);
        
        document.getElementById('make').innerHTML = valasz.koktel;
        document.getElementById('jelv').innerHTML = valasz.jelveny;
        document.getElementById('ossz').innerHTML = valasz.ossz;
        document.getElementById('ert').innerHTML = valasz.ert;
        document.getElementById('komm').innerHTML = valasz.komm;
        document.getElementById('kommert').innerHTML = valasz.kommert;
        document.getElementById('kedvenc').innerHTML = valasz.kedv;
        console.log(valasz.insertId);
        
        let torles=await TestDeleteFetch("/test/koktelTorles/"+valasz.insertId)
        document.getElementById('makedel').innerHTML = torles.koktel;
        document.getElementById('jelvdel').innerHTML = torles.jelveny;
        document.getElementById('osszdel').innerHTML = torles.ossz;
        document.getElementById('ertdel').innerHTML = torles.ert;
        document.getElementById('kommdel').innerHTML = torles.komm;
        document.getElementById('kommertdel').innerHTML = torles.kommert;
        document.getElementById('kedvencdel').innerHTML = torles.kedv;

        document.getElementById("mod").innerHTML=valasz.mod
        ellenorzes(document.getElementById("koktel").getElementsByTagName("span"))

    });
    document.getElementById("becsuk").addEventListener("click",()=>{
        if (document.getElementById("koktel").hasAttribute("hidden")) {
            document.getElementById("koktel").removeAttribute("hidden")
        }
        else{
            document.getElementById("koktel").setAttribute("hidden","")
        }
    })
    document.getElementById("felhasznaloTesztBtn").addEventListener("click",async()=>{
        document.getElementById('FelhMod').innerHTML = (await AdatPatch("/test/felhModositas")).eredmeny;
        document.getElementById('FelhStat').innerHTML = (await AdatLekeres("/test/felhStatisztika")).eredmeny;
    })
})

function ellenorzes(div){
    for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains("text-success")) {
            div[i].classList.remove("text-success")
        }
        else if(div[i].classList.contains("text-danger")){
            div[i].classList.remove("text-danger")
        }
        if (div[i].innerHTML == 'true') {
            div[i].classList.add('text-success');
            div[i].innerHTML="Siker!"
        } else {
            div[i].classList.add('text-danger');
            div[i].innerHTML="Sikertelen!"
        }
    }
}