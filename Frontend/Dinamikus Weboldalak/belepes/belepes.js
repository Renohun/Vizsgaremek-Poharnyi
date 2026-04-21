async function POSTfetch(url, obj) {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        });
        if (res.ok || res.redirected) {
            return await res.json();
        } else {
            throw new Error('Hiba tortent: ' + res.status);
        }
    } catch (err) {
        throw new Error('Hiba tortent: ' + err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('formTag').addEventListener('submit', async (event) => {
        //Ez azert kell hogy, ne frissitse ujra az oldalt, meg POST-oljon avagy kb ne csinaljon semmit
        event.preventDefault();
        const email = document.getElementById('email').value;
        const jelszo = document.getElementById('jelszo').value;
        //console.log(email);

        //regex magyarazasa: elso resz: enged mindent szinte, utanna ellenoriz egy @ jelenletet
        //masodik resz: a domain nevet ellenorzi
        //harmadik resz: a . utana reszt, ahol legalabb 2 karakternek kell lennie
        //[ebben hatarozzuk meg a lehetseges karaktereket]{min,max}
        // /^ ez a kezdes
        // /$ ez a zaras
        //test function-nal teszteljuk hogy a regex-nek megfelel az inputunk
        //Hosszusag ellenorzes nem kell hiszen a form nem is engedi tovabb a ha ures az input mezo

        const res = await POSTfetch('/api/belepes', { felhasznalo: email, jelszo: jelszo });
        if (res.kriterium) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'A megadott tartalmak nem felelnek meg a kritériumoknak!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }

        if (res.hiba) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'Hibás bejelentkezési adatok!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }

        if (res.sikeres) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'Sikeres bejelentkezés!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
                function getCookieURL(name) {
                    const cookies = document.cookie.split('; ');
                    const cookie = cookies.find((c) => c.startsWith(name + '='));
                    return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
                }

                window.location.href = getCookieURL('lastURL');
            });
        }
    });
});
