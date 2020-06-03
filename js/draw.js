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

function parseType(obj, depth, key = '', lastItem = false) {
    let type = getType(obj);
    line++;

    if (getType(key) == '[object String]' && key != '') key = '"' + key + '"';
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

function drawBranch(line, depth) {
    ctx.fillStyle = theme.branchColor;
    ctx.font = resolution + "px " + fontname;
    for (let i = 0; i < depth; i++) {
        ctx.fillText(getBranchChar(layers[i]), (i + 0.5) * indent - offset, line * resolution);
    }
}
