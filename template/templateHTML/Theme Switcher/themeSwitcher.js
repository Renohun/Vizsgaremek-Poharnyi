document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcherBtn = document.getElementById('ThemeSwitcher');

    themeSwitcherBtn.addEventListener('click', () => {
        const currentTheme = document.getElementsByTagName('link');
        hrefArr = [];
        for (let i = 0; i < currentTheme.length; i++) {
            const lastItem = currentTheme[i].href.split('/');
            console.log(lastItem[lastItem.length - 1]);
            hrefArr.push(lastItem[lastItem.length - 1]);
        }
        let poz = 0;
        // false == light - true == dark
        let theme = false;
        for (let i = 0; i < hrefArr.length; i++) {
            if (hrefArr[i] == 'lightTheme.css') {
                console.log('belep');
                poz = i;
                theme = false;
            } else if (hrefArr[i] == 'darkTheme.css') {
                console.log('belep');
                poz = i;
                theme = true;
            }
        }

        let hrefString = currentTheme[poz].href;
        console.log(theme);
        let folderPath = hrefString.substring(0, hrefString.lastIndexOf('/') + 1);
        console.log(folderPath);
        if (theme == false) {
            folderPath += 'darkTheme.css';
            console.log(folderPath);
            currentTheme[poz].setAttribute('href', folderPath);
        } else {
            folderPath += 'lightTheme.css';
            console.log(folderPath);
            currentTheme[poz].setAttribute('href', folderPath);
        }
    });
});
