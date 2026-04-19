async function GETfetch(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Hiba tortent a GET fetchben');
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

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

document.addEventListener('DOMContentLoaded', async () => {
    //email-t itt kikuldi
    await GETfetch('/api/emailKuldes');

    document.getElementById('ujEmailKeres').addEventListener('click', async () => {
        await GETfetch('/api/emailKuldes');
        var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
        modalElement.show();

        document.getElementById('modalText').innerText = 'Az új email sikeresen elküldve!';

        document.getElementById('modalBtn').addEventListener('click', () => {
            modalElement.hide();
        });
    });

    document.getElementById('kodKuldesBtn').addEventListener('click', async () => {
        const response = await POSTfetch('/api/kodEllenorzes', {
            kod: document.getElementById('kodInput').value
        });
        console.log(response);

        if (response.ures == true) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'Nem adott meg kódot! Kérjűk adjon meg egy kódot!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
        if (response.hibas == true) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText =
                'Helytelen kódot adott meg! Kérjűk adja meg a helyes kódot vagy kérjen egy új email-t!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
        if (response.helyes == true && (response.redirect != null || undefined)) {
            window.location.href = '/jelszoValtoztatas/' + response.kod;
        }
    });
});
