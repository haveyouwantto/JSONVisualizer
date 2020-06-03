let copy = document.getElementById('copy');

function copyText(value) {
    copy.value = value;
    copy.style.display = 'block';
    copy.select();
    document.execCommand("Copy");
    copy.style.display = 'none';
}