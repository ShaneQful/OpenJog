/*jslint browser: true, devel: true */
//Predefined global variables
var $;
function displayPathString(workout) {
    'use strict';
    var url = 'https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff|weight:5|';
    url += workout.location.lat + ',' + workout.location.long;
    $(workout.intervals).each(function () {
        //Quick fix for in accurate readings
        if (this.location.accuracy <= 200) {
            url += "|" + this.location.lat + ',' + this.location.long;
        }
    });
    url += '&size=512x512&sensor=true';
    url = encodeURI(url);
    return url;
}

function displayLastWorkOut() {
    'use strict';
    var urlString, loggedWorkOuts;
    loggedWorkOuts = JSON.parse(localStorage.logggedWorkouts);
    urlString = displayPathString(loggedWorkOuts[loggedWorkOuts.length - 1]);
    console.log(urlString);
    $('#path').attr('src', urlString);
}

