const adatLekeres = async (url) => {
    const valasz = await fetch(url);
    if (valasz.ok) {
        return valasz.json();
    }
};
const testPostFetch = async (url, object) => {
    const valasz = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(object)
    });
    if (valasz.ok) {
        return valasz.json();
    }
}
const TestpatchFetch=async(url,object)=>{
    const valasz=await fetch(url,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(object)
    })
    if (valasz.ok) {
        return valasz.json()
    }
}
document.addEventListener("DOMContentLoaded",async()=>{
//Termék kosárba tétele
    document.getElementById("kosartest").addEventListener("click",async()=>{
        let id = document.getElementById("termekId").value
        let menny = document.getElementById("mennyiseg").value
        let postobj = {
            id: id,
            mennyiseg: menny
        };
        const eredmeny = await testPostFetch('/test/TermekKosarTest', postobj);

        document.getElementById('siker').innerHTML = eredmeny.siker;
        document.getElementById('mennyErr').innerHTML = eredmeny.mennyiseghiba;
        document.getElementById('UjSor').innerHTML = eredmeny.hozzaadott;
        document.getElementById('bovitett').innerHTML = eredmeny.bovitett;
        document.getElementById('fel').innerHTML = eredmeny.felkerulte;
        document.getElementById('IdErr').innerHTML = eredmeny.idHiba;
        let ok = document.getElementsByTagName('span');
        for (let i = 0; i < ok.length; i++) {
            if (ok[i].innerHTML == 'true') {
                ok[i].classList.add('text-success');
            } else {
                ok[i].classList.add('text-danger');
            }
        }
    })
    //Termék név szerinti szűrése
     document.getElementById('termekNevTesztBtn').addEventListener('click', async () => {
        let nev = document.getElementById("TermekNev").value
        let postobj = {
            nev: nev
        };
        const eredmeny = await testPostFetch('/test/TermekNevTeszt', postobj);
        document.getElementById('NevSiker').innerHTML = eredmeny.siker;
        document.getElementById('TermekekHelyesekE').innerHTML = eredmeny.JoNevek;
        document.getElementById('NevHiba').innerHTML = eredmeny.NevHiba;
        document.getElementById('NincsTermek').innerHTML = eredmeny.NincsIlyenTermek;
        let ok = document.getElementsByTagName('span');
        for (let i = 0; i < ok.length; i++) {
            if (ok[i].innerHTML == 'true') {
                ok[i].classList.add('text-success');
            } else {
                ok[i].classList.add('text-danger');
            }
        }
    });
    // Adatlap kosár szerkesztés
    let KTermekSel = document.getElementById("TermekSel")
    let Mennyiseg = document.getElementById("KMennyiseg")
    const KTermekek = await adatLekeres("/test/kosartermekek")
    console.log(KTermekek.termekek[0])
    for (let i = 0; i < KTermekek.termekek.length; i++) 
    {
        let opt = document.createElement("option")
        opt.innerHTML = KTermekek.termekek[i].TermekCim
        opt.value = i  
        KTermekSel.appendChild(opt)
    }
    KTermekSel.addEventListener("change",()=>{
        Mennyiseg.value = KTermekek.termekek[KTermekSel.value].Darabszam
    })
     document.getElementById("KosarModositTesztBtn").addEventListener("click",async()=>{
       
        if (KTermekSel.value == "ures")
        {
            alert("A KosárUpdatenél válaszd ki a terméket")
        }
        else
        {
            let menny = document.getElementById("KMennyiseg").value
            let postobj = {
                id:KTermekek.termekek[KTermekSel.value].TermekID ,
                mennyiseg:menny
            }
            const eredmeny = await TestpatchFetch("/test/TermekFrissitesTeszt",postobj)
        
            document.getElementById('modositSiker').innerHTML = eredmeny.siker;
            document.getElementById('HelyesSzam').innerHTML = eredmeny.JoSzam;
            document.getElementById('NegSzam').innerHTML = eredmeny.negativszam;
            let ok = document.getElementsByTagName('span');
            for (let i = 0; i < ok.length; i++) {
                if (ok[i].innerHTML == 'true') {
                    ok[i].classList.add('text-success');
                } else {
                    ok[i].classList.add('text-danger');
                }
            }
        }
    })
})
