async function POSTfetch(url, obj) {
    try {
        const data = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        });

        if (!data.ok) {
            throw new Error('Hiba tortent: ' + data.status);
        } else {
            return await data.json();
        }
    } catch (err) {
        throw new Error('Hiba tortent a fetch-nel: ' + err);
    }
}

async function POSTKuldes(Obj) {
    try {
        const data = await POSTfetch('http://127.0.0.1:3000/api/regisztracio', Obj);
        console.log(data);
    } catch (error) {
        console.error('Hiba tortent: ' + error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let felhasznaloTomb = [];
    let vanHiba;

    document.getElementById('RegisztracioGomb').addEventListener('click', () => {
        for (let i = 0; i < document.getElementsByClassName('form-control').length; i++) {
            const jelenlegiElement = document.getElementsByClassName('form-control')[i].value;

            if (i === 0) {
                jelenlegiElement != '' && /^\S+@\S+\.\S+$/.test(jelenlegiElement)
                    ? felhasznaloTomb.push(jelenlegiElement)
                    : felhasznaloTomb.push('');
            } else if (i === 2 || i === 3) {
                //REGEX: ^: Kezdes \S+ minden mehet kiveve whitespace $: vege
                //Mindezt korbe kell venni / /
                jelenlegiElement != '' && /^\S+$/.test(jelenlegiElement)
                    ? felhasznaloTomb.push(jelenlegiElement)
                    : felhasznaloTomb.push('');
            } else {
                jelenlegiElement != '' ? felhasznaloTomb.push(jelenlegiElement) : felhasznaloTomb.push('');
            }
        }

        if (felhasznaloTomb.includes('') || felhasznaloTomb[2] !== felhasznaloTomb[3]) {
            vanHiba = true;
        } else {
            vanHiba = false;
        }

        if (vanHiba) {
            alert('Kitoltes soran volt egy vagy tobb hiba!');
        } else {
            const POSTobj = {
                email: felhasznaloTomb[0],
                felhasznaloNev: felhasznaloTomb[1],
                jelszo: felhasznaloTomb[2]
            };
            POSTKuldes(POSTobj);
        }
    });
});
