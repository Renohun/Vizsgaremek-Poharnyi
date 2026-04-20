async function POSTfetch(url, obj) {
    try {
        const data = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        });

        if (data.ok) {
            return await data.json();
        } else {
            throw new Error('Hiba tortent a POST fetchnel');
        }
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('kuldesBTN').addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const response = await POSTfetch('/api/felhasznaloEllenorzes', { email: email });
        if (response.ures == true) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText =
                'Nem adott meg egy olyan email címet, amely megfelel a kritériumoknak!';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
        if (response.nincs == true) {
            var modalElement = new bootstrap.Modal(document.getElementById('infoModal'), {});
            modalElement.show();

            document.getElementById('modalText').innerText =
                'Nem táltunk ilyen email címmel rendelkező felhasználót! Lehet hogy elronttta az email címet?';

            document.getElementById('modalBtn').addEventListener('click', () => {
                modalElement.hide();
            });
        }
        if (response.redirect != null || undefined) {
            window.location.href = response.redirect + '/' + response.kod;
        }
    });
});
