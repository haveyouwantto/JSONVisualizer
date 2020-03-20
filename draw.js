let c = document.getElementById("canvas");
let res = document.getElementById('resolution');
let resolution = 16;
let offset = 0;
let ctx = c.getContext("2d");
let line = 0;
let theme = '';

let layers = [];

function draw(json) {

    theme = themes[select.selectedOptions[0].value];
    loadIcons();
    setTimeout(() => {
        try {
            let obj = JSON.parse(json);

            resolution = parseInt(res.value);
            line = 0;
            offset = resolution / 8;

            let dimension = getDimension(obj);
            console.log(dimension);

            ctx.font = resolution + "px Inconsolata";
            let measure = ctx.measureText(dimension[1]);
            c.width = measure.width + resolution * (dimension[2] + 1);
            c.height = resolution * (dimension[0] + 1);
            ctx.fillStyle = theme.backgroundColor;
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.font = resolution + "px Inconsolata";
            parseType(obj, 0);
        } catch (e) {
            alert('JSON语法错误:\n' + e);
            console.error(e.stack);
        }
    }, 100);
}

let typeicons = {
    object: document.getElementById('object'),
    array: document.getElementById('array'),
    number: document.getElementById('number'),
    string: document.getElementById('string'),
    boolean: document.getElementById('boolean')
}
function loadIcons() {
    typeicons.object.src = theme.icons.object;
    typeicons.array.src = theme.icons.array;
    typeicons.number.src = theme.icons.number;
    typeicons.string.src = theme.icons.string;
    typeicons.boolean.src = theme.icons.boolean;
}

theme = themes[select.selectedOptions[0].value];
loadIcons();

function getDimension(obj, key, depth = 0) {
    let type = getType(obj);
    let height = 1;
    let longest = '';
    let str = '';
    let maxdepth = depth;
    if (type != '[object Array]' && type != '[object Null]' && type != '[object Object]') str = fill(depth + 2) + key + ': ' + obj.toString();
    else str = fill(depth + 2) + key + ': x entries';
    if (type == '[object Object]') {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                let ret = getDimension(element, key, depth + 1);
                height += ret[0];
                if (ret[1].length > longest.length) longest = ret[1];
                if (ret[2] > maxdepth) maxdepth = ret[2];
            }
        }
    } else if (type == '[object Array]') {
        for (let i = 0; i < obj.length; i++) {
            const element = obj[i];
            let ret = getDimension(element, i, depth + 1);
            height += ret[0];
            if (ret[1].length > longest.length) longest = ret[1];
            if (ret[2] > maxdepth) maxdepth = ret[2];
        }
    }
    if (str.length > longest.length) longest = str;
    if (depth > maxdepth) maxdepth = depth;
    return [height, longest, maxdepth];
}

function fill(count) {
    let out = '';
    for (let i = 0; i < count; i++) {
        out += '  ';
    }
    return out;
}

function getType(obj) {
    return Object.prototype.toString.call(obj);
}

function formatLength(len) {
    if (len == 1) return len + ' entry';
    else return len + ' entries';
}

function parseType(obj, depth, key = '', lastItem = false) {
    let type = getType(obj);
    line++;

    if (getType(key) == '[object String]' & key != '') key = '"' + key + '"';
    layers[depth - 1] = lastItem ? 3 : 2;
    drawBranch(line, depth, lastItem);
    layers[depth - 1] = lastItem ? 0 : 1;

    ctx.fillStyle = theme.textColor;
    let imageX = depth * resolution * 1.5 + offset;
    let imageY = (line - 1) * resolution + offset * 2;
    let imageOffset = resolution - offset;
    let textX = (depth + 1) * resolution * 1.5;
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
        ctx.fillText('"' + obj + '"', valueXColon, textY);

    } else if (type == '[object Boolean]') {
        ctx.drawImage(typeicons.boolean, imageX, imageY, imageOffset, imageOffset);
        ctx.fillStyle = theme.keyColor;
        ctx.fillText(key, textX, textY);
        ctx.fillStyle = theme.colonColor;
        ctx.fillText(': ', valueX, textY);
        ctx.fillStyle = theme.keywordColor;
        ctx.fillText(obj, valueXColon, textY);

    } else if (type == '[object Null]') {
        ctx.drawImage(typeicons.object, imageX, imageY, imageOffset, imageOffset);
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
    for (let i = 0; i < depth; i++) {
        switch (layers[i]) {
            case 1:
                ctx.fillText('│', i * resolution * 1.5, l * resolution);
                break;
            case 2:
                ctx.fillText('├', i * resolution * 1.5, l * resolution);
                break;
            case 3:
                ctx.fillText('└', i * resolution * 1.5, l * resolution);
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