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
async function POSTfetch(url, obj) {
    try {
        const data = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
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
            selectElement.appendChild(optElement);
        });
    })();

    document.getElementById('torlesGomb').addEventListener('click', async () => {
        const valasztottErtek = document.getElementById('koktelSelect').value;
        if (valasztottErtek.length > 0) {
            const data = await POSTfetch(`/api/koktelTorles/${valasztottErtek}`);
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

            document.getElementById('modalText').innerText = 'Eloszor valasszon ki egy koktelt!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
    });
});
