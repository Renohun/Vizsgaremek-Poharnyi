async function GETfetch(url) {
    try {
        const data = await fetch(url);
        if (data.ok) {
            return data.json();
        } else {
            throw new Error('hiba van a GET fetch-ben');
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function DELETEfetch(url, obj) {
    try {
        const data = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        });
        if (data.ok) {
            return data.json();
        } else {
            throw new Error('hiba van a GET fetch-ben');
        }
    } catch (err) {
        throw new Error(err);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        const data = await GETfetch('/api/koktelNevek');
        const selectElement = document.getElementById('koktelSelect');

        data.lekertAdat.forEach((nev) => {
            const optElement = document.createElement('option');
            //console.log(nev.KoktelCim);
            optElement.innerText = nev.KoktelCim;
            optElement.setAttribute('value', nev.KoktélID);
            selectElement.appendChild(optElement);
        });
    })();

    document.getElementById('torlesGomb').addEventListener('click', async () => {
        const valasztottErtek = document.getElementById('koktelSelect').value;
        if (valasztottErtek != '0') {
            await DELETEfetch(`/api/Koktel/DeleteKoktel`, {
                id: valasztottErtek
            });
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'Koktél sikeresen törölve';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
                window.location.reload();
            });
        } else {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'Először válasszon ki egy koktélt!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
    });
});
