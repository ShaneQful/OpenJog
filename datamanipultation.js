/*jslint browser: true, devel: true */
//Predefined global variables
var $, displayTime;
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
    var urlString, loggedWorkOuts, lastWorkout, time, end, date;
    loggedWorkOuts = JSON.parse(localStorage.logggedWorkouts);
    lastWorkout = loggedWorkOuts[loggedWorkOuts.length - 1];
    urlString = displayPathString(lastWorkout);
    $('#path').attr('src', urlString);
    $('#prev-name').text(lastWorkout.workout);
    end = lastWorkout.intervals[lastWorkout.intervals.length - 1].time;
    time = (end - lastWorkout.startTime) / 1000;
    time = parseInt(time, 10);
    $('#prev-time').text(displayTime(time));
    date = new Date(lastWorkout.startTime);
    $('#prev-date').text(date.toLocaleDateString());
}

