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

    let vanHiba;

    document.getElementById('RegisztracioGomb').addEventListener('click', () => {
        const inputElementek = document.getElementsByClassName('form-control');

        const emailElement = inputElementek[0].value;
        const felhasznaloNevElement = inputElementek[1].value;
        const jelszoElement = inputElementek[2].value;
        const jelszoElementMegint = inputElementek[3].value;

        if (!/^\S+@\S+\.\S+$/.test(emailElement)) {
            vanHiba = true;
        }
        if (!/^\S+$/.test(felhasznaloNevElement)) {
            vanHiba = true;
        }
        if (!/^\S+$/.test(jelszoElement) || jelszoElement !== jelszoElementMegint) {
            vanHiba = true;
        }

        if (vanHiba) {
            alert('Kitoltes soran volt egy vagy tobb hiba!');
        } else {
            const POSTobj = {
                email: emailElement,
                felhasznaloNev: felhasznaloNevElement,
                jelszo: jelszoElement
            };
            POSTKuldes(POSTobj);
            alert('Sikeres regisztralcio');
            window.location.href = '/LepjBe';
        }
    });
});
