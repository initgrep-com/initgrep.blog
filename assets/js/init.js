(function($){
  $(function(){

  	$(".dropdown-button").dropdown();
  	$(".dropdown-content").css("width","300px");
    $('.button-collapse').sideNav();
    formatAuthor();
	 
  }); // end of document ready
})(jQuery); // end of jQuery name space


var formatAuthor = function(){
  
    var author="";
      $.each($('.author-text h3').html().split(' '), function( index, value ) {
        console.log( index + ": " + value );
         author+= value.charAt(0); 
      });
      $('.author-text h3').html(author);
};