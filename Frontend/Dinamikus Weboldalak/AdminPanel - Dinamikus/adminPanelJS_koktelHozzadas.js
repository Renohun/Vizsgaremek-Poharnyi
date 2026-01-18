async function POSTfetch(url, obj) {
    try {
        const req = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        });
        if (req.ok) {
            return await req.json();
        } else {
            throw new Error('Hiba tortent: ' + req.status);
        }
    } catch (err) {
        throw new Error('Hiba tortent: ' + err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //jelvenyek feltoltese a selectekbe

    (async () => {
        const data = await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/JelvenyekLetoltese');
    })();

    document.getElementById('koktelFeltoltes').addEventListener('click', () => {
        let hibasFrom = false;

        const koktelNev = document.getElementById('koktelNeve');
        if (koktelNev.value.length > 0) {
            koktelNev.classList.add('helyesForm');
            koktelNev.classList.remove('hibasForm');
        } else {
            koktelNev.classList.remove('helyesForm');
            koktelNev.classList.add('hibasForm');
            hibasFrom = true;
        }

        const koktelAlap = document.getElementById('koktelAlapja');
        if (koktelAlap.value.length > 0) {
            koktelAlap.classList.add('helyesForm');
            koktelAlap.classList.remove('hibasForm');
        } else {
            koktelAlap.classList.remove('helyesForm');
            koktelAlap.classList.add('hibasForm');
            hibasFrom = true;
        }
        /*
        const koktelErosseg = document.getElementById('koktelErosseg');
        if (koktelErosseg.value.length > 0) {
            koktelErosseg.classList.add('helyesForm');
            koktelErosseg.classList.remove('hibasForm');
        } else {
            koktelErosseg.classList.remove('helyesForm');
            koktelErosseg.classList.add('hibasForm');
            hibasFrom = true;
        }
        //chat? who is this guy?
        const koktelIz = document.getElementById('koktelIze');
        if (koktelIz.value.length > 0) {
            koktelIz.classList.add('helyesForm');
            koktelIz.classList.remove('hibasForm');
        } else {
            koktelIz.classList.remove('helyesForm');
            koktelIz.classList.add('hibasForm');
            hibasFrom = true;
        }

        const koktelAllergenek = document.getElementById('koktelAllergenek');
        if (koktelAllergenek.value.length > 0) {
            koktelAllergenek.classList.add('helyesForm');
            koktelAllergenek.classList.remove('hibasForm');
        } else {
            koktelAllergenek.classList.remove('helyesForm');
            koktelAllergenek.classList.add('hibasForm');
            hibasFrom = true;
        }*/

        const koktelRecept = document.getElementById('koktelRecept');
        if (koktelRecept.value.length > 0) {
            koktelRecept.classList.add('helyesForm');
            koktelRecept.classList.remove('hibasForm');
        } else {
            koktelRecept.classList.remove('helyesForm');
            koktelRecept.classList.add('hibasForm');
            hibasFrom = true;
        }

        if (!hibasFrom) {
            (async () => {
                const POSTobj = {
                    nev: koktelNev.value,
                    alap: koktelAlap.value,
                    recept: koktelRecept.value
                };

                const data = await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/KoktelFeltoltes', POSTobj);
            })();
        }
    });
});
