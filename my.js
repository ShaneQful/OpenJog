/*jslint browser: true, devel: true */
var $, workouts;
$(function () {
    'use strict';
    var clock, clocktime, clockInterval, nextTodo, currenWorkout, doneSoFar;

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
        $('#todo-list').html('');
        $('#clock-button').parent().children('span').text('Start');
        $('#workoutpage-clock').html(displayTime(clocktime));
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
                $('#audioplayer')[0].play();
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
        }
    }

    function setLocalStorageData() {
        if ($(localStorage.inUse).isEmptyObject()) {
            //Set defaults
            localStorage.inUse = 'true';
            localStorage.sounds = 'true';
            //People may have privacy concerns if on by default
            localStorage.tracking = 'false';
        }
    }

    setLocalStorageData();
    renderWorkoutList();
    resetValues();
    $('#clock-button').click(startClock);
});
