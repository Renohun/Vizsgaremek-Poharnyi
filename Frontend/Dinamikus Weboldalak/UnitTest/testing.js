const AdatLekeres = async (url) => {
    const valasz = await fetch(url);
    if (valasz.ok) {
        return valasz.json();
    }
};
const TestPostFetch = async (url, object) => {
    const valasz = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(object)
    });
    if (valasz.ok) {
        return valasz.json();
    }
}
const TestPatchFetch=async(url,object)=>{
    const valasz=await fetch(url,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(object)
    })
    if (valasz.ok) {
        return valasz.json()
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    document.getElementById('termekTesztBtn').addEventListener('click', async () => {
        const eredemny = await AdatLekeres('/test/termekFeltoltesTest');
        document.getElementById('termekFeltoltesEredmeny').innerText = eredemny.eredemny;
        document.getElementById('termekSzazalekEredmeny').innerText = eredemny.szazalek;
    });

    document.getElementById('termekLearazasBtn').addEventListener('click', async () => {
        const eredemny = await AdatLekeres('/test/TermekLearazas');
        //console.log(eredemny);

        document.getElementById('termekLearazasSpan').innerText = eredemny.eredemny;
        document.getElementById('termekLearazasSzazalekSpan').innerText = eredemny.szazalek;
    });
})

