var 
    msgbox = document.querySelector("#message"),
    body = document.querySelector("body");

let theme = window.state.settings.toJSON()["appearance:theme:overrides"]

var
    bg = theme ? theme["background"] : "#242424"
    accent = theme ? theme["accent"] : "#FD6671"

let panelHTML = `
<div id="panel" style="display: none;position: fixed;z-index: 1;padding-top: 100px;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;">
    <div class="content" style="background-color: ${bg};font-family: 'Source Code Pro';color: #000;border-radius: 10px;margin: auto;padding: 20px;border: 1px solid #888;width: 80%;">
      <span id="cross" style="color: ${accent};float: right;font-size: 28px;font-weight: bold;cursor: pointer;">&times;</span>
      <div id="gifs">
        
      </div>

    </div>
</div>
`

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
    document.updateUILocation()
	panel.style.display = 'none';
    gif_zone.innerHTML = "";
	msgbox.focus();
}

document.show_panel = function() {
    document.updateUILocation()
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
            id = arr[0]
        }
    });
    return id
}

document.addGif = function(url) {
    console.log(`![gif](${url})`);
    // msgbox.value = `![gif](${url})`;
    window.state.draft.set(document.getChannelID(), `![gif](${url})`)
    document.hide_panel()
}

document.getGifs = function(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }

    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
    return;
}

document.showGifs = function(responsetext)
{
    var response_objects = JSON.parse(responsetext);
    let gifs = response_objects["results"];
    document.updateUILocation()
    gifs.forEach(element => {
        let url = element["media"][0]["gif"]["url"]
        // console.log(url)

        gif_zone.insertAdjacentHTML("beforeend", `<img onclick="addGif('${url}')" width=100 style="margin-inline:10px;" src="${url}" alt="tenor gif">`)
    });

    return;

}

document.grab_data = function()
{
    // set the apikey
    var apikey = "LIVDSRZULELA";
    var search_url = `https://g.tenor.com/v1/search?q=${msgbox.value}&key=${apikey}&limit=50`

    document.getGifs(search_url,document.showGifs);
    console.log("grabbed")
    return;
}


window.onkeypress = (e => {
    document.updateUILocation()
    panel.remove()
    
    body.insertAdjacentHTML("afterend", panelHTML);

    if (e.key === "g" && e.ctrlKey && msgbox.value !== "") {
        console.log("[Gif-selector] Activated")
        document.grab_data();

        document.show_panel();
    }
})