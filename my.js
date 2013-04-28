var $, workouts;
$(function () {
    'use strict';
    var clock, clockInterval;

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
        $('#workout-list').each(function () {
            if (!this.hasClass('ui-li-divider')) {
                this.onclick(function () {
                    getWorkoutByName(this.name);
                });
            }
        });
    }

    function openWorkout(workoutname) {
        var workout, instructions;
        workout = getWorkoutByName(workoutname);
        $('#workoutpage-name').html(workout.name);
        $(workout.instructions).each(function () {
            var seconds, minutes;
            minutes = this.time / 60;
            seconds = this.time % 60;
            instructions += '<h3>' + this.todo + ' for ' + minutes + ':';
            instructions += seconds + '</h3>';
        });
        $('#workoutpage-content').html();
    }
    renderWorkoutList();
});
