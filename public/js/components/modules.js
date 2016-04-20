(function(sizes){
	// {fn} update sizes
	var updateSizes = function(){
		sizes.width = $window.width();
		sizes.height = parseInt(window.innerHeight,10);
	};
	// {event} window resize
	$window.on('resize.app', updateSizes);
	// init
	updateSizes();
})(app.sizes);

(function(device){

	/* --- Mobile --- */
	device.support = Modernizr;

	/* --- Mobile --- */
	device.isMobile = device.support.touch;
	$html.addClass(device.isMobile ? 'd-mobile' : 'd-no-mobile');

	/* --- Retina --- */
	device.isRetina = (window.devicePixelRatio && window.devicePixelRatio>1);
	$html.addClass(device.isRetina ? 'd-retina' : 'd-no-retina');

	/* --- Phone --- */
	var phoneCheck = function(){
		device.isPhone = (app.sizes.width<768);
		$html.addClass(device.isPhone ? 'd-phone' : 'd-no-phone');
		$html.removeClass(device.isPhone ? 'd-no-phone' : 'd-phone');
	};
	$window.on('resize.phone-check', phoneCheck);
	phoneCheck();

	if (navigator.userAgent.match(/(iPhone)/i)) device.isPhone = true;

	/* --- iOS --- */
	if (navigator.userAgent.match(/iPad/i)) {
		$html.addClass('d-ipad');
		device.isIPad = true;
	};
	if (navigator.userAgent.match(/(iPhone|iPod touch)/i)) {
		$html.addClass('d-iphone');
		device.isIPhone = true;
	};
	if (navigator.userAgent.match(/(iPad|iPhone|iPod touch)/i)) {
		$html.addClass('d-ios');
		device.isIOS = true;
	};
	if (navigator.userAgent.match(/.*CPU.*OS 7_\d/i)) {
		$html.addClass('d-ios7');
		device.isIOS7 = true;
	};

	/* --- iPad (for fix wrong window height) --- */
	if ($html.hasClass('d-ipad d-ios7')) {
		$window.on('resize orientationchange focusout', function(){
			window.scrollTo(0,0);
		});
	};

	/* --- Firefox --- */
	device.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	$html.addClass(device.isFirefox ? 'd-firefox' : 'd-no-firefox');

})(app.device);

(function(effects){
	// light effect
	effects.light = {};
	effects.light.show = function($block, position, size, ratio){
		$block[0].style.opacity = 1;
		$block[0].style[prefixed.transform] = 'translateY(' + Math.round(size-position*size) + 'px) translateZ(0)';
		if (position==0) $block[0].style[prefixed.transform] = 'translateY(110%)';
	};
	effects.light.hide = function($block, position, size, ratio){
		$block[0].style.opacity = (1-position*0.4).toFixed(3);
		$block[0].style[prefixed.transform] = 'translateY(' + Math.round(-(ratio-1)*size - (position*size*0.5)) + 'px) translateZ(0)';
		if (position==1) $block[0].style[prefixed.transform] = 'translateY(-110%)';
		if (position==0) $block[0].style[prefixed.transform] = 'translateY(' + Math.round(-(ratio-1)*size) + 'px) translateZ(0)';
	};
	effects.light.move = function($block, position, size){
		$block[0].style.opacity = 1;
		$block[0].style[prefixed.transform] = 'translateY(' + Math.round(-position*size) + 'px) translateZ(0)';
	};
	// space effect
	effects.space = {};
	effects.space.show = function($block, position){
		$block[0].style.opacity = 0.33+position*0.67;
		var transform = '';
		if (position==0) {
			transform = 'translate3d(110%, 0, 0)';
		} else if (app.device.isPhone) {
			transform = 'perspective(500px) translate3d(' + (-8+8*position) + '%, 0, 0) rotateY(' + (-6+position*6) + 'deg) scale(' + (0.8+position*0.2) + ')';
		} else {
			transform = 'perspective(500px) translate3d(' + (-4+4*position) + '%, 0, 0) scale(' + (0.9+position*0.1) + ')';
			if (!app.device.isFirefox) transform = transform + 'rotateY(' + (-4+position*4) + 'deg)';
		}
		$block[0].style[prefixed.transform] = transform;
	};
	effects.space.hide = function($block, position){
		$block[0].style.opacity = 1;
		$block[0].style[prefixed.transform] = 'translate3d(' + (-100*position) + '%, 0, 0)';
		if (position==1) $block[0].style[prefixed.transform] = 'translate3d(-110%, 0, 0)';
	};
	// fold effect
	effects.fold = {};
	effects.fold.show = function($block, position){
		$block[0].style.opacity = 1;
		$block[0].style[prefixed.transform] = 'translateY(' + (100-position*100) + '%)';
	};
	effects.fold.hide = function($block, position){
		$block[0].style.opacity = 1-position*0.67;
		$block[0].style[prefixed.transform] = 'perspective(500px) translateY(' + (4*position) + '%) rotateX(' + (-position*3) + 'deg) scale(' + (1-position*0.05) + ')';
		if (position==1) $block[0].style[prefixed.transform] = 'translateY(-101%)';
	};
})(app.effects);
