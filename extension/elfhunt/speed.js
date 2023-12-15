// Update cookie based on value
function forge_elfhunt_cookie(new_speed) {
    let cookie_prefix = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0"
    let cookie_name = "ElfHunt_JWT"
    speed = {
        "speed": parseInt(new_speed)
    }

    let cookie_data = btoa(JSON.stringify(speed)).replace(/=+$/, '');
    cookie = `${cookie_name}=${cookie_prefix}.${cookie_data}.`
    return cookie

}

function update_elfhunt_speed(new_speed) {
    browser.cookies.set(forge_elfhunt_cookie(new_speed))
}

browser.scripting.registerContentScripts([{
    id: "elfhunt_speed_content",
    js: ["elfhunt/speed-content.js"],
    matches: ["https://elfhunt.org/*"],
    runAt: "document_start",
    allFrames: true
}])

browser.runtime.onMessage.addListener(notify);

function send_cookie_to_tabs(tabs) {
    for (const tab of tabs) {
        browser.tabs.sendMessage(tab.id, { type: "elfhunt_new_cookie", cookie: cookie, reload: false })
    }
}

function notify(message) {
    if (message.type == "elfhunt_page_load") {
        browser.storage.local.get("elfhunt_speed", (items) => {
            // fill with default value
            cookie = ""
            if (items.elfhunt_speed == undefined) {
                elfhunt_speed = {
                    speed: -500
                }
                browser.storage.local.set({ elfhunt_speed })
                cookie = forge_elfhunt_cookie(-500)
                console.log(`Set elfhunt cookie to 500`)
            }
            else {
                cookie = forge_elfhunt_cookie(items.elfhunt_speed.speed)
                console.log(`Set elfhunt cookie to ${items.elfhunt_speed.speed}`)
            }
            browser.tabs
                .query({
                    currentWindow: true,
                    active: true,
                })
                .then(send_cookie_to_tabs)
        });

    }
}

function send_refresh_cookie_to_tabs(tabs) {
    for (const tab of tabs) {
        browser.tabs.sendMessage(tab.id, { type: "elfhunt_new_cookie", cookie: cookie, reload: true })
    }
}

browser.storage.onChanged.addListener(changeData => {
    if (changeData.elfhunt_speed != undefined) {
        cookie = forge_elfhunt_cookie(changeData.elfhunt_speed.newValue.speed)
        browser.tabs
            .query({
                currentWindow: true,
                active: true,
            })
            .then(send_refresh_cookie_to_tabs)
        console.log(`Set elfhunt cookie to ${changeData.elfhunt_speed.newValue.speed}`)
    }
});




