var $, workouts;
$(function () {
    'use strict';
    var clock, clocktime, clockInterval;

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
        $('#workoutpage-name').html(workout.name);
        instructions = "";
        $(workout.instructions).each(function () {
            instructions += '<li data-theme="c">' + this.todo + ' for ' + displayTime(this.time) + '</li>';
        });
        $('#todo-list').html(instructions);
        try {
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
            var that = this;
            if (!$(this).hasClass('ui-li-divider')) {
                $(this).click(function () {
                    openWorkout($(this).text());
                });
            }
        });
    }
    renderWorkoutList();
    clock = false;
    clocktime = 0;
    $('#clock-button').click(function () {
        if (clock) {
            clock = false;
            $('#clock-button').parent().children('span').text('Start');
            clearInterval(clockInterval);
        } else {
            clock = true;
            $('#clock-button').parent().children('span').text('Stop');
            clockInterval = setInterval(function () {
                clocktime += 1;
                $('#workoutpage-clock').html(displayTime(clocktime));
            }, 1000);
        }
    });
});
