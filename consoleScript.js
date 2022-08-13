var 
    msgbox = document.querySelector("#message"),
    body = document.querySelector("body");

let theme = window.state.settings.toJSON()["appearance:theme:overrides"];

let bg = theme ? theme["background"] : "#242424";
let accent = theme ? theme["accent"] : "#FD6671";

let panelHTML = `
<div id="panel" style="display: none;position: fixed;z-index: 1;padding-top: 100px;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;">
    <div class="content" style="background-color: ${bg};font-family: 'Source Code Pro';color: #000;border-radius: 10px;margin: auto;padding: 20px;border: 1px solid #888;width: 80%;">
      <span id="cross" style="color: ${accent};float: right;font-size: 28px;font-weight: bold;cursor: pointer;">&times;</span>
      <div id="gifs">
        
      </div>

    </div>
</div>
`;

body.insertAdjacentHTML("afterend", panelHTML);

var 
    panel = document.querySelector("#panel"),
    closebtn = document.querySelector("#cross"),
    gif_zone = document.querySelector("#gifs");

document.updateUILocation = function() {
    msgbox = document.querySelector("#message");
    body = document.querySelector("body");

    panel = document.querySelector("#panel");
    closebtn = document.querySelector("#cross");
    gif_zone = document.querySelector("#gifs");
}

document.hide_panel = function() {
    document.updateUILocation();
	panel.style.display = 'none';
    gif_zone.innerHTML = "";
	msgbox.focus();
}

document.show_panel = function() {
    document.updateUILocation();
	panel.style.display = 'block';
	msgbox.blur();

    closebtn.onclick = function () {
        document.updateUILocation();
        document.hide_panel();
    }
}

window.onclick = function (event) {
	if (event.target == panel) return document.hide_panel();
};



document.getChannelID = function() {
    var id
    window.state.draft.drafts.toJSON().forEach(arr => {
        if (arr[1] === document.querySelector("#message").value) {
            id = arr[0];
        }
    });
    return id;
}

document.addGif = function(url) {
    console.log(`![gif](${url})`);
    // msgbox.value = `![gif](${url})`;

    window.state.draft.set(document.getChannelID(), `![gif](${url})`);
    document.hide_panel();
}

document.getGifs = function(theUrl, callback)
{

    fetch(theUrl)
    .then(r => r.json())
    .then(data => {
        document.updateUILocation();
        data["hits"].forEach(gifData => {
            let fileURL = `https://api.gifbox.me/file/posts/${gifData["file"]["fileName"]}`;
            let viewURL = `https://gifbox.me/view/${gifData["_id"]}-${gifData["slug"]}`;
            gif_zone.insertAdjacentHTML("beforeend", `<img onclick="addGif('${viewURL}')" width=100 style="margin-inline:10px;" src="${fileURL}" alt="gifbox gif ${gifData["title"]}">`);
        });
    }).catch(e => console.log(e));
    
}

document.grab_data = function()
{
    var search_url = `https://api.gifbox.me/post/search?query=${msgbox.value}&limit=20&skip=0`

    document.getGifs(search_url);
    console.log("[gif-selector] grabbed");
    return;
}


window.onkeypress = (e => {
    document.updateUILocation();
    panel.remove();
    
    body.insertAdjacentHTML("afterend", panelHTML);

    if (e.key === "g" && e.ctrlKey && msgbox.value !== "") {
        console.log("[Gif-selector] Activated");
        document.grab_data();

        document.show_panel();
    }
});