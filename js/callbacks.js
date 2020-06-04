dlCallback = () => {
    try {
        let blob = dataURItoBlob(c.toDataURL());
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', parseInt(new Date().getTime() / 1000) + '.png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error(e.stack);
        alert('请使用右键另存为。');
    }
};

checkCallback = () => {
    if (image.checked) {
        changeStyle('.image-exclusive', 'display', 'flex');
    } else {
        changeStyle('.image-exclusive', 'display', 'none');
    }
};