
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

    let formData = {
        name: name.value,
        email : email.value,
        subject: subject.value,
        message: message.value

    }
    
   const data = await AdatPost("/api/UzenetKuldes",formData)
   if(data.siker != undefined)
    {
        alert("siker!")
    name.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";
   }
    
})

})