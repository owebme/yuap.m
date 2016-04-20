(function(){

    // Prevent default events
    $document.on('touchmove MSPointerMove', function(e){
        e.preventDefault();
    });
    $window.on('mousewheel', function(e){
        e.preventDefault();
    });
    $window.on('scroll', function(){
        $html.add($body).scrollTop(0);
    });

    $sid = 777;

    riot.mount('*');

})();
