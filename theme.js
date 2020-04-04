let themes = {
    "idea": {
        "name": "IDEA",
        "backgroundColor": "#2b2b2b",
        "branchColor": "#606366",
        "textColor": "#a9b7c6",
        "keyColor": "#9876aa",
        "stringColor": "#6a8759",
        "numberColor": "#6897bb",
        "colonColor": "#cc7832",
        "keywordColor": "#cc7832",
        "resizeIcon": true,
        "icons": {
            "object": "img/idea/object.png",
            "array": "img/idea/array.png",
            "number": "img/idea/number.png",
            "string": "img/idea/string.png",
            "boolean": "img/idea/boolean.png",
            "nullobj": "img/idea/nullobj.png"
        }
    }, "plain": {
        "name": "Plain",
        "backgroundColor": "#ffffff",
        "branchColor": "#808080",
        "textColor": "#000000",
        "keyColor": "#800080",
        "stringColor": "#008000",
        "numberColor": "#0000ff",
        "colonColor": "#000000",
        "keywordColor": "#ff0000",
        "resizeIcon": true,
        "icons": {
            "object": "img/plain/object.png",
            "array": "img/plain/array.png",
            "number": "img/plain/number.png",
            "string": "img/plain/string.png",
            "boolean": "img/plain/boolean.png",
            "nullobj": "img/plain/nullobj.png"
        }
    }, "blocktopgraph": {
        "name": "Blocktopgraph Styled",
        "backgroundColor": "#fafafa",
        "branchColor": "#b0b0b0",
        "textColor": "#808080",
        "keyColor": "#737373",
        "stringColor": "#000000",
        "numberColor": "#000000",
        "colonColor": "#000000",
        "keywordColor": "#000000",
        "resizeIcon": false,
        "icons": {
            "object": "img/blocktopgraph/ic_tag_compound.png",
            "array": "img/blocktopgraph/ic_tag_list.png",
            "number": "img/blocktopgraph/number.png",
            "string": "img/blocktopgraph/ic_tag_string.png",
            "boolean": "img/blocktopgraph/ic_tag_byte.png",
            "nullobj": "img/blocktopgraph/ic_tag_default.png"
        }
    }, "vscode": {
        "name": "Visual Studio Code",
        "backgroundColor": "#1e1e1e",
        "branchColor": "#404040",
        "textColor": "#d4d4d4",
        "keyColor": "#9cdcfe",
        "stringColor": "#ce9178",
        "numberColor": "#b5cea8",
        "colonColor": "#d4d4d4",
        "keywordColor": "#569cd6",
        "resizeIcon": true,
        "icons": {
            "object": "img/vscode/object.png",
            "array": "img/vscode/array.png",
            "number": "img/vscode/number.png",
            "string": "img/vscode/string.png",
            "boolean": "img/vscode/boolean.png",
            "nullobj": "img/vscode/nullobj.png"
        }
    },
    "vector": {
        "name": "Vector",
        "backgroundColor": "#000000",
        "branchColor": "#a0a0a0",
        "textColor": "#a0a0a0",
        "keyColor": "#c7c7c7",
        "stringColor": "#00ff00",
        "numberColor": "#ff00ff",
        "colonColor": "#ffffff",
        "keywordColor": "#ffcc00",
        "resizeIcon": false,
        "icons": {
            "object": "img/vector/object.png",
            "array": "img/vector/array.png",
            "number": "img/vector/number.png",
            "string": "img/vector/string.png",
            "boolean": "img/vector/boolean.png",
            "nullobj": "img/vector/nullobj.png"
        }
    },
    "minecraftia": {
        "name": "Minecraftia",
        "backgroundColor": "#00000080",
        "branchColor": "#a7a7a7",
        "textColor": "#fbfbfb",
        "keyColor": "#54fbfb",
        "stringColor": "#54fb54",
        "numberColor": "#fba700",
        "colonColor": "#fbfbfb",
        "keywordColor": "#fb5454",
        "resizeIcon": false,
        "icons": {
            "object": "img/minecraftia/object.png",
            "array": "img/minecraftia/array.png",
            "number": "img/minecraftia/number.png",
            "string": "img/minecraftia/string.png",
            "boolean": "img/minecraftia/boolean.png",
            "nullobj": "img/minecraftia/nullobj.png"
        }
    }
}

let select = document.getElementById("themes");
for (const key in themes) {
    const element = themes[key];
    let option = document.createElement("option");
    option.setAttribute("value", key);
    option.innerText = element.name;
    select.appendChild(option);
}

function loadIcons() {
    typeicons.object.src = theme.icons.object;
    typeicons.array.src = theme.icons.array;
    typeicons.number.src = theme.icons.number;
    typeicons.string.src = theme.icons.string;
    typeicons.boolean.src = theme.icons.boolean;
    typeicons.nullobj.src = theme.icons.nullobj;
}

function loadTheme() {
    theme = themes[select.selectedOptions[0].value];
    loadIcons();
    changeStyle('html', 'backgroundColor', theme.backgroundColor);
    changeStyle('html', 'color', theme.textColor);
    changeStyle('.text', 'color', theme.textColor);
    changeStyle('.border', 'border-color', theme.textColor);
    changeStyle('.input', 'backgroundColor', theme.backgroundColor);
    changeStyle('.input', 'color', theme.textColor);
    let list = document.querySelectorAll('.btn');
    for (let i = 0; i < list.length; i++) {
        let node = list[i];
        node.addEventListener('mouseover', (e) => {
            e.target.style.backgroundColor = theme.textColor;
            e.target.style.color = theme.backgroundColor;
        });
        node.addEventListener('mouseout', (e) => {
            e.target.style.backgroundColor = theme.backgroundColor;
            e.target.style.color = theme.textColor;
        });
    }
}

select.addEventListener('change', loadTheme);

function changeStyle(selector, style, value) {
    let list = document.querySelectorAll(selector);
    for (let i = 0; i < list.length; i++) {
        let node = list[i];
        node['style'][style] = value;
    }
}

let typeicons = {
    object: new Image(),
    array: new Image(),
    number: new Image(),
    string: new Image(),
    boolean: new Image(),
    nullobj: new Image()
}
let theme = '';

loadTheme();