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
        if (
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) &&
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{2,}$/.test(jelszo)
        ) {
            const res = await POSTfetch('http://127.0.0.1:3000/api/belepes', { felhasznalo: email, jelszo: jelszo });
            //modal alert
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = res.message;

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        } else {
            //Ide jonne majd a modal-os alert
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = res.message;

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
    });
});
