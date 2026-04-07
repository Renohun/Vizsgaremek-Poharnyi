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
    await GETfetch('http://127.0.0.1:3000/api/emailKuldes');

    document.getElementById('kodKuldesBtn').addEventListener('click', async () => {
        const response = await POSTfetch('http://127.0.0.1:3000/api/kodEllenorzes', {
            kod: document.getElementById('kodInput').value
        });
    });
});
