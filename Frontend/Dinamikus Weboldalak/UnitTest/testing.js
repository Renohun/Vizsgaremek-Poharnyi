const AdatLekeres=async(url)=>{
    const valasz=await fetch(url)
    if (valasz.ok) {
        return valasz.json()
    }
}

document.addEventListener("DOMContentLoaded",async()=>{
    document.getElementById("ktest").addEventListener("click",async()=>{
        console.log(await AdatLekeres("/test/koktelTest"));
        let valasz=await AdatLekeres("/test/koktelTest");
        document.getElementById("make").innerHTML=valasz.koktel
        document.getElementById("ert").innerHTML=valasz.ert
        document.getElementById("komm").innerHTML=valasz.komm
        document.getElementById("kommert").innerHTML=valasz.kommert
        document.getElementById("kedvenc").innerHTML=valasz.kedv
        
        let ok=document.getElementsByTagName("span")
        for (let i = 0; i < ok.length; i++) {
            if (ok[i].innerHTML=="true") {
                ok[i].classList.add("text-success")
            }
            else{
                ok[i].classList.add("text-danger")
            }
            
        }
    })
})