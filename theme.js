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
            "boolean": "img/idea/boolean.png"
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
            "boolean": "img/plain/boolean.png"
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
            "boolean": "img/blocktopgraph/ic_tag_byte.png"
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
    boolean: new Image()
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