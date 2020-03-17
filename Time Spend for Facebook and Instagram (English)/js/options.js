(function() {

    function addElement(tbody, date, time) {
        if (tbody != undefined) {
            var text = "<tr><td>" + date + "</td><td>" + time + "</td></tr>";
            tbody.append(text);
        }
    }

    function getStringDateTimeToday() {
        var today = new Date();
        var time = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2);
        var date = ("0" + today.getDate()).slice(-2) + "/" + ("0"+(today.getMonth()+1)).slice(-2) + "/" + today.getFullYear();
        return time + " - " + date;
    }

    var tbody_fb, tbody_ins, current_time, i;
    tbody_fb = $("#tbody-facebook");
    tbody_ins = $("#tbody-instagram");
    current_time = $("#current-time");
    current_time.append(getStringDateTimeToday());

    var select_hours_fb = $("#select_hours_fb");
    var select_minutes_fb = $("#select_minutes_fb");
    var select_hours_ins = $("#select_hours_ins");
    var select_minutes_ins = $("#select_minutes_ins");

    function updateMaxTimeFacebook() {
        var hour = select_hours_fb.val();
        var minute = select_minutes_fb.val();
        var time = (hour * 60 + minute * 1) * 60;
        console.log(hour, minute, time);
        chrome.extension.sendMessage({action: "saveMaxTimeFacebook", time: time});
    }

    function updateMaxTimeInstagram() {
        var hour = select_hours_ins.val();
        var minute = select_minutes_ins.val();
        var time = (hour * 60 + minute * 1) * 60;
        console.log(hour, minute, time);
        chrome.extension.sendMessage({action: "saveMaxTimeInstagram", time: time});
    }

    for (i = 0; i <= 24; i++) {
        select_hours_fb.append("<option>" + i + "</option>");
        select_hours_ins.append("<option>" + i + "</option>");
    }
    for (i = 0; i < 60; i += 5) {
        select_minutes_fb.append("<option>" + i + "</option>");
        select_minutes_ins.append("<option>" + i + "</option>");
    }

    select_hours_fb.change(function(e) {
        updateMaxTimeFacebook();
    });

    select_minutes_fb.change(function(e) {
        updateMaxTimeFacebook();
    });

    select_hours_ins.change(function(e) {
        updateMaxTimeInstagram();
    });

    select_minutes_ins.change(function(e) {
        updateMaxTimeInstagram();
    });

    chrome.extension.sendMessage({action: "loadStringTimerAll"}, function(response) {
        var d1 = [], d2 = [], a1;
        if (response.maxTimeFb != undefined) {
            i = response.maxTimeFb / 60;
            select_hours_fb.val(Math.floor(i/60));
            select_minutes_fb.val((i % 60) - ((i % 60) % 5));
        }
        if (response.maxTimeIns != undefined) {
            i = response.maxTimeIns / 60;
            select_hours_ins.val(Math.floor(i/60));
            select_minutes_ins.val((i % 60) - ((i % 60) % 5));
        }
        if (response.facebook != undefined) {
            var d_facebook = JSON.parse(response.facebook);
            Object.keys(d_facebook).forEach(key => {
                a1 = key.split("/");
                d1.push({key: key, date: new Date(a1[2], a1[1], a1[0])});
            });
            d1.sort(function(a,b) {
                return b.date - a.date;
            }).forEach( d => {
                addElement(tbody_fb, d.key, d_facebook[d.key]);
            });
        }
        if (response.instagram != undefined) {
            var d_instagram = JSON.parse(response.instagram);
            Object.keys(d_instagram).forEach(key => {
                a1 = key.split("/");
                d2.push({key: key, date: new Date(a1[2], a1[1], a1[0])});
            });
            d2.sort(function(a,b) {
                return b.date - a.date;
            }).forEach( d => {
                addElement(tbody_ins, d.key, d_instagram[d.key]);
            });
        }
    });
})(window);