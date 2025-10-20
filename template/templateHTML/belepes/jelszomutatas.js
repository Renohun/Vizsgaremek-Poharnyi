document.addEventListener('DOMContentLoaded', function () {
    let checkButton = document.getElementById('jelszomutatas');
    const jelszoInput = document.getElementById('jelszo');

    checkButton.addEventListener('change', function () {
        checkButton.checked ? jelszoInput.setAttribute('type', 'text') : jelszoInput.setAttribute('type', 'password');
    });
});
