/* Carousel Operating Scripts for Aggresso Render Process*/

/* Carousel Operator */
var next_right = true; // Which Direction to Cycle.  True = Right, False = Left
var slideshow_auto_tracker = settings.carousel_wait_time + 5 // Initial Time-To-Swap


// Helper Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fill Carousel
carousel_items = remote.getGlobal('carousel_items');
shuffleArray(carousel_items);
$.each(carousel_items , function(index, val) { 
    $('#carousel').append("<div style=\"background-image: url('carousel/" +  val + "')\"></div>");
});
console.log('ADDED ' + carousel_items.length + ' IMAGES TO CAROUSEL.');

// Initiate first image
$('#carousel > div').removeClass('active');
$('#carousel > div:first-child').addClass('active');

// Run Carousel
function next_image() { // Cycle to next image in queue
    var current = $('#carousel > div.active');
    var next = current.next();
    
    if (next.is('div')) {
        current.removeClass('active');
        next.addClass('active');
    } else {
        $('#carousel > div').removeClass('active');
        $('#carousel > div:first-child').addClass('active');
    }
}

function previous_image() { // Cycle to previous image in queue
    var current = $('#hm-s-images > div.active');
    var previous = current.prev();
    
    if (previous.is('div')) {
        current.removeClass('active');
        previous.addClass('active');
    } else {
        $('#carousel > div').removeClass('active');
        $('#carousel > div:last-child').addClass('active');
    }
}

function auto_increase() { // Check for time and trigger slideshow if have waited long enough since last click
    slideshow_auto_tracker--;
    
    if ( slideshow_auto_tracker <= 0 ){
      if ( next_right ) {
        next_image();
        slideshow_auto_tracker = settings.carousel_wait_time;
      } else {
        previous_image();
        slideshow_auto_tracker = settings.carousel_wait_time;
      }
    }
  }

setInterval(auto_increase, 1000); // Run time checker script every second