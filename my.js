/*jslint browser: true, devel: true */
//Predefined global variables
var $, workouts;
$(function () {
    'use strict';
    var clock, clocktime, clockInterval, nextTodo, currenWorkout, doneSoFar,
        firstOpened, locator;
    function getWorkoutByName(workoutname) {
        var workout;
        $(workouts).each(function () {
            if (this.name === workoutname) {
                workout = this;
                return false;
            }
        });
        return workout;
    }

    function displayTime(time) {
        var seconds, minutes;
        minutes = Math.floor(time / 60);
        seconds = time % 60;
        if (seconds.toString().length === 1) {
            seconds = "0" + seconds;
        }
        return minutes + ':' + seconds;
    }

    function openWorkout(workoutname) {
        var workout, instructions;
        firstOpened = true;
        workout = getWorkoutByName(workoutname);
        if ($.isEmptyObject(workout)) {
            workout = getWorkoutByName(workoutname.slice(0, workoutname.length - 1));
        }
        currenWorkout = workout;
        $('#workoutpage-name').html(workout.name);
        instructions = "";
        $(workout.instructions).each(function () {
            instructions += '<li data-theme="c">' + this.todo + ' for ';
            instructions += displayTime(this.time) + '</li>';
        });
        $('#todo-list').html(instructions);
        try {
            $($('#todo-list').children()[0]).addClass('ui-btn-up-e');
            $('#todo-list').listview('refresh');
        } catch (err) {
            console.log('Refreshed List');
        }
    }

    function renderWorkoutList() {
        var workoutlist = $('#workout-list').html();
        $(workouts).each(function () {
            var item = '<li data-theme="c">';
            item += '<a href="#workoutpage" data-transition="slide">';
            item += this.name;
            item += '</a></li>';
            workoutlist += item;
        });
        $('#workout-list').html(workoutlist);
        $('#workout-list').listview('refresh');
        $('#workout-list').children().each(function () {
            if (!$(this).hasClass('ui-li-divider')) {
                $(this).click(function () {
                    openWorkout($(this).text());
                });
            }
        });
    }

    function resetValues() {
        clock = false;
        clocktime = 0;
        doneSoFar = 0;
        nextTodo = 0;
        firstOpened = false;
        $('#todo-list').html('');
        $('#clock-button').parent().children('span').text('Start');
        $('#workoutpage-clock').html(displayTime(clocktime));
    }

    function logWorkout() {
        var loggingInterval, log, now;
        log = {};
        log.workout = currenWorkout;
        now = new Date();
        log.startTime = now.getTime();
        loggingInterval = setInterval(function () {
            
        }, 1000); //Fix magic numbers
        //TODO: Log workout name , time started, geolocation if available
    }

    function clockTick() {
        var dialogContent;
        clocktime += 1;
        $('#workoutpage-clock').html(displayTime(clocktime));
        if (currenWorkout.instructions.length !== nextTodo) {
            if (clocktime === doneSoFar + currenWorkout.instructions[nextTodo].time) {
                doneSoFar += currenWorkout.instructions[nextTodo].time;
                $($('#todo-list').children()[nextTodo]).hide();
                nextTodo += 1;
                $($('#todo-list').children()[nextTodo]).addClass('ui-btn-up-e');
                if (localStorage.sounds === 'true') {
                    $('#audioplayer')[0].play();
                }
            }
        } else {
            $('#lnkDialog').click();
            clearInterval(clockInterval);
            dialogContent = 'Congratulations you have completed your workout.';
            dialogContent += '<br />in<br />' + displayTime(clocktime - 1);
            $('#dialog-content').html(dialogContent);
            resetValues();
        }
    }

    function startClock() {
        if (clock) {
            clock = false;
            $('#clock-button').parent().children('span').text('Start');
            clearInterval(clockInterval);
        } else {
            clock = true;
            $('#clock-button').parent().children('span').text('Stop');
            clockInterval = setInterval(clockTick, 1000);
            if (firstOpened) {
                firstOpened = false;
                logWorkout();
            }
        }
    }

    //May be a better idea to simply store all user configs in JSON form
    //and parse and store them when neccessary rather than have to use string
    //varibles for uses which they were not designed for.
    function setLocalStorageData() {
        if ($.isEmptyObject(localStorage.inUse)) {
            //Set defaults
            localStorage.inUse = 'true';
            localStorage.sounds = 'true';
            //People may have privacy concerns if on by default
            localStorage.tracking = 'false';
        }
        if (localStorage.sounds === 'true') {
            $('#flip-alert').val('on');
        } else {
            $('#flip-alert').val('off');
        }
        if (localStorage.tracking === 'true') {
            $('#flip-tracking').val('on');
        } else {
            $('#flip-tracking').val('off');
        }
    }

    function flipLocalStorageBool(bool) {
        if (localStorage[bool] !== 'true') {
            localStorage[bool] = 'true';
        } else {
            localStorage[bool] = 'false';
        }
    }

    setLocalStorageData();
    renderWorkoutList();
    resetValues();

    //Listeners
    $('#quitworkout').click(function () {
        clearInterval(clockInterval);
        resetValues();
    });
    $('#clock-button').click(startClock);
    $('#flip-alert').change(function () {
        flipLocalStorageBool('sounds');
    });
    $('#flip-track').change(function () {
        flipLocalStorageBool('tracking');
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (geodata) {
            console.log(geodata);
        }, function () {
            console.log('Geolocation not support or browser has stupid settings(grr, chrome)');
        });
    }
});
