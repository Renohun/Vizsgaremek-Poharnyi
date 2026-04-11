const id_lekeres = () => {
    let url = window.location.href;
    let id = url.split('/');
    console.log(id);
};

document.addEventListener('DOMContentLoaded', () => {
    id_lekeres();
    var coll = document.getElementsByClassName('TovGomb');
    var i;
    console.log('asd');
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function () {
            this.classList.add('active');
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    }
});
