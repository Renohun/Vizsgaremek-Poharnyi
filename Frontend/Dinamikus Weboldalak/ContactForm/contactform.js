/*forrasok
https://www.youtube.com/watch?v=30VeUWxZjS8
https://nodemailer.com/

*/
const AdatPost = async (url, data) => {
    try {
        const ertek = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (ertek.ok) {
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

form.addEventListener("submit",async(e)=>{
    e.preventDefault()
    
    let hiba = document.getElementById("hiba")
    let siker = document.getElementById("siker")


if (!name || !email || !subject || !message) 
{
    siker.setAttribute("hidden",true)
    hiba.style.display = "block"
    hiba.innerHTML = "Kérem ne hagyjon üres mezőt!"
}
else if(name || email || subject ||message)
    {

    let formData = {
        name: name.value,
        email : email.value,
        subject: subject.value,
        message: message.value

    }
    
   const data = await AdatPost("/api/UzenetKuldes",formData)
   console.log(data)
   if(data.siker != undefined)
        {
        hiba.style.display = "none"
        siker.innerHTML = "sikeresen elküldte az üzenetet"
        siker.removeAttribute("hidden","false")
        name.value = "";
        email.value = "";
        subject.value = "";
        message.value = "";
    }
    }
    
    
})

})