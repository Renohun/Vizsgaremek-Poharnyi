document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcherBtn = document.getElementById('ThemeSwitcher');

    //Ugyanaz a logikai maradt

    //Ez a resz azert felel hogy a weboldal betoltese utan megnezze hogy van e valami elmentve a localstorageba
    //LocalStorage ugy mukodik mint egy objektum, van egy property-e es egy value-ja
    //.getItem - lehet rakeresni az adott Item property alapjan
    //.setItem - ezzel allitjuk be a property erteket
    //.removeItem - adja magat
    const savedTheme = localStorage.getItem('Theme');
    if (savedTheme != null) {
        const linkTags = document.getElementsByTagName('link');
        for (let i = 0; i < linkTags.length; i++) {
            //Igy szebben is lehet megcsinalni
            //Ez csak a utolso fontos dolgokat adja vissza, azzal megoldassal ellentetben mint ahogyan csinaltam korabban
            const href = linkTags[i].getAttribute('href');
            if (href.includes('lightTheme.css') && savedTheme === 'DarkTheme') {
                linkTags[i].setAttribute('href', href.replace('lightTheme.css', 'darkTheme.css'));
            } else if (href.includes('darkTheme.css') && savedTheme === 'LightTheme') {
                linkTags[i].setAttribute('href', href.replace('darkTheme.css', 'lightTheme.css'));
            }
        }
    }

    themeSwitcherBtn.addEventListener('click', () => {
        const currentTheme = document.getElementsByTagName('link');
        hrefArr = [];
        for (let i = 0; i < currentTheme.length; i++) {
            const lastItem = currentTheme[i].href.split('/');
            hrefArr.push(lastItem[lastItem.length - 1]);
        }
        let poz = 0;
        // false == light - true == dark
        let theme = false;
        for (let i = 0; i < hrefArr.length; i++) {
            if (hrefArr[i] == 'lightTheme.css') {
                poz = i;
                theme = false;
            } else if (hrefArr[i] == 'darkTheme.css') {
                poz = i;
                theme = true;
            }
        }

        let hrefString = currentTheme[poz].href;
        let folderPath = hrefString.substring(0, hrefString.lastIndexOf('/') + 1);
        if (theme == false) {
            folderPath += 'darkTheme.css';
            currentTheme[poz].setAttribute('href', folderPath);
            //Itt mentem el a azt hogy mire valtottam a temat, igy majd ha script megleszhivva ujra, akkor mar lesz mentve a localstorage-ba igy mi majd meglesz nezve hogy mi van elmentve
            localStorage.setItem('Theme', 'DarkTheme');
        } else {
            folderPath += 'lightTheme.css';
            currentTheme[poz].setAttribute('href', folderPath);

            // detto
            localStorage.setItem('Theme', 'LightTheme');
        }
    });
});
