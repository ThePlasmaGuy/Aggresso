/* Menu Bar Operating Scripts for Aggresso Render Process*/

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
var CHours, CMinutes, CSeconds, CMonth, CTOD, CDOTW, time_width;

function timeProtocol() {
    
    //Get Current Time
    
    var today = new Date();
    var now = today.getTime();
    
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
    
    CHours = fixTime(CHours);
    
    $("#clock-hours").text(CHours);
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
}

// Start Clock
setInterval(timeProtocol,1000);