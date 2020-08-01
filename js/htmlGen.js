
var listBox = _('#list');//获取自定义右键菜单


//关闭右键
document.onclick = function () {
    listBox.style.display = 'none';//再次点击时隐藏菜单框
}

function parseTypeHTML(parent, obj, path, depth, key = '', lastItem = false) {
    let type = getType(obj);
    if (getType(key) == '[object String]' && key != '') key = JSON.stringify(key);

    let div = document.createElement('div');
    let innerDiv = document.createElement('div');
    let childDiv = document.createElement('div');
    let img = document.createElement('img');
    img.style.width = resolution + 'px';
    img.style.height = 'auto';
    img.style.margin = '2px';
    img.style.verticalAlign = 'middle';

    layers[depth - 1] = lastItem ? 3 : 2;
    innerDiv.className = 'object';
    childDiv.className = 'childrens';
    padding = '';
    for (let i = 0; i < depth; i++) {
        padding += getBranchCharHTML(layers[i], true);
    }
    let font = document.createElement('font');
    font.setAttribute('color', theme.branchColor);
    font.innerHTML = padding;
    innerDiv.appendChild(font);

    layers[depth - 1] = lastItem ? 0 : 1;

    innerDiv.appendChild(img);
    div.appendChild(innerDiv);
    div.appendChild(childDiv);

    //innerDiv.id = path;
    innerDiv.addEventListener('contextmenu', () => {
        //兼容性写法示例：
        var ev = ev || event;//或（||）书写顺序有讲究，不能随意换

        //阻止默认行为
        ev.preventDefault();


        //记录当前的坐标(x轴和y轴)
        var x = ev.pageX;
        var y = ev.pageY;

        listBox.style.display = 'block';//右键点击时显示菜单框
        listBox.style.left = x + 'px';
        listBox.style.top = y >= document.body.clientHeight - 115 ? (y - 115) + 'px' : y + 'px';
        listBox.children[0].addEventListener('click', () => {
            copyText(path);
        }); listBox.children[1].addEventListener('click', () => {
            copyText(key);
        }); listBox.children[2].addEventListener('click', () => {
            copyText(JSON.stringify(obj));
        });
    });

    if (type == '[object Object]') {
        img.src = typeicons.object.src;
        innerDiv.appendChild(createKeyValue(key, formatLength(Object.keys(obj).length)))
        parent.appendChild(div);
        drawObjectHTML(childDiv, obj, path, depth + 1)
    } else if (type == '[object Array]') {
        img.src = typeicons.array.src;
        innerDiv.appendChild(createKeyValue(key, formatLength(obj.length)));
        parent.appendChild(div);
        drawArrayHTML(childDiv, obj, path, depth + 1)
    } else if (type == '[object Number]') {
        img.src = typeicons.number.src;
        innerDiv.appendChild(createKeyValue(key, obj, theme.numberColor));
        parent.appendChild(div);
    } else if (type == '[object String]') {
        img.src = typeicons.string.src;
        innerDiv.appendChild(createKeyValue(key, JSON.stringify(obj), theme.stringColor));
        parent.appendChild(div);
    } else if (type == '[object Boolean]') {
        img.src = typeicons.boolean.src;
        innerDiv.appendChild(createKeyValue(key, obj, theme.keywordColor));
        parent.appendChild(div);
    } else if (type == '[object Null]') {
        img.src = typeicons.nullobj.src;
        innerDiv.appendChild(createKeyValue(key, obj, theme.keywordColor));
        parent.appendChild(div);
    }
}

// {"we":{"wewdw":{"array":[{},[["test"]],{},{}]}}}

function drawObjectHTML(parent, obj, path, depth) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = obj[key];
        parseTypeHTML(parent, value, path + '[' + JSON.stringify(key) + ']', depth, key, (i == keys.length - 1 && !isObjectOrArray(i)));
    }
}

function drawArrayHTML(parent, arr, path, depth) {
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        parseTypeHTML(parent, element, path + '[' + i + ']', depth, i, (i == arr.length - 1 && !isObjectOrArray(i)));
    }
}

function createKeyValue(key, value, valueColor = theme.textColor) {
    let div = document.createElement('div');
    div.style.display = 'inline';
    let keyFont = document.createElement('font');
    keyFont.setAttribute('color', theme.keyColor);
    keyFont.appendChild(document.createTextNode(key));
    div.appendChild(keyFont);
    let colonFont = document.createElement('font');
    colonFont.setAttribute('color', theme.colonColor);
    colonFont.appendChild(document.createTextNode(': '));
    div.appendChild(colonFont);
    div.appendChild(createValue(value, valueColor));
    return div;
}

function createValue(value, valueColor) {
    let valueFont = document.createElement('font');
    valueFont.setAttribute('color', valueColor);
    valueFont.appendChild(document.createTextNode(value));
    return valueFont;
}

function getBranchCharHTML(layerId, space = false) {
    let char = space ? '&nbsp;' : '';
    switch (layerId) {
        case 1:
            return '│' + char;
        case 2:
            return '├' + char;
        case 3:
            return '└' + char;
        default:
            return '&nbsp;' + char;
    }
}