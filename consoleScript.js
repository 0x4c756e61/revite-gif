var 
    msgbox = document.querySelector("#message"),
    body = document.querySelector("body");

let theme = window.state.settings.toJSON()["appearance:theme:overrides"]

body.insertAdjacentHTML("afterend", `
<div id="panel" style="display: none;position: fixed;z-index: 1;padding-top: 100px;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;">
    <div class="content" style="background-color: ${theme["background"]};font-family: 'Source Code Pro';color: #000;border-radius: 10px;margin: auto;padding: 20px;border: 1px solid #888;width: 80%;">
      <span id="cross" style="color: ${theme["accent"]};float: right;font-size: 28px;font-weight: bold;cursor: pointer;">&times;</span>
      <div id="gifs">
        
      </div>
      
<!-- Add "details" content here -->
    </div>
</div>
`);

var 
    panel = document.querySelector("#panel"),
    closebtn = document.querySelector("#cross"),
    gif_zone = document.querySelector("#gifs");

function updateUILocation() {
    msgbox = document.querySelector("#message");
    body = document.querySelector("body");

    panel = document.querySelector("#panel");
    closebtn = document.querySelector("#cross");
    gif_zone = document.querySelector("#gifs");
}

function hide_panel() {
    updateUILocation()
	panel.style.display = 'none';
    gif_zone.innerHTML = "";
	msgbox.focus();
}

function show_panel() {
    updateUILocation()
	panel.style.display = 'block';
	msgbox.blur();

    closebtn.onclick = function () {
        updateUILocation();
        hide_panel();
    }
}

window.onclick = function (event) {
	if (event.target == panel) return hide_panel();
};



function getChannelID() {
    var id
    window.state.draft.drafts.toJSON().forEach(arr => {
        if (arr[1] === document.querySelector("#message").value) {
            id = arr[0]
        }
    });
    return id
}

function addGif(url) {
    console.log(`![gif](${url})`);
    // msgbox.value = `![gif](${url})`;
    window.state.draft.set(getChannelID(), `![gif](${url})`)
    hide_panel()
}

function getGifs(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadywindow.statechange = function()
    {
        if (xmlHttp.readywindow.state == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }

    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
    return;
}

function showGifs(responsetext)
{
    var response_objects = JSON.parse(responsetext);
    gifs = response_objects["results"];
    updateUILocation()
    gifs.forEach(element => {
        url = element["media"][0]["gif"]["url"]
        // console.log(url)

        gif_zone.insertAdjacentHTML("beforeend", `<img onclick="addGif('${url}')" width=100 style="margin-inline:10px;" src="${url}" alt="tenor gif">`)
    });

    return;

}

function grab_data()
{
    // set the apikey
    var apikey = "LIVDSRZULELA";
    var search_url = `https://g.tenor.com/v1/search?q=${msgbox.value}&key=${apikey}&limit=50`

    getGifs(search_url,showGifs);
    console.log("grabbed")
    return;
}


window.onkeypress = (e => {
    updateUILocation()
    panel.remove()
    
    body.insertAdjacentHTML("afterend", `
<div id="panel" style="display: none;position: fixed;z-index: 1;padding-top: 100px;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;">
    <div class="content" style="background-color: ${theme["background"]};font-family: 'Source Code Pro';color: #000;border-radius: 10px;margin: auto;padding: 20px;border: 1px solid #888;width: 80%;">
      <span id="cross" style="color: ${theme["accent"]};float: right;font-size: 28px;font-weight: bold;cursor: pointer;">&times;</span>
      <div id="gifs">
        
      </div>
      
<!-- Add "details" content here -->
    </div>
</div>
`);

    if (e.key === "g" && e.ctrlKey && msgbox.value !== "") {
        console.log("[Gif-selector] Activated")
        grab_data();

        show_panel();
    }
})