var prop = new Properties();
var BlogObject = function(){

  this.noResults = '<div class="col red s12 m6 l6 offset-m3  offset-l3 notfound"><i class="material-icons">sentiment_dissatisfied</i>'+prop.notFound+'</div>' ;
  this.getRandom = function() { return Math.abs(Math.floor(Math.random() * 10));};
  this.coloCodes = [
                      'teal lighten-2',
                      'purple lighten-2',
                      'pink accent-1',
                      'purple darken-4',
                      'blue darken-4',
                      'indigo darken-4',
                      'deep-purple darken-1',
                      'deep-purple darken-4',
                      'green darken-4',
                      'indigo darken-2'
                    ];


    this.registerSearch = function(){
        $('a[id="nav_search"]').on('click', function(event) {
      
            $('#search').addClass('open');
            $('#search > form > input[type="search"]').focus();
        });
    
        $('a.close , a.close i').on('click', function(event) {
               $('#search').removeClass('open');
        });
         
    };//
    this.initLunr = function(){
          console.log('initLunr run');
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
    this.getUnitDiv = function(sdiv , url, title ){
        var _this = this;
        
           var unit = '<div class="col s12 m3 padding-bot-1">'+
                      '<a href="'+url+'" class=" searchItem "><span class="pt-sans">'+title+'</span></a></div>';
        
          $(sdiv).append(unit);

      } // 

   this.displaySearchResults = function (searchCnt,results, store) {

        var _this = this;

        if (results.length) { // Are there any results?
          
          for (var i = 0; i < results.length; i++) {  // Iterate over the results
            var item = store[results[i].ref];
            _this.getUnitDiv(searchCnt,item.url, item.title);
          }

         
        } else {
          $(searchCnt).html(_this.noResults);
        }
      }//end

    this.search = function(){
        var _this = this;
        _this.registerSearch();
        var idx = _this.initLunr();

      $('input.doSearch').on('change keyup', function(){
          var searchTerm = $(this).val();
           $('.searchContainer').html('');
          if (searchTerm) {

              var results = idx.search(searchTerm); // Get lunr to perform a search
              _this.displaySearchResults('.searchContainer', results, data.store); // We'll write this in the next section
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

