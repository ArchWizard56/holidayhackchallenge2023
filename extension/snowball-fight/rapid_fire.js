// Rapid fire snowballs
// Javascript to modify
const old_snowball_script = `
    this.input.on('pointerdown', function (pointer) {
      let nowt = Date.now()
      if (Date.now() - player.throwTime > player.throwDelay && player.ready) {
        player.throwTime = nowt
        playerThrow(pointer)
      }
    }, this);`
const snowball_script = `
var mousedownID = -1
this.input.on('pointerdown', function (pointer) {
    if (mousedownID == -1)
    {
        mousedownID = setInterval(() => {playerThrow(pointer)}, 10)
    }
}, this);
this.input.on('pointerup', function (pointer) {
    if (mousedownID != -1)
    {
        clearInterval(mousedownID)
        mousedownID = -1
    }
}, this);
`
// listener in the extension
function snowball_rapid_fire(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    console.log("Got a data")
    var data = ''
    filter.ondata = event => {
        console.log("Got a data")
        let incoming_data = decoder.decode(event.data);
        data += incoming_data
    }

    filter.onstop = event => {
        data = data.replace(old_snowball_script, snowball_script)
        filter.write(encoder.encode(data))
        filter.disconnect()
    }

    return {};
}

// helper function to load and unload listener based on bool
function update_snowball_rapid_fire_status (enabled) {
    if (enabled) {
        console.log("Enabled snowball rapid fire")
        browser.webRequest.onBeforeRequest.addListener(
            snowball_rapid_fire,
            { urls: ["https://hhc23-snowball.holidayhackchallenge.com/room*"] },
            ["blocking"]
        );
    }
    else if (!enabled) {
        console.log("Disabled snowball rapid fire")
        browser.webRequest.onBeforeRequest.removeListener(
            snowball_rapid_fire
        );
    }
}

// Enable or disable rapid fire based on the state of local storage
browser.storage.local.get("snowball_rapid_fire", (items) => {
    console.log(items)
    if (items.snowball_rapid_fire == undefined) {
        return
    }
    update_snowball_rapid_fire_status(items.snowball_rapid_fire.enabled)

}
);
browser.storage.onChanged.addListener(changeData => {
    console.log(changeData)
    if (changeData.snowball_rapid_fire != undefined) {
        update_snowball_rapid_fire_status(changeData.snowball_rapid_fire.newValue.enabled)
    }
});