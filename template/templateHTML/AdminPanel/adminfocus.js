document.addEventListener('DOMContentLoaded', () => {
    const fiok = document.getElementsByTagName('h4')[0];
    const koktel = document.getElementsByTagName('h4')[1];

    fiok.addEventListener('click', () => {
        const felhasznaloInputField = document.getElementById('felhasznoKereses');
        felhasznaloInputField.focus();
    });
    koktel.addEventListener('click', () => {
        const koktelInputField = document.getElementById('koktelKereses');
        koktelInputField.focus();
    });
});
