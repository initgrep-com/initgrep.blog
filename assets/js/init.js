var BlogObject = function(){


    this.registerSearch = function(){
        $('a[href="#search"]').on('click', function(event) {
      
            event.preventDefault();
            $('#search').addClass('open');
            $('#search > form > input[type="search"]').focus();
        });
    
        $('a.close , a.close i').on('click', function(event) {
               $('#search').removeClass('open');
        });
         $('body').on('keyup', function(e) {
             console.log("keycode ",e.keyCode);
            e.keyCode == 27 ? $('#search').removeClass('open') : '';
        });
    

    };//
    this.initLunr = function(){

        // Initalize lunr with the fields it will be searching on. I've given title
              // a boost of 10 to indicate matches on this field are more important.
              var idx = lunr(function () {
                this.field('id');
                this.field('title', { boost: 10 });
                this.field('author');
                this.field('category');
                this.field('meta');
              });

              for (var key in data.store) { // Add the data to lunr
                idx.add({
                  'id': key,
                  'title': data.store[key].title,
                  'author': data.store[key].author,
                  'category': data.store[key].category,
                  'category': data.store[key].meta
                });

              }//endfor
                
            return idx;

    }//
    this.getUnitDiv = function(sdiv , author, category, title, url, meta ){

        var unit = '<div class="col s12 m3">'
            +'<div class="card blue-grey darken-1">'
            +'<div class="card-content white-text">'
            +'<a class="card-title" href ="'+ url +'">'+title +'</h5>'
            +'<p>'+meta+'</p>'
            '+</div></div></div>';

          $(sdiv).append(unit);
      } // 

   this.displaySearchResults = function (searchCnt,results, store) {

        var _this = this;

        if (results.length) { // Are there any results?
         

          for (var i = 0; i < results.length; i++) {  // Iterate over the results
            var item = store[results[i].ref];
            _this.getUnitDiv(searchCnt,item.author,item.category, item.title, item.url, item.meta);
          }

         
        } else {
          $(searchCnt).html( '<b>No results found</b>' );
        }
      }//end

    this.search = function(){
        var _this = this;
        _this.registerSearch();
        var idx = _this.initLunr();

        $('input.doSearch').on('change keyup', function(){
          var searchTerm = $(this).val();
           $('.searchContainer').html(searchTerm);
            
           if (searchTerm) {
  
             
                var results = idx.search(searchTerm); // Get lunr to perform a search
                _this.displaySearchResults('.searchContainer', results, data.store); // We'll write this in the next section
               console.log('results',results);
               //$('.searchContainer').html("results  "+results); 

            }

        });

    }//end

    this.initBlog = function(){

        $(".dropdown-button").dropdown();
        $(".dropdown-content").css("width","300px");
         //$('span.datetime').html(timeSince($("span.datetime").html()));

          $('.button-collapse').sideNav({
              menuWidth: 300, // Default is 240
              edge: 'left', // Choose the horizontal origin
              closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
              draggable: true // Choose whether you can drag to open on touch screens
        });
    }; //

    this.getSFireOptions = function(){

        $('#index-banner,.subHomeBanner').css('opacity',"1");

       return [
      
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

    };

};
  



(function($){
  $(function(){

  	  var blog = new BlogObject();
      blog.initBlog();
      var options = blog.getSFireOptions();
      Materialize.scrollFire(options);
      blog.search();

  }); // end of document ready
})(jQuery); // end of jQuery name space

