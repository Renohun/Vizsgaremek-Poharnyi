document.addEventListener('DOMContentLoaded', () => {
    const fiokKezesles = document.getElementsByName('fiokKezeles');
    const koktelKezeles = document.getElementsByName('koktelKezeles');
    const kommentKezeles = document.getElementsByName('kommentKezeles');

    document.getElementById('fiokTextInput').focus();

    console.log(koktelKezeles[1]);
    console.log(kommentKezeles[1]);

    fiokKezesles[0].addEventListener('click', () => {
        fiokKezesles[1].classList.remove('d-none');
        koktelKezeles[1].classList.add('d-none');
        kommentKezeles[1].classList.add('d-none');
        document.getElementById('fiokTextInput').focus();
    });
    koktelKezeles[0].addEventListener('click', () => {
        fiokKezesles[1].classList.add('d-none');
        koktelKezeles[1].classList.remove('d-none');
        kommentKezeles[1].classList.add('d-none');
        document.getElementById('koktelTextInput').focus();
    });
    kommentKezeles[0].addEventListener('click', () => {
        fiokKezesles[1].classList.add('d-none');
        koktelKezeles[1].classList.add('d-none');
        kommentKezeles[1].classList.remove('d-none');
        document.getElementById('kommentTextInput').focus();
    });
});
