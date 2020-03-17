
(function() {
    var startTime = 0;
    var currentTime = 0;
    var isShowAlert = false;
    var maxTime = 0;

    console.log("Start Timer - Ins Tools TX");

    function getStringTimer() {
        currentTime = new Date().getTime();
        var hours, minutes, seconds;
        var interval = parseInt((currentTime - startTime) / 1000);

        hours = Math.floor(interval / 3600);
        minutes = Math.floor((interval - hours * 3600) / 60);
        seconds = interval - minutes * 60 - hours * 3600;

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        return hours + ":" + minutes + ":" + seconds;
    }

    function saveTime() {
        chrome.extension.sendMessage({action: "saveTimeTodayInstagram", timerToday: getStringTimer()});
        if (maxTime != 0) {
            if (currentTime - startTime > maxTime * 1000) {
                showAlert();
            }
        }
        window.setTimeout(saveTime, 500);
    }

    function showAlert() {
        if (isShowAlert) return;
        isShowAlert = true;
        alert("You've spent too much time on Instagram today!");
    }

    chrome.extension.sendMessage({action: "loadStringTimerToday"}, function(response) {
        var time_instargram = response.instagram;
        startTime = new Date().getTime();

        if (time_instargram != undefined) {
            var s = time_instargram.split(":");
            ss = (s[0]*3600 + s[1]*60 + s[2]*1)*1000;
            startTime -= ss;
        }
        saveTime();
    });

    chrome.extension.sendMessage({action: "loadMaxTimeInstagram"}, function(response) {
        if (response != undefined) maxTime = response;
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action == "change_maxTimeInstagram") {
            maxTime = request.maxTime;
            isShowAlert = false;
            if (request.maxTime*1000 < (currentTime - startTime)) {
                showAlert();
            }
        }
    });

})(window);
