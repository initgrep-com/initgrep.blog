(function($){
  $(function(){

  	$(".dropdown-button").dropdown();
  	$(".dropdown-content").css("width","300px");
     //$('span.datetime').html(timeSince($("span.datetime").html()));

      $('.button-collapse').sideNav({
          menuWidth: 300, // Default is 240
          edge: 'left', // Choose the horizontal origin
          closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
          draggable: true // Choose whether you can drag to open on touch screens
    }
  );

      $('#index-banner,.subHomeBanner').css('opacity',"1");

      var options = [
      
          {selector: '#topPosts', offset: 120, callback: function(el) {
            console.log("fire !!!");
             $('#topPosts').css('opacity',"1");
          } },
          {selector: '.code-wrapper', offset: 200, callback: function(el) {
            console.log("fire !!!");
             $('.code-wrapper').css('opacity',"1");
          } },
           {selector: '.fit-wrapper', offset: 400, callback: function(el) {
            console.log("fire !!!");
             $('.fit-wrapper').css('opacity',"1");
          } }
  ];

  Materialize.scrollFire(options);

	 
  }); // end of document ready
})(jQuery); // end of jQuery name space


