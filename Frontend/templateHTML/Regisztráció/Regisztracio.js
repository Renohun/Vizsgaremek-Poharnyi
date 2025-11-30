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
    const MutatBox = document.getElementById('jelszoMutatas');
    MutatBox.addEventListener('change', () => {
        const jelszoElementek = document.getElementsByClassName('jelszoElement');

        if (MutatBox.checked) {
            jelszoElementek[0].setAttribute('type', 'text');
            jelszoElementek[1].setAttribute('type', 'text');
        } else {
            jelszoElementek[0].setAttribute('type', 'password');
            jelszoElementek[1].setAttribute('type', 'password');
        }
    });

    let felhasznaloTomb = [];
    let vanHiba;

    document.getElementById('RegisztracioGomb').addEventListener('click', () => {
        const inputElementek = document.getElementsByClassName('form-control');
        let i = 0;

        switch (i) {
            case 0:
                /^\S+@\S+\.\S+\$/.test(inputElementek[i].value)
                    ? felhasznaloTomb.push(inputElementek[i].value)
                    : felhasznaloTomb.push('');
                i++;
                break;
            case 1:
                /^\S+$/.test(inputElementek[i].value)
                    ? felhasznaloTomb.push(inputElementek[i].value)
                    : felhasznaloTomb.push('');
                i++;
                break;
            case 2:
                //jelszo ell
                /^\S+$/.test(inputElementek[i].value) &&
                //egyezik e mindketto
                inputElementek[i].value == inputElementek[i + 1].value &&
                //jelszo megegyszer ell
                /^\S+$/.test(inputElementek[i + 1].value)
                    ? felhasznaloTomb.push(inputElementek[i].value)
                    : felhasznaloTomb.push('');
                i++;
                break;
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
            alert('Sikeres regisztralcio');
            window.location.href = '/LepjBe';
        }
    });
});
