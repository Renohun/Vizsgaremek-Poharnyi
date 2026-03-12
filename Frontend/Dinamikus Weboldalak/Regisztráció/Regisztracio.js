async function POSTfetch(url, obj) {
    try {
        const data = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        });

        if (!data.ok) {
            throw new Error('Hiba tortent: ' + data.status + data.statusText);
        } else {
            return await data.json();
        }
    } catch (err) {
        throw new Error('Hiba tortent a POST fetch-nel: ' + err);
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

    document.getElementById('formTag').addEventListener('submit', async (event) => {
        //A belepesnel vann ehhez a kommenteles
        event.preventDefault();
        const email = document.getElementById('emailInp').value;
        const felhaszanaloNev = document.getElementById('felhasnzaloNev').value;
        const jelszo = document.getElementById('jelszo').value;
        const jelszoIsmet = document.getElementById('jelszoIsmet').value;

        //console.log(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email));
        //console.log(/^[a-zA-Z0-9_]{2,30}$/.test(felhaszanaloNev));
        //console.log(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(jelszo));

        if (jelszoIsmet == jelszo) {
            if (
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) &&
                /^[a-zA-Z0-9_]{2,30}$/.test(felhaszanaloNev) &&
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(jelszo) &&
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(jelszoIsmet) &&
                document.getElementById('ASZFCheck').checked
            ) {
                const uzenet = await POSTfetch('http://127.0.0.1:3000/api/regisztracio', {
                    email: email,
                    felhasznaloNev: felhaszanaloNev,
                    jelszo: jelszo
                });
                alert('sikeres regisztralas');
            } else {
                alert('Valamelyik input nem felelo meg az eloirt kriteriumoknak');
            }
        } else {
            alert('A ket jelszo nem egyezik meg egymassal');
        }
    });
});
