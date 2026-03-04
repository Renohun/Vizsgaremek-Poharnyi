const TermekLekeres=async(url)=>{
    try {
         const valasz=await fetch(url)
    if (valasz.ok) {
        return valasz.json()
    }
    } catch (error) {
        throw new Error(error)
    }
   
}

document.addEventListener("DOMContentLoaded",()=>{
    const Termekek = async()=>{
        const data = await TermekLekeres("/api/WebShop/TermekLekeres")
        console.log(data)
    }
    Termekek();
    //árSlider update: 
    var slider1 = document.getElementById("myRange");
    var output1 = document.getElementById("maxAr");
    var slider2 = document.getElementById("AlkRange");
    var output2 = document.getElementById("maxAlk");
    output1.innerHTML = slider1.value; // Display the default slider value
    output2.innerHTML = slider2.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider1.oninput = function() {
    output1.innerHTML = this.value;
    }
     slider2.oninput = function() {
    output2.innerHTML = this.value;
    }
    })