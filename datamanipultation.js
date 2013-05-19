//Needs so error checking for unavailable locations
function displayPathString(workout) {
    var url = 'https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff|weight:5|';
    url += workout.location.lat+','+workout.location.long;
    $(workout.intervals).each(function () {
        url += "|"+this.location.lat+','+this.location.long;
    });
    url += '&size=512x512&sensor=true';
    url = encodeURI(url);
    return url;
}