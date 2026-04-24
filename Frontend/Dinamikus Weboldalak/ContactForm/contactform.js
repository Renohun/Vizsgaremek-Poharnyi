/*forrasok
https://www.youtube.com/watch?v=30VeUWxZjS8
https://nodemailer.com/
https://www.youtube.com/watch?v=MwGFKr6Zdbo

*/
const AdatPost = async (url, data) => {
    try {
        const ertek = await fetch(url, {
            method: 'POST',
            body: data
        });
        if (ertek.ok) 
        {
            return ertek.json();
        } else {
            console.error(ertek.statusText);
        }
    } catch (error) {
        console.error(error);
    }
};

document.addEventListener("DOMContentLoaded",async()=>{
const form = document.getElementById("ContactForm")
    let name = document.getElementById('nev')
    let email = document.getElementById('email')
    let subject = document.getElementById('tema')
    let message = document.getElementById("szoveg")
    let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
   
form.addEventListener("submit",async(e)=>{
    e.preventDefault()
    let hiba = document.getElementById("hiba")
    let siker = document.getElementById("siker")


if (name.value.trim() == "" || email.value.trim() == ""|| subject.value.trim()== "" || message.value.trim()== "") 
{
    siker.setAttribute("hidden",true)
    hiba.style.display = "block"
    hiba.innerHTML = "Kérem ne hagyjon üres mezőt!"
    modal.show()
}
else if(name.value.trim() != "" || email.value.trim() != ""  || subject.value.trim() != ""  ||message.value != "" )
    {

    let formData = new FormData(document.getElementById("ContactForm"))
   
   const data = await AdatPost("/api/UzenetKuldes",formData)
   console.log(data)
   if(data.siker != undefined)
        {
        
        hiba.style.display = "none"
        siker.innerHTML = "sikeresen elküldte az üzenetet"
        siker.removeAttribute("hidden","false")
        modal.show()
        name.value = "";
        email.value = "";
        subject.value = "";
        message.value = "";
    }
    }
    
    
})

})