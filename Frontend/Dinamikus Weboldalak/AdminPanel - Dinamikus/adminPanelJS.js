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
    const jelentesekDocument = document.getElementsByName('jelentesekKezelese');
    const koktelDocument = document.getElementsByName('koktelokKezelese');

    jelentesekDocument[0].addEventListener('click', () => {
        jelentesekDocument[1].removeAttribute('hidden', 'hidden');
        koktelDocument[1].setAttribute('hidden', 'hidden');
        /*(async () => {
            try {
                const rows = await POSTfetch('http://127.0.0.1:3000/api/AdminPanel/jelentesek');
                console.log(rows);

                const jelentesSor = document.getElementById('jelentesekSora');

                for (let i = 0; i < rows.koktelok.length; i++) {
                    let ujOszlop = document.createElement('div');
                    ujOszlop.classList.add('col-3');
                    jelentesSor.appendChild(ujOszlop);

                    let elutasitasGomb = document.createElement('input');
                    elutasitasGomb.setAttribute('type', 'button');
                    elutasitasGomb.classList.add('btn');
                    elutasitasGomb.classList.add('btn-danger');
                    elutasitasGomb.innerText = 'Elutasitas';
                    ujOszlop.appendChild(elutasitasGomb);

                    let elfogadasGomb = document.createElement('input');
                    elfogadasGomb.setAttribute('type', 'button');
                    elfogadasGomb.classList.add('btn');
                    elfogadasGomb.classList.add('btn-success');
                    elfogadasGomb.innerText = 'Elfogadas';
                    ujOszlop.appendChild(elfogadasGomb);
                }
            } catch (err) {
                console.error(err);
            }
        })();*/
    });
    koktelDocument[0].addEventListener('click', () => {
        jelentesekDocument[1].setAttribute('hidden', 'hidden');
        koktelDocument[1].removeAttribute('hidden', 'hidden');
    });
});
