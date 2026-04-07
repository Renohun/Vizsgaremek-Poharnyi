document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('megJelenit').addEventListener('click', () => {
        if (document.getElementById('megJelenit').checked) {
            document.getElementById('ujJelszo').setAttribute('type', 'text');
            document.getElementById('ujJelszoUjra').setAttribute('type', 'text');
        } else {
            document.getElementById('ujJelszo').setAttribute('type', 'password');
            document.getElementById('ujJelszoUjra').setAttribute('type', 'password');
        }
    });
});
