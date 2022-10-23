var 
    msgbox = document.querySelector("#message"),
    gifsSection = document.querySelector("#gifs");

let theme = window.state.settings.toJSON()["appearance:theme:overrides"];

let bg = theme ? theme["background"] : "#242424";
let accent = theme ? theme["accent"] : "#FD6671";

document.createPanel = function()
{
let 
    panel = document.createElement("div"),
    content = document.createElement("div"),
    cross = document.createElement("span"),
    gifsSection = document.createElement("div");

panel.id = "panel";
content.id = "content";
cross.id = "cross";
gifsSection.id = "gifs"

cross.innerHTML = "&times;"

panel.insertAdjacentElement("beforeend", content);
content.insertAdjacentElement("beforeend", cross);
content.insertAdjacentElement("beforeend", gifsSection);

document.body.insertAdjacentElement("beforeend", panel);

panel.style.cssText = `
display: none;
position: fixed;
z-index: 1;
padding-top: 100px;
left: 0;
top: 0;
width: 100%;
height: 100%;
overflow: auto;
`;
content.style.cssText = `
background-color: ${bg};
font-family: 'Source Code Pro';
color: #000;
border-radius: 10px;
margin: auto;
padding: 20px;
border: 1px solid #888;
width: 80%;
`;

cross.style.cssText = `
color: ${accent};
float: right;
font-size: 28px;
font-weight: bold;
cursor: pointer;
`;
}

document.createPanel();

document.updateUILocation = function() {
    msgbox = document.querySelector("#message");
    gifsSection = document.querySelector("#gifs");
}

document.hide_panel = function() {
    document.updateUILocation();
	panel.style.display = 'none';
	msgbox.focus();
}

document.show_panel = function() {
    document.updateUILocation();
	panel.style.display = 'block';
	msgbox.blur();

    cross.onclick = function () {
        document.updateUILocation();
        document.hide_panel();
    }
}

window.onclick = function (event) {
	if (event.target == panel) return document.hide_panel();
};

document.getChannelID = function() {
    return window.location.href.split('/').slice(-1)[0];
}

document.addGif = function(url) {
    console.log(`![gif](${url})`);

    window.state.draft.set(document.getChannelID(), `![gif](${url})`);
    document.hide_panel();
}

document.getGifs = function()
{

    fetch(`https://api.gifbox.me/post/search?query=${msgbox.value}&limit=20&skip=0`)
    .then(r => r.json())
    .then(data => {
        document.updateUILocation();
        data["hits"].forEach(gifData => {
            let fileURL = `https://api.gifbox.me/file/posts/${gifData["file"]["fileName"]}`;
            let viewURL = `https://gifbox.me/view/${gifData["_id"]}-${gifData["slug"]}`;

            gifsSection.insertAdjacentHTML("beforeend", `<img onclick="addGif('${viewURL}')" width=100 style="margin-inline:10px;" src="${fileURL}" alt="gifbox gif ${gifData["title"]}">`);
        });
        console.log("[gif-selector] fetched gifs");
    }).catch(e => console.log(e));
    
}

window.onkeypress = (e => {
    document.updateUILocation();
    panel.remove();
    
    document.createPanel();

    if (e.key === "g" && e.ctrlKey && msgbox.value !== "") {

        gifsSection.innerHTML = "";
        document.getGifs();

        document.show_panel();
    }
});
