(function($){
  $(function(){

  	$(".dropdown-button").dropdown();
  	$(".dropdown-content").css("width","300px");
    $('.button-collapse').sideNav();

    $('span.datetime').html(timeSince($("span.datetime").html()));

    console.log($('span.datetime').html());

	 
  }); // end of document ready
})(jQuery); // end of jQuery name space



function timeSince(date) {

    var seconds = Math.floor((new Date() - new Date(date)) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
    	if(interval/7 > 1)
    		 return Math.floor(interval/7) + " weeks ago";
    	else if(interval/7 == 1 || (interval/7 > 1 && interval/7 < 2 ))
    		return Math.floor(interval/7) + " week ago"
    	else  		
        	return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}