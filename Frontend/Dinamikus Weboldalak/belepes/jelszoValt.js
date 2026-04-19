async function PATCHfetch(url, body) {
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Hiba tortent a PATCH fetchben');
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('jelszoValt').addEventListener('click', async () => {
        const jelszo1 = document.getElementById('ujJelszo').value;
        const jelszo2 = document.getElementById('ujJelszoUjra').value;
        const response = await PATCHfetch('/api/jelszoValtoztatas', {
            jelszo1: jelszo1,
            jelszo2: jelszo2
        });

        if (response.kriterium == true) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'A jelszó nem felelt meg a kritériumoknak!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
        if (response.egyezes == true) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText = 'A két jelszó nem egyezik!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
        if (response.megvaltoztatva == true) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText =
                'A jelszó sikeresen megváltoztatva! Kérjűk jelentkezzen be!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
                window.location.href = '/LepjBe';
            });
        }
    });
});
