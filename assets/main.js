/* Main .js for Aggresso Render Process*/

/* Carousel Operator */
carousel_items = remote.getGlobal('carousel_items')


$.each(carousel_items , function(index, val) { 
    $('#carousel').append("<div style=\"background: url('carousel/" +  val + "')\"></div>")
    
    console.log(index, val)
});