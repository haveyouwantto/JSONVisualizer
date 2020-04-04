let c = document.getElementById("canvas");
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
            json = json
                //.replace(unquotedKey, '$1"$2":')
                //.replace(nonDec, (a, b, c, d, e) => { try { return b + eval('0' + c + d) + e } catch (e1) { throw new Error('Invaild number "0' + c + d + '"') } })
                .replace(javaNumber, '$1$2$3');
            console.log(json);
            obj = JSON.parse(eval('let e=()=>{return JSON.stringify('+json+')};e();'));
            let textarea = document.getElementById('text');
            textarea.value = JSON.stringify(obj, null, 2);
        } else {
            obj = JSON.parse(json);
        }

        console.log(obj);

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

function getDimension(obj, key, depth = 0) {
    let type = getType(obj);
    let height = 1;
    let longest = '';
    let str = '';
    let maxdepth = depth;
    if (type != '[object Array]' && type != '[object Null]' && type != '[object Object]') {
        if (type == '[object String]')
            str = fill(depth + 2) + '"' + key + '": ' + JSON.stringify(obj);
        else
            str = fill(depth + 2) + '"' + key + '": ' + obj;
    }
    else str = fill(depth + 2) + '"' + key + '": xxx entries';
    if (type == '[object Object]') {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                let ret = getDimension(element, key, depth + 1);
                height += ret[0];
                if (getLength(ret[1]) > getLength(longest)) longest = ret[1];
                if (ret[2] > maxdepth) maxdepth = ret[2];
            }
        }
    } else if (type == '[object Array]') {
        for (let i = 0; i < obj.length; i++) {
            const element = obj[i];
            let ret = getDimension(element, i, depth + 1);
            height += ret[0];
            if (getLength(ret[1]) > getLength(longest)) longest = ret[1];
            if (ret[2] > maxdepth) maxdepth = ret[2];
        }
    }
    if (getLength(str) > getLength(longest)) longest = str;
    if (depth > maxdepth) maxdepth = depth;
    return [height, longest, maxdepth];
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
c
function parseType(obj, depth, key = '', lastItem = false) {
    let type = getType(obj);
    line++;

    if (getType(key) == '[object String]' & key != '') key = '"' + key + '"';
    layers[depth - 1] = lastItem ? 3 : 2;
    drawBranch(line, depth, lastItem);
    layers[depth - 1] = lastItem ? 0 : 1;

    ctx.font = (resolution - 4) + "px " + fontname;
    ctx.fillStyle = theme.textColor;
    let imageX = (depth + 0.5) * indent - offset;
    let imageY = (line - 1) * resolution + offset * 2;
    let imageOffset = theme.resizeIcon ? resolution - offset : resolution;
    let textX = (depth + 1.5) * indent + offset;
    let valueX = textX + ctx.measureText(key).width;
    let valueXColon = textX + ctx.measureText(key + ': ').width;
    let textY = line * resolution;
    if (type == '[object Object]') {
        ctx.drawImage(typeicons.object, imageX, imageY, imageOffset, imageOffset);
        ctx.fillStyle = theme.keyColor;
        ctx.fillText(key, textX, textY);
        ctx.fillStyle = theme.colonColor;
        ctx.fillText(': ', valueX, textY);
        ctx.fillStyle = theme.textColor;
        ctx.fillText(formatLength(Object.keys(obj).length), valueXColon, textY);
        drawObject(obj, depth + 1);

    } else if (type == '[object Array]') {
        ctx.drawImage(typeicons.array, imageX, imageY, imageOffset, imageOffset);
        ctx.fillStyle = theme.keyColor;
        ctx.fillText(key, textX, textY);
        ctx.fillStyle = theme.colonColor;
        ctx.fillText(': ', valueX, textY);
        ctx.fillStyle = theme.textColor;
        ctx.fillText(formatLength(obj.length), valueXColon, textY);
        drawArray(obj, depth + 1);

    } else if (type == '[object Number]') {
        ctx.drawImage(typeicons.number, imageX, imageY, imageOffset, imageOffset);
        ctx.fillStyle = theme.keyColor;
        ctx.fillText(key, textX, textY);
        ctx.fillStyle = theme.colonColor;
        ctx.fillText(': ', valueX, textY);
        ctx.fillStyle = theme.numberColor;
        ctx.fillText(obj, valueXColon, textY);

    } else if (type == '[object String]') {
        ctx.drawImage(typeicons.string, imageX, imageY, imageOffset, imageOffset);
        ctx.fillStyle = theme.keyColor;
        ctx.fillText(key, textX, textY);
        ctx.fillStyle = theme.colonColor;
        ctx.fillText(': ', valueX, textY);
        ctx.fillStyle = theme.stringColor;
        ctx.fillText(JSON.stringify(obj), valueXColon, textY);

    } else if (type == '[object Boolean]') {
        ctx.drawImage(typeicons.boolean, imageX, imageY, imageOffset, imageOffset);
        ctx.fillStyle = theme.keyColor;
        ctx.fillText(key, textX, textY);
        ctx.fillStyle = theme.colonColor;
        ctx.fillText(': ', valueX, textY);
        ctx.fillStyle = theme.keywordColor;
        ctx.fillText(obj, valueXColon, textY);

    } else if (type == '[object Null]') {
        ctx.drawImage(typeicons.nullobj, imageX, imageY, imageOffset, imageOffset);
        ctx.fillStyle = theme.keyColor;
        ctx.fillText(key, textX, textY);
        ctx.fillStyle = theme.colonColor;
        ctx.fillText(': ', valueX, textY);
        ctx.fillStyle = theme.keywordColor;
        ctx.fillText(null, valueXColon, textY);

    }
}

function drawObject(obj, depth) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = obj[key];
        parseType(value, depth, key, (i == keys.length - 1 && !isObjectOrArray(i)));
    }
}

function drawArray(arr, depth) {
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        parseType(element, depth, i, (i == arr.length - 1 && !isObjectOrArray(i)));
    }
}

function drawBranch(l, depth) {
    ctx.fillStyle = theme.branchColor;
    ctx.font = resolution + "px " + fontname;
    for (let i = 0; i < depth; i++) {
        switch (layers[i]) {
            case 1:
                ctx.fillText('│', (i + 0.5) * indent - offset, l * resolution);
                break;
            case 2:
                ctx.fillText('├', (i + 0.5) * indent - offset, l * resolution);
                break;
            case 3:
                ctx.fillText('└', (i + 0.5) * indent - offset, l * resolution);
                break;
            default:
                break;
        }
    }
}

function isObjectOrArray(obj) {
    let type = getType(obj);
    return (type == '[object Object]' || type == '[object Array]')
}