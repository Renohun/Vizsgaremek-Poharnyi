document.addEventListener('DOMContentLoaded', () => {
    const belepesGomb = document.getElementById('Login');
    const regisztraciosGomb = document.getElementById('Register');
    const koktelKeszites = document.getElementById('Keszites');
    const profilKep = document.getElementById('Profile');

    belepesGomb.addEventListener('click', () => {
        window.location.href = '../belepes/index.html';
    });
    regisztraciosGomb.addEventListener('click', () => {
        window.location.href = '../Regisztráció/Regisztracio.html';
    });
    koktelKeszites.addEventListener('click', () => {
        window.location.href = '../Új Koktél/NewCocktail.html';
    });
    profilKep.addEventListener('click', () => {
        window.location.href = '../Adatlap/Adatlap.html';
    });
});
