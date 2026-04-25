const AdatLekeres = async (url) => {
    const valasz = await fetch(url);
    if (valasz.ok) {
        return valasz.json();
    }
};
const TestPostFetch=async(url,object)=>{
    const valasz=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(object)
    })
    if (valasz.ok) {
        return valasz.json()
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('ktest').addEventListener('click', async () => {
        console.log(await AdatLekeres('/test/koktelTest'));
        let valasz = await AdatLekeres('/test/koktelTest');
        document.getElementById('make').innerHTML = valasz.koktel;
        document.getElementById('ert').innerHTML = valasz.ert;
        document.getElementById('komm').innerHTML = valasz.komm;
        document.getElementById('kommert').innerHTML = valasz.kommert;
        document.getElementById('kedvenc').innerHTML = valasz.kedv;

        let ok = document.getElementsByTagName('span');
        for (let i = 0; i < ok.length; i++) {
            if (ok[i].innerHTML == 'true') {
                ok[i].classList.add('text-success');
            } else {
                ok[i].classList.add('text-danger');
            }
        }
    });

    document.getElementById('termekTesztBtn').addEventListener('click', async () => {
        const eredemny = await AdatLekeres('/test/termekFeltoltesTest');
        document.getElementById('termekFeltoltesEredmeny').innerText = eredemny.eredemny;
        document.getElementById('termekSzazalekEredmeny').innerText = eredemny.szazalek;
    });

    document.getElementById("kosartest").addEventListener("click",async()=>{
        let id = document.getElementById("termekId").value
        let menny = document.getElementById("mennyiseg").value
        let postobj = {
            id: id,
            mennyiseg:menny
        }
        const eredmeny = await TestPostFetch("/test/TermekKosarTest",postobj)
       
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
     document.getElementById('termekNevTesztBtn').addEventListener('click', async () => {
        let nev = document.getElementById("TermekNev").value
        let postobj = {
            nev: nev
        }
        const eredmeny = await TestPostFetch("/test/TermekNevTeszt",postobj)
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
});
