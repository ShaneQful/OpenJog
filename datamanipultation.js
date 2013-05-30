/*jslint browser: true, devel: true */
//Predefined global variables
var $, displayTime, currentWorkoutIndex;
function displayPathString(workout) {
    'use strict';
    var url = 'https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff|weight:5|';
    url += workout.location.lat + ',' + workout.location.long;
    $(workout.intervals).each(function () {
        url += "|" + this.location.lat + ',' + this.location.long;
    });
    url += '&size=512x512&sensor=true';
    url = encodeURI(url);
    return url;
}

function displayWorkOut(direction) {
    'use strict';
    var urlString, loggedWorkOuts, nextWorkout, time, end, date;
    loggedWorkOuts = JSON.parse(localStorage.logggedWorkouts);
    if (currentWorkoutIndex) {
        currentWorkoutIndex += direction;
    } else {
        currentWorkoutIndex = loggedWorkOuts.length - 1;
    }
    nextWorkout = loggedWorkOuts[currentWorkoutIndex % loggedWorkOuts.length];
    urlString = displayPathString(nextWorkout);
    $('#path').attr('src', urlString);
    $('#prev-name').text(nextWorkout.workout);
    end = nextWorkout.intervals[nextWorkout.intervals.length - 1].time;
    time = (end - nextWorkout.startTime) / 1000;
    time = parseInt(time, 10);
    $('#prev-time').text(displayTime(time));
    date = new Date(nextWorkout.startTime);
    $('#prev-date').text(date.toLocaleDateString());
}

