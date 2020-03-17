(function() {
    function updateLabelTime(time_facebook, time_instagram) {
        var label_facebook = document.getElementById("time-facebook");
        var label_instagram = document.getElementById("time-instagram");
        if (time_facebook == undefined) time_facebook = "00:00:00";
        if (time_instagram == undefined) time_instagram = "00:00:00";
        if (label_facebook) {
            label_facebook.textContent = time_facebook;
        }
        if (label_instagram) {
            label_instagram.textContent = time_instagram;
        }
    }

    (function setTime() {
        chrome.extension.sendMessage({action: "loadStringTimerToday"}, function(response) {
            updateLabelTime(response.facebook, response.instagram);
        });
        window.setTimeout(setTime, 1000);
    })();

})(window);