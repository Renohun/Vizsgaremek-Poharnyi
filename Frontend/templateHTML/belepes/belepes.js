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

async function POSTKuldes(obj) {
    try {
        const data = await POSTfetch('http://127.0.0.1:3000/api/belepes', obj);
        return await data;
    } catch (err) {
        throw new Error('Hiba tortent: ' + err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let helyesInputok = [];

    document.getElementsByClassName('btn-success')[0].addEventListener('click', () => {
        const felhasznaloEmail = document.getElementById('felhasznalo').value;
        const felhasznaloJelszo = document.getElementById('jelszo').value;

        if (felhasznaloEmail != '' || felhasznaloJelszo != '') {
            /^\S+@\S+\.\S+$/.test(felhasznaloEmail) ? helyesInputok.push(felhasznaloEmail) : helyesInputok.push('');
            /^\S+$/.test(felhasznaloJelszo) ? helyesInputok.push(felhasznaloJelszo) : helyesInputok.push('');

            if (!helyesInputok.includes('')) {
                const POSTobj = {
                    email: felhasznaloEmail,
                    jelszo: felhasznaloJelszo
                };
                const hivas = async () => {
                    const data = await POSTKuldes(POSTobj);
                    console.log(data.message);
                };
                hivas();
            } else {
                alert('Valamelyik field nem felel meg a kriterumnak!');
            }
        } else {
            alert('Valamelyik inputod ures! Toltsd ki!');
        }
    });
});
