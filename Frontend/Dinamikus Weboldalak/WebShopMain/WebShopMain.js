const TermekLekeres = async (url) => {
    try {
        const valasz = await fetch(url);
        if (valasz.ok) {
            return valasz.json();
        }
    } catch (error) {
        throw new Error(error);
    }
};

//? Sliderek alapértékének beállítása
const Sliderek = async () => {
    var slider1 = document.getElementById('myRange');
    var output1 = document.getElementById('maxAr');
    var slider2 = document.getElementById('AlkRange');
    var output2 = document.getElementById('maxAlk');
    const data = await TermekLekeres('/api/WebShop/TermekLekeres');
    //ertekek kinyerese listaba
    let ar = [];
    let alk = [];
    for (let i = 0; i < data.data.length; i++) {
        ar.push(data.data[i].Ar);
        if (data.data[i].TermekAlkoholSzazalek != 0) {
            alk.push(data.data[i].TermekAlkoholSzazalek);
        }
    }
    console.log(ar);
    console.log(alk);
    //nagyság szerinti rendezés
    ar.sort((a, b) => a - b);
    alk.sort((a, b) => a - b);
    console.log(ar);
    console.log(alk);
    slider1.setAttribute('value', ar[0]);
    output1.value = ar[0];
    slider1.setAttribute('min', ar[0]);
    slider1.setAttribute('max', ar[ar.length - 1]);
    //slider2
    slider2.setAttribute('value', alk[0]);
    output2.value = alk[0];
    slider2.setAttribute('min', alk[0]);
    slider2.setAttribute('max', alk[alk.length - 1]);
    //eventlistener
    output1.addEventListener('change', () => {
        //minimum maximum érték ellenörzése
        if (output1.value < ar[0]) {
            output1.value = ar[0];
            slider1.setAttribute('value',  ar[0]);
        } else if (output1.value > ar[ar.length - 1]) {
            output1.value = ar[ar.length - 1];
            slider1.setAttribute('value', ar[ar.length - 1]);
        } else {
            slider1.setAttribute('value', output1.value);
            console.log(slider1.value);
        }
    });
    output2.addEventListener('change', () => {
        //alkohol %-nál
        if (output2.value < alk[0]) {
            output2.value = alk[0];
            slider2.setAttribute('value', alk[0]);
        } else if (output2.value > alk[alk.length - 1]) {
            output2.value = alk[alk.length - 1];
              slider2.setAttribute('value', alk[0]);
        } else {
            slider2.setAttribute('value', output2.value);
            console.log(slider2.value);
        }
    });
    slider1.oninput = function () {
        output1.value = this.value;
    };
    slider2.oninput = function () {
        output2.value = this.value;
    };
};
const SzarmazasSelectFeltolt = (data,Select1, Select2)=>{
let alapOption1 = document.createElement("option")
alapOption1.setAttribute("value","-")
alapOption1.setAttribute("id","AlapOrszagOption")
alapOption1.innerHTML = "-"
Select1.appendChild(alapOption1)
let alapOption2 = document.createElement("option")
alapOption2.setAttribute("value","-")
alapOption2.setAttribute("id","AlapMarkaOption")
alapOption2.innerHTML = "-"
Select2.appendChild(alapOption2)
for (let i = 0; i < data.data.length; i++) 
{
//orszagSelect
   let option = document.createElement("option")
   option.setAttribute('value',data.data[i].TermekSzarmazas) 
   option.innerHTML = data.data[i].TermekSzarmazas;
   option.setAttribute("id",`szarmazas${i}`)
   Select1.appendChild(option)
//MárkaSelect
   let option2 = document.createElement("option")
   option2.setAttribute('value',data.data[i].TermekMarka) 
   option2.innerHTML = data.data[i].TermekMarka;
   option2.setAttribute("id",`Marka${i}`)
   Select2.appendChild(option2)
}
}

document.addEventListener('DOMContentLoaded', async () => {
    const data = await TermekLekeres('/api/WebShop/TermekLekeres');
    console.log(data);
    Sliderek();
    //Selectek feltöltése
    let OrszagSelect = document.getElementById("OrszagSelect")
    let MarkaSelect = document.getElementById("MarkaSelect")
    SzarmazasSelectFeltolt(data,OrszagSelect,MarkaSelect)
    OrszagSelect.addEventListener("change",()=>{
        console.log(OrszagSelect.value)
    })
});
