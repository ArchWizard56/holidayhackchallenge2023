// Rapid fire snowballs
// Javascript to modify
const old_health_script = `
        player.health = Math.min( Math.max(Math.abs( player.health - dmg ), 0), 50)`
const new_health_script = `
        player.health = 50`
// listener in the extension
function infinite_health_listener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    var data = ''
    filter.ondata = event => {
        let incoming_data = decoder.decode(event.data);
        data += incoming_data
    }

    filter.onstop = event => {
        data = data.replace(old_health_script, new_health_script)
        filter.write(encoder.encode(data))
        filter.disconnect()
    }

    return {};
}

// helper function to load and unload listener based on bool
function update_snowball_infinite_health_status (enabled) {
    if (enabled) {
        console.log("Enabled snowball infinite health")
        browser.webRequest.onBeforeRequest.addListener(
            infinite_health_listener,
            { urls: ["https://hhc23-snowball.holidayhackchallenge.com/room*"] },
            ["blocking"]
        );
    }
    else if (!enabled) {
        console.log("Disabled snowball infinite health")
        browser.webRequest.onBeforeRequest.removeListener(
            infinite_health_listener
        );
    }
}

// Enable or disable rapid fire based on the state of local storage
browser.storage.local.get("snowball_infinite_health", (items) => {
    if (items.snowball_infinite_health == undefined) {
        return
    }
    update_snowball_infinite_health_status(items.snowball_infinite_health.enabled)

}
);
browser.storage.onChanged.addListener(changeData => {
    if (changeData.snowball_infinite_health != undefined) {
        update_snowball_infinite_health_status(changeData.snowball_infinite_health.newValue.enabled)
    }
});