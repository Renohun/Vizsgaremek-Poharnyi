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

document.addEventListener("DOMContentLoaded", () => 
    {
        const jelentesekDocument = document.getElementsByName("jelentesekKezelese")[0]
        const koktelDocument = document.getElementsByName("koktelokKezelese")[0]

        jelentesekDocument.addEventListener("click", () => 
            {
                (async() => 
                    {
                        const rows = await POSTfetch("http://127.0.0.1:3000/api/AdminPanel/jelentesek")
                        console.log(rows)
                    })()
            })
    })