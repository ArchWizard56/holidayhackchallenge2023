browser.runtime.onMessage.addListener(notify);
function notify(message) {
    if (message.type != "elfhunt_new_cookie") {
        return
    }
    console.log("Got a cookie message") 
    document.cookie = message.cookie
    
    if (message.reload) {
        window.location.reload();
    }
}
browser.runtime.sendMessage({ type: "elfhunt_page_load" });

