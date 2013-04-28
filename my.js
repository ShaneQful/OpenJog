var $, workouts;
$(function () {
    'use strict';
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
});
