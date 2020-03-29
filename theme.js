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
        "textColor": "#a0a0a0",
        "keyColor": "#737373",
        "stringColor": "#000000",
        "numberColor": "#000000",
        "colonColor": "#000000",
        "keywordColor": "#000000",
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
        "icons": {
            "object": "img/vscode/object.png",
            "array": "img/vscode/array.png",
            "number": "img/vscode/number.png",
            "string": "img/vscode/string.png",
            "boolean": "img/vscode/boolean.png",
            "nullobj": "img/vscode/nullobj.png"
        }
    }, "vector": {
        "name": "Vector",
        "backgroundColor": "#000000",
        "branchColor": "#a0a0a0",
        "textColor": "#a0a0a0",
        "keyColor": "#c7c7c7",
        "stringColor": "#00ff00",
        "numberColor": "#ff00ff",
        "colonColor": "#ffffff",
        "keywordColor": "#ffcc00",
        "icons": {
            "object": "img/neon/object.png",
            "array": "img/neon/array.png",
            "number": "img/neon/number.png",
            "string": "img/neon/string.png",
            "boolean": "img/neon/boolean.png",
            "nullobj": "img/neon/nullobj.png"
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
select.addEventListener('change', () => {
    theme = themes[select.selectedOptions[0].value];
    console.log(1);
    loadIcons();
});

let typeicons = {
    object: new Image(),
    array: new Image(),
    number: new Image(),
    string: new Image(),
    boolean: new Image(),
    nullobj: new Image()
}
let theme = '';

function loadIcons() {
    typeicons.object.src = theme.icons.object;
    typeicons.array.src = theme.icons.array;
    typeicons.number.src = theme.icons.number;
    typeicons.string.src = theme.icons.string;
    typeicons.boolean.src = theme.icons.boolean;
    typeicons.nullobj.src = theme.icons.nullobj;
}

theme = themes[select.selectedOptions[0].value];
loadIcons();