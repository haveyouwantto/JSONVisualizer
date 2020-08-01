const _ = selector => {
    let list = document.querySelectorAll(selector);
    return list.length == 1 ? list[0] : list;
}

let copy = _('#copy');

function copyText(value) {
    copy.value = value;
    copy.style.display = 'block';
    copy.select();
    document.execCommand("Copy");
    copy.style.display = 'none';
}