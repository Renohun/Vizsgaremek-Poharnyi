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

        const response = await POSTfetch('/api/regisztracio', {
            email: email,
            felhasznaloNev: felhaszanaloNev,
            jelszo: jelszo,
            jelszoIsmet: jelszoIsmet,
            ASZF: document.getElementById('ASZFCheck').checked
        });
        if (response.megEgyezik) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'A megadott jelszavak nem egyeznek!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }

        if (response.kriterium) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'A meg adott tartalmak nem egyeznek a kritériumoknak!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }

        if (response.duplikacio) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'Ez az email cím / felhasználónév már foglalt!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }

        if (response.sikeres) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'Sikeres regisztráció!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
                window.location.href = '/LepjBe';
            });
        }
    });
});
