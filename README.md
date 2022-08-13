# revite-gif
A revite plugin adding a gif selector
\
**Please note that this version is the legacy tenor build. It won't get any new updates. Please use the gifbox version under the dev branch.**

## Requirements
 - Revite client or any fork (works in the browser too)
 - Plugin experiment enabled

## Installing
In the console paste this
```
state.plugins.add({
    format: 1,
    version: "0.0.1",
    namespace: "0x454d505459",
    id: "gif-selector",
    entrypoint: `(state) => {
        console.log('[gif-selector] Plugin loaded!');
        let rq = new Request("https://raw.githubusercontent.com/0x454d505459/revite-gif/tenor/consoleScript.js")
        fetch(rq)
        .then((resp) => resp.text())
        .then((code) => {
            eval(code);
            console.log('[gif-selector] Script evaluated!');
        })
        
        return {
            onClient: c => console.log('[gif-selector] Acquired Client:', c, '\\nHello', c.user.username + '!'),
            onUnload: () => console.log('[gif-selector] Plugin unloaded!')
        }
    }`
});
```

**Note**: You have to do this only one time.

## Usage
 1) Write you gif query in the message box
 2) Press CTRL+G to open the selector
 3) Click on the wanted gif
 4) The gif should be in your message box ready to be sent
