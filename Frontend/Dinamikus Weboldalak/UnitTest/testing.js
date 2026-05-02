const AdatLekeres = async (url) => {
    try {
        const valasz = await fetch(url);
        if (valasz.ok) {
            return valasz.json();
        } else {
            throw new Error('Hiba tortent a FETCH ben');
        }
    } catch (error) {
        console.error(error);
        return error;
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
};
const TestPatchFetch = async (url, object) => {
    const valasz = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(object)
    });
    if (valasz.ok) {
        return valasz.json();
    }
};

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

    document.getElementById('felhasznaloTesztBtn').addEventListener('click', async () => {
        const eredemny = await AdatLekeres('/test/regisztracioTest');
        document.getElementById('egyezesEredemeny').innerText = eredemny.megEgyezik;
        document.getElementById('kriteriumEredemeny').innerText = eredemny.kriterium;
        document.getElementById('duplikacioEredmeny').innerText = eredemny.duplikacio;
        document.getElementById('egyebEredmeny').innerText = eredemny.egyebHiba;
        document.getElementById('sikertelensegEredmeny').innerText = eredemny.sikertelen;
        document.getElementById('sikerErdemeny').innerText = eredemny.sikeres;
    });

    document.getElementById('jelentesElfogadasBtn').addEventListener('click', async () => {
        const eredemny = await AdatLekeres('/test/jelentesek/elfogadas');
        document.getElementById('sikertelenErdemenyJelentes').innerText = eredemny.sikertelen;
        document.getElementById('sikerErdemenyJelentes').innerText = eredemny.siker;
        document.getElementById('egyebEredmenyJelentes').innerText = eredemny.egyebHiba;
    });
    document.getElementById('jelentesElutasitassBtn').addEventListener('click', async () => {
        const eredemny = await AdatLekeres('/test/jelentesek/elutasitas');
        document.getElementById('sikertelenErdemenyJelentesElu').innerText = eredemny.sikertelen;
        document.getElementById('sikerErdemenyJelentesElu').innerText = eredemny.siker;
        document.getElementById('egyebEredmenyJelentesElu').innerText = eredemny.egyebHiba;
    });
    document.getElementById('koktelNevKereseTeszt').addEventListener('click', async () => {
        const eredemny = await AdatLekeres('/test/Koktelok/lekeres');
        document.getElementById('sikerKoktelNevEremeny').innerText = eredemny.siker;
        document.getElementById('sikertelenKoktelNevEremeny').innerText = eredemny.sikertelen;
        document.getElementById('voltEtalalatKoktelNevEredmeny').innerText = eredemny.vanEgyezes;
        document.getElementById('egyebHibaKoktelNevEredmeny').innerText = eredemny.egyebHiba;
    });
});
