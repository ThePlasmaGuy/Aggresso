/* Menu Bar Operating Scripts for Aggresso Render Process*/


var today = new Date();

// Clock Readout

// Helper Functions
function fixTime(timeVariable) {
    if (timeVariable < 10) {
        timeVariable = "0" + timeVariable;
    }
    return timeVariable;
}

function getMonth(dateVariable) {
    var monthNumber = dateVariable.getMonth();
    var monthName = "ERROR";
    switch (monthNumber) {
        case 0:
            monthName = "January";
        break;
        case 1:
            monthName = "February";
        break;
        case 2:
            monthName = "March";
        break;
        case 3:
            monthName = "April";
        break;
        case 4:
            monthName = "May";
        break;
        case 5:
            monthName = "June";
        break;
        case 6:
            monthName = "July";
        break;
        case 7:
            monthName = "August";
        break;
        case 8:
            monthName = "September";
        break;
        case 9:
            monthName = "October";
        break;
        case 10:
            monthName = "November";
        break;
        case 11:
            monthName = "December";
        break;
    }
    return monthName;
}

function getDOTW(dateVariable) {
    var dayNumber = dateVariable.getDay();
    var DOTW = "ERROR";
    switch (dayNumber){
        case 0:
            DOTW = "Sunday";
        break;
        case 1:
            DOTW = "Monday";
        break;
        case 2:
            DOTW = "Tuesday";
        break;
        case 3:
            DOTW = "Wednesday";
        break;
        case 4:
            DOTW = "Thursday";
        break;
        case 5:
            DOTW = "Friday";
        break;
        case 6:
            DOTW = "Saturday";
        break;
    }
    return DOTW;
}

function isEven(n) {
    return n % 2 == 0;
}


// Clock Worker Function
var now, CHours, CMinutes, CSeconds, CMonth, CTOD, CDOTW, time_width;

function timeProtocol() {
    
    //Get Current Time
    today = new Date();
    now = today.getTime();
    
    //Current Time
    CHours = today.getHours();
    CMinutes = fixTime(today.getMinutes());
    CSeconds = today.getSeconds();
    CMonth = getMonth(today);
    CDay = today.getDate();
    CYear = today.getYear();
    CDOTW = getDOTW(today);
    CDate = CMonth + " " + CDay + ", " + (CYear+1900);
    
    if (CHours == 12) {
        CTOD = "PM";
    } else if (CHours > 12) {
        CTOD = "PM";
        CHours = CHours - 12;
    } else if (CHours == 0) {
        CTOD = "AM";
        CHours = "12";
    } else { CTOD = "AM"; }
    
    FixedCHours = fixTime(CHours);
    
    $("#clock-hours").text(FixedCHours);
    $("#clock-minutes").text(CMinutes);
    $("#clock-tod").text(CTOD);
    $("#clock-dotw").text(CDOTW);
    $("#clock-date").text(CDate);

    if (isEven(CSeconds)) {
        $('#clock-time-separator').addClass('hidden');
    } else {
        $('#clock-time-separator').removeClass('hidden');
    }
    
    time_width = (($('#clock-time').width() / $(window).height()) * 100) + 4;
    $("#clock-face").attr('style', 'width: ' + time_width + 'vh !important;');
    $("#alarm-readout").attr('style', 'width: calc(100vw - 9vh - ' + time_width + 'vh) !important;');
}

timeProtocol(); // Run Protocol once so that clock starts updating when page begins.

// Start Clock
setInterval(timeProtocol,1000);


// Alarm Readout
function determine12hrs(hours) {
    if (hours == 12) {
        return {hours: hours, tod: 'PM'};
    } else if (hours == 0) {
        return {hours: 12, tod: 'AM'};
    } else if (hours >= 12) {
        return {hours: (hours - 12), tod: 'PM'};
    } else {
        return {hours: hours, tod: 'AM'};
    }
}

function get_sorted_alarms() {
    check_hours = today.getHours();
    check_minutes = fixTime(today.getMinutes());
    check_minutes += 1;

    if (check_minutes > 60) {
        check_hours += 1;
        check_minutes -= 60;
    }

    time_subtract = parseInt(check_hours + '' + fixTime(check_minutes));

    function alarm_sort(alarm_a, alarm_b) {
        alarm_a_time = parseInt(alarm_a.time.hours + '' + fixTime(alarm_a.time.minutes)) - time_subtract;
        alarm_b_time = parseInt(alarm_b.time.hours + '' + fixTime(alarm_b.time.minutes)) - time_subtract;

        if (alarm_a_time < 0) { alarm_a_time += 2400 }
        if (alarm_b_time < 0) { alarm_b_time += 2400 }
        
        return alarm_a_time - alarm_b_time
    }

    return settings.alarms.sort(alarm_sort)
}

function update_alarms() {
    
    visible_alarms = get_sorted_alarms().slice(0,4);

    switch(visible_alarms.length) {
        default:
            if (visible_alarms.length >= 2) {
                first_alarm = visible_alarms[0]
                adjusted_time = determine12hrs(first_alarm.time.hours)
                $('#alarm-next').empty().append(fixTime(adjusted_time.hours) + ':' + fixTime(first_alarm.time.minutes) + '<span class="alarm-tod">' + adjusted_time.tod + '</span>');
                
                sub_alarms = visible_alarms.slice(1);
                $('#alarm-upcomming').empty();
                $.each(sub_alarms , function(index, val) {
                    sub_adjusted_time = determine12hrs(val.time.hours)
                    $('#alarm-upcomming').append('<span>' + fixTime(sub_adjusted_time.hours) + ':' + fixTime(val.time.minutes) + '<span class="alarm-tod">' + sub_adjusted_time.tod + '</span></span>');
                });

                $('#alarm-readout').removeClass('single').addClass('full');
            }
            break;
        case 1:
            first_alarm = visible_alarms[0]
            adjusted_time = determine12hrs(first_alarm.time.hours)
            $('#alarm-next').empty().append(fixTime(adjusted_time.hours) + ':' + fixTime(first_alarm.time.minutes) + '<span class="alarm-tod">' + adjusted_time.tod + '</span>');
            
            $('#alarm-upcomming').empty();
            $('#alarm-readout').removeClass('full').addClass('single');
            break;
        case 0:
            $('#alarm-readout').removeClass('full').removeClass('single');
            $('#alarm-next').empty().append('None');
            $('#alarm-upcomming').empty();
            break;
    }
}

update_alarms(); //Run Update Script Once to prevent waiting 10 seconds after launch until update

// Update Alarms every 10 seconds
setInterval(update_alarms,10000);