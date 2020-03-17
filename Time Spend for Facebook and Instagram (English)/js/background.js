function getStringToday() {
    var today = new Date();
    var sToday = ("0" + today.getDate()).slice(-2) + "/" + ("0" + (today.getMonth() + 1)).slice(-2) + "/" + today.getFullYear();
    return sToday;
}

function getKeyTimeTodayFacebook() {
    return "facebook-" + getStringToday();
}

function getKeyTimeTodayInstagram() {
    return "instagram-" + getStringToday();
}

function saveTimeTodayFacebook(timerToday) {
    localStorage[getKeyTimeTodayFacebook()] = timerToday;
}

function saveTimeTodayInstagram(timerToday) {
    localStorage[getKeyTimeTodayInstagram()] = timerToday;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var keyTimeFacebook = getKeyTimeTodayFacebook();
    var keyTimeInstagram = getKeyTimeTodayInstagram();

    // popup
    if (request.action == "loadStringTimerToday") {
        console.log("loadStringTimerToday");
        var time_facebook, time_instagram;
        time_facebook = localStorage[keyTimeFacebook];
        time_instagram = localStorage[keyTimeInstagram];
        sendResponse({ facebook: time_facebook, instagram: time_instagram });
    }
    // receive time_facebook.js
    if (request.action == "saveTimeTodayFacebook") {
        saveTimeTodayFacebook(request.timerToday);
    }
    // receive time_instagram.js
    if (request.action == "saveTimeTodayInstagram") {
        saveTimeTodayInstagram(request.timerToday);
    }

    // receive option
    if (request.action == "loadStringTimerAll") {
        var keys = Object.keys(localStorage);
        var d_facebook = {},
            d_instargram = {};
        keys.forEach(key => {
            if (key.startsWith("facebook-")) {
                d_facebook[key.substring(9)] = localStorage[key];
            }
            if (key.startsWith("instagram-")) {
                d_instargram[key.substring(10)] = localStorage[key];
            }
        });
        sendResponse({
            facebook: JSON.stringify(d_facebook),
            instagram: JSON.stringify(d_instargram),
            maxTimeFb: localStorage.getItem("maxTimeFacebook"),
            maxTimeIns: localStorage.getItem("maxTimeInstagram")
        });
    }

    var time = 0;
    //receive option
    if (request.action == "saveMaxTimeFacebook") {
        time = request.time;
        localStorage.setItem("maxTimeFacebook", time);

        chrome.tabs.getAllInWindow(null, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].url.includes("facebook.com")) {
                    chrome.tabs.sendMessage(tabs[i].id, { action: "change_maxTimeFacebook", maxTime: time });
                }
            }
        });
    }

    if (request.action == "saveMaxTimeInstagram") {
        time = request.time;
        localStorage.setItem("maxTimeInstagram", time);

        chrome.tabs.getAllInWindow(null, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].url.includes("instagram.com")) {
                    chrome.tabs.sendMessage(tabs[i].id, { action: "change_maxTimeInstagram", maxTime: time });
                }
            }
        });
    }

    if (request.action == "loadMaxTimeFacebook") {
        sendResponse(localStorage.getItem("maxTimeFacebook"));
    }
    if (request.action == "loadMaxTimeInstagram") {
        sendResponse(localStorage.getItem("maxTimeInstagram"));
    }
});

// Unchecked runtime.lastError: The message port closed before a response was received.
// khi gui message ma khong nhan duoc response
