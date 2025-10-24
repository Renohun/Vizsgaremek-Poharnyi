document.addEventListener('DOMContentLoaded', () => {
    const belepesGomb = document.getElementById('Login');
    const regisztraciosGomb = document.getElementById('Register');

    belepesGomb.addEventListener('click', () => {
        window.location.href = '../belepes/index.html';
    });
    regisztraciosGomb.addEventListener('click', () => {
        window.location.href = '../Regisztráció/Regisztracio.html';
    });
});
