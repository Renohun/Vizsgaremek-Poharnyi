//LEKERESEK
async function GETfetch(url) {
    try {
        const data = await fetch(url);

        if (data.ok) {
            return await data.json();
        } else {
            throw new err('Hiba tortent a fetch-el');
        }
    } catch (err) {
        throw new Error(err);
    }
}

const termek_lekeres = async () => {
    let url = window.location.href.split('/');
    let id = url[4];
    console.log(id);
    const data = await GETfetch(`http://127.0.0.1:3000/api/termek/lekeres/${id}`);
    console.log(data);
};

document.addEventListener('DOMContentLoaded', async () => {
    termek_lekeres();
    var coll = document.getElementsByClassName('TovGomb');
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function () {
            this.classList.add('active');
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    }
});
