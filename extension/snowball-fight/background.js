// Rapid fire snowballs
function rapid_fire_snowballs(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    filter.ondata = event => {
        let str = decoder.decode(event.data, { stream: true });
        // Just change any instance of Example in the HTTP response
        // to WebExtension Example.
        str = str.replace(/Example/g, 'WebExtension Example');
        filter.write(encoder.encode(str));
        filter.disconnect();
    }

    return {};
}

// helper function to load and unload listener based on bool
function update_snowball_rapid_fire_status (enabled) {
    if (enabled) {
        console.log("Enabled snowball rapid fire")
        browser.webRequest.onBeforeRequest.addListener(
            rapid_fire_snowballs,
            { urls: ["https://hhc23-snowball.holidayhackchallenge.com/room/*"], types: ["script"] },
            ["blocking"]
        );
    }
    else if (!enabled) {
        console.log("Disabled snowball rapid fire")
        browser.webRequest.onBeforeRequest.removeListener(
            rapid_fire_snowballs
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