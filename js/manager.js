let c = document.getElementById("canvas");
let format = document.getElementById('format');
let res = document.getElementById('resolution');
let f = document.getElementById('font');
let resolution = 16;
let offset = 0;
let ctx = c.getContext("2d");
let line = 0;
let fontname = '';
let indent = 0;

let layers = [];

let errorReg = /at position (\d+)/;
let html = true;

/*
let singleComment = /(\/\/)([^\n"]*?)((\n)|$)(?![^\s\n"]*["]+)/g;
let multiComment = /(?<![^\n"]+["])(\/\*)([^]*?)(\*\/)(?![^"\n]+["])/g;
let nonDec = /([\s\t[:,]*)0([box])([\dabcdef]+)[\s\t]*([,\]}]+|$)/gi;
let unquotedKey = /([\s\t{[,]+)([^"\s\t{[,]*)(\s*):/g;
*/
let javaNumber = /([\s\t[:,]*)([\d.]+)[bdfsl][\s\t]*([,\]}]+|$)/gi;


function draw(json) {
    try {
        let obj;
        let fix = document.getElementById('fix').checked;
        if (fix) {
            obj = new JSONParser(json).parseElement();
            let textarea = document.getElementById('text');
            textarea.value = JSON.stringify(obj, null, 2);
        } else {
            obj = JSON.parse(json);
        }

        console.log(obj);
        format.innerHTML = "";

        if (!image.checked) {
            format.style.display = 'flex';
            c.style.display = 'none';
            resolution = 20;
            format.style.fontSize = resolution + 'px';
            parseTypeHTML(format, obj, '', 0);
        } else {
            format.style.display = 'none';
            c.style.display = 'initial';
            resolution = parseInt(res.value);
            line = 0;
            offset = resolution / 8;
            fontname = f.value;

            let dimension = getDimension(obj);

            ctx.font = (resolution - 4) + "px " + fontname;
            let measure = ctx.measureText(dimension[1]);
            console.log(dimension, measure);

            if (dimension[0] * resolution > 0x4000 || measure.width > 0x4000) {
                alert('图片尺寸超过16384像素，您的浏览器可能无法正常显示。');
            }
            c.width = measure.width + offset;
            c.height = resolution * (dimension[0] + 1);
            ctx.fillStyle = theme.backgroundColor;
            ctx.fillRect(0, 0, c.width, c.height);

            ctx.font = (resolution - 4) + "px " + fontname;
            indent = ctx.measureText('00').width;

            dl.style.display = 'block';

            parseType(obj, 0);
        }
    } catch (e) {
        let m = e.toString().match(errorReg);
        if (m != null) {
            let i = parseInt(m[1]);
            if (i < 4) i = 4;
            alert('JSON语法错误:\n' + e + '\n' + json.substr(i - 4, 8) + '\n    ^');
        }
        else alert('JSON语法错误:\n' + e + '\n');
        console.error(e.stack);
    }
}


function fill(count) {
    let out = '';
    for (let i = 0; i < count; i++) {
        out += '00';
    }
    return out;
}

function getType(obj) {
    return Object.prototype.toString.call(obj);
}

function getLength(str) {
    let out = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 0xff)
            out += 2;
        else out++;
    }
    return out;
}

function formatLength(len) {
    if (len == 1) return len + ' entry';
    else return len + ' entries';
}

function isObjectOrArray(obj) {
    let type = getType(obj);
    return (type == '[object Object]' || type == '[object Array]')
}