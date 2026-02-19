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
async function DELETEfetch(url) {
    try {
        const data = await fetch(url, {
            method: 'DELETE'
        });
        if (data.ok) {
            return data.json();
        } else {
            throw new Error('hiba van a DELETE0 fetch-ben');
        }
    } catch (err) {
        throw new Error(err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const termekek = await GETfetch('http://127.0.0.1:3000/api/AdminPanel/TermekLekeres');
    const selectTag = document.getElementById('termekTorles');
    for (let index = 0; index < termekek.result.length; index++) {
        const optTag = document.createElement('option');
        optTag.innerText = termekek.result[index].TermekCim;
        optTag.setAttribute('value', termekek.result[index].TermekID);
        selectTag.appendChild(optTag);
    }

    document.getElementById('termekTorlesGomb').addEventListener('click', async () => {
        const id = document.getElementById('termekTorles').value;
        console.log(id);

        const data = await DELETEfetch(`http://127.0.0.1:3000/api/AdminPanel/TermekTorles/${id}`);
        console.log(data);
    });
});
