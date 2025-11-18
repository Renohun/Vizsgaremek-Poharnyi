async function POSTfetch(url, obj) {
    try {
        const data = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/javascript' },
            body: JSON.stringify(obj)
        });

        if (!data.ok) {
            throw new Error('Hiba tortent: ' + data.status);
        } else {
            return await data.json();
        }
    } catch (err) {
        throw new Error('Hiba tortent a fetch-nel: ' + err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let felhasznaloTomb = [];
    let vanHiba;

    document.getElementById('RegisztracioGomb').addEventListener('click', () => {
        for (let i = 0; i < document.getElementsByClassName('form-control').length; i++) {
            const jelenlegiElement = document.getElementsByClassName('form-control')[i].value;

            if (i === 0) {
                jelenlegiElement != '' && /^\S+@\S+\.\S+$/.test(jelenlegiElement)
                    ? felhasznaloTomb.push(jelenlegiElement)
                    : felhasznaloTomb.push('');
            } else if (i === 2 || i === 3) {
                jelenlegiElement != '' && /^\S+$/.test(jelenlegiElement)
                    ? felhasznaloTomb.push(jelenlegiElement)
                    : felhasznaloTomb.push('');
            } else {
                jelenlegiElement != '' ? felhasznaloTomb.push(jelenlegiElement) : felhasznaloTomb.push('');
            }
        }

        if (felhasznaloTomb.includes('')) {
            vanHiba = false;
        } else {
            vanHiba = true;
        }
    });
});
