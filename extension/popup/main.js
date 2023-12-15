// Update UI with current state
browser.storage.local.get(null, (items) => {
    for (const property in items){
        checkbox = document.getElementById(property)
        if (checkbox) {
            checkbox.checked = items[property].enabled
        }
        if (property == 'elfhunt_speed') {
            checkbox.value = items[property].speed
        }
    }
})
// Register changes in checkboxes
document.getElementById('snowball_infinite_health').addEventListener('change', ev => {
    snowball_infinite_health = {
        enabled: ev.target.checked
    }
    browser.storage.local.set({snowball_infinite_health}).then(setItem, onError);
})
document.getElementById('snowball_rapid_fire').addEventListener('change', ev => {
    snowball_rapid_fire = {
        enabled: ev.target.checked
    }
    browser.storage.local.set({snowball_rapid_fire}).then(setItem, onError);
})

// Register changes in textboxes
document.getElementById('elfhunt_speed').addEventListener('change', ev => {
    elfhunt_speed = {
        speed: ev.target.value
    }
    browser.storage.local.set({elfhunt_speed}).then(setItem, onError);
})

function setItem() {
  console.log("Set local storage ok");
}

function onError(error) {
  console.log(error);
}