/* --- App interface --- */
var app = {
	effects: {},
	sizes: {},
	utils: {},
	plugins: {},
	device: {},
	stores: {}
};

/* --- Root blocks --- */
var $root = null,
	$html = $('html'),
    $body = $('body'),
    $document = $(document),
    $window = $(window),
    $sections = null,
	$io = null,
	$sid = null,
	$apiUri = 'http://192.168.1.68:8080/api/',
	clickEvent = document && 'ontouchstart' in document.documentElement ? 'tap' : 'click';

var $$ = window.Zepto || window.jQuery;

tempus.lang('ru');

/* --- Prefixed styles --- */
var prefixed = {
	'transform': Modernizr.prefixed('transform'),
	'transform-origin': Modernizr.prefixed('transformOrigin')
};

/*** --- Dataset helper --- ***/
$.fn.api = function(key){
	return this.data(key) ? this.data(key) : this.data(key, {}).data(key);
};

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

app.plugins.marquee = function($frame, settings){
	var $screens = $frame.find(settings.screens),
		$fake = $('<div class="'+settings.spaceClass+'" />').prependTo($frame),
		screens = [],
		effect = app.effects[settings.effect],
		overlayed = false,
		name = $frame.data('name');
	// marquee
	var marquee = {
		index: 0,
		prevIndex: 0,
		progress: 0,
		size: 0,
		scrolling: false,
		enabled: true,
		section: null
	};
	// screens
	$screens.each(function(i){
		var $block = $(this);
		// api
		var api = $block.api('screen');
		api.state = {
			isVisible: false,
			isEndShow: false,
			isStartShow: false,
			isFullShow: false,
			isFullHide: true
		};
		// screen
		var screen = {
			index: i,
			block: $block,
			fake: $('<div class="'+settings.spaceClass+'__screen" />'),
			api: api,
			ratio: 1
		};
		// save screen
		screens.push(screen);
		// decor
		//if (i && settings.nextClass) $block.addClass(settings.nextClass);
		$fake.append(screen.fake);
	});
	// {fn} resize fake
	var resize = function(){
		var offset = 0;
		marquee.size = settings.vertical ? app.sizes.height : app.sizes.width;
		$.each(screens, function(i, screen){
			if (settings.vertical){
				var height = Math.max(screen.block.outerHeight(), screen.block.find('.screen__frame').outerHeight());
				if (i>0 && height>marquee.size) {
					screen.block.addClass('screen_long');
					screen.size = height;
				} else {
					screen.block.removeClass('screen_long');
					screen.size = app.sizes.height;
				}
				screen.fake.width(app.sizes.width);
				screen.fake.height(screen.size);
			} else {
				screen.size = app.sizes.width;
				screen.fake.width(screen.size);
				screen.fake.height(app.sizes.height);
			}
			screen.offset = offset;
			screen.ratio = screen.size/marquee.size;
			offset += screen.size;
		});
	};
	resize();
	// scroll
	var scroll = new IScroll($frame[0], {
		marquee: true,
		disableMouse: false,
		mouseWheel: settings.mousewheel,
		scrollX: !settings.vertical,
		scrollY: settings.vertical,
		bounce: true,
		snap: '.'+settings.spaceClass+'__screen',
		eventPassthrough: settings.vertical ? 'horizontal' : true,
		probeType: 3,
		snapSpeed: settings.duration,
		preventDefault: true,
		scrollbars: settings.vertical ? 'custom' : false,
		interactiveScrollbars: settings.vertical && !app.device.support.touch,
		fake: true
	});
	// {fn} set limits
	marquee.setLimits = function(index){
		index = Math.min(Math.max(0, index), screens.length-1);
		var isLast = index >= screens.length-1,
			isFirst = index==0;
		// min limit
		scroll[settings.vertical ? 'minScrollY' : 'minScrollX'] = -screens[index].offset + (isFirst ? 0 : screens[index-1].size);
		// max limit
		scroll[settings.vertical ? 'maxScrollY' : 'maxScrollX'] = -screens[index].offset - (isLast ? screens[index].size-marquee.size : screens[index].size);
		// set current page
		scroll.currentPage = { x:0, y:0, pageX:0, pageY:0 };
		scroll.currentPage[settings.vertical ? 'y' : 'x'] = -screens[index].offset;
		scroll.currentPage[settings.vertical ? 'pageY' : 'pageX'] = index;
	};
	// {fn} update params
	marquee.update = function(){
		var position = -Math.round(scroll[settings.vertical ? 'y' : 'x']),
			index = 0;
		// get screen index
		for (var i=0; i<screens.length; i++) {
			if (position >= screens[i].offset) index = i;
		};
		// position
		marquee.position = (position-screens[index].offset) / screens[index].size;
		// progress
		marquee.progress = index+marquee.position;
		// indexes
		if (marquee.index!=index) {
			marquee.prevIndex = marquee.index;
			marquee.index = index;
		};
	};
	// {fn} hide invisibles
	marquee.hideInvisibles = function(){
		for (var i=0; i<screens.length; i++) {
			if (i!=marquee.index && i!=marquee.index+1) {
				if (i>marquee.index+1) effect.show(screens[i].block, 0, marquee.size, screens[i].ratio);
				if (i<marquee.index) effect.hide(screens[i].block, 1, marquee.size, screens[i].ratio);
				screens[i].block[0].style.display = 'none';
			}
		};
	};
	// {fn} hide invisibles
	marquee.callScreensAPI = function(){
		var isLast = marquee.index>=screens.length-1,
			ratio = 1 / screens[marquee.index].ratio,
			position = { top:0, bottom:0 };
		// position
		position.top = marquee.position / ratio;
		position.bottom = marquee.position*screens[marquee.index].ratio - (screens[marquee.index].ratio - 1);
		// show and hide
		if (position.bottom>0.6) {
			if (screens[marquee.index].api.state.isVisible) {
				screens[marquee.index].api.state.isVisible = false;
				screens[marquee.index].block.triggerHandler('hide');
			}
			if (!isLast && !screens[marquee.index+1].api.state.isVisible) {
				screens[marquee.index+1].api.state.isVisible = true;
				screens[marquee.index+1].block.triggerHandler('show');
			}
		} else if (position.top>0.4) {
			if (screens[marquee.index] && !screens[marquee.index].api.state.isVisible) {
				screens[marquee.index].api.state.isVisible = true;
				screens[marquee.index].block.triggerHandler('show');
			}
			if (!isLast && screens[marquee.index+1].api.state.isVisible) {
				screens[marquee.index+1].api.state.isVisible = false;
				screens[marquee.index+1].block.triggerHandler('hide');
			}
		}
		// show start and end of next screen
		if (!isLast) {
			if (position.bottom>0.1 && !screens[marquee.index+1].api.state.isStartShow) {
				screens[marquee.index+1].api.state.isStartShow = true;
				screens[marquee.index+1].block.triggerHandler('startShow');
			} else if (position.bottom<0.1 && screens[marquee.index+1].api.state.isStartShow) {
				screens[marquee.index+1].api.state.isStartShow = false;
			}
			if (position.bottom>0.9 && !screens[marquee.index+1].api.state.isEndShow) {
				screens[marquee.index+1].api.state.isEndShow = true;
				screens[marquee.index+1].block.triggerHandler('endShow');
			} else if (position.bottom<0.9 && screens[marquee.index+1].api.state.isEndShow) {
				screens[marquee.index+1].api.state.isEndShow = false;
			}
		}
		// show start and end of current screen
		if (screens[marquee.index] && position.bottom<0.9 && !screens[marquee.index].api.state.isEndShow) {
			screens[marquee.index].api.state.isEndShow = true;
			screens[marquee.index].block.triggerHandler('endShow');
		} else if (screens[marquee.index] && position.bottom>0.9 && screens[marquee.index].api.state.isEndShow) {
			screens[marquee.index].api.state.isEndShow = false;
		}
		if (screens[marquee.index] && position.bottom<0.1 && !screens[marquee.index].api.state.isStartShow) {
			screens[marquee.index].api.state.isStartShow = true;
			screens[marquee.index].block.triggerHandler('startShow');
		} else if (screens[marquee.index] && position.bottom>0.1 && screens[marquee.index].api.state.isStartShow) {
			screens[marquee.index].api.state.isStartShow = false;
		}
		// full show
		if (screens[marquee.index] && position.top>=0 && position.bottom<=0) {
			if (!screens[marquee.index].api.state.isFullShow) {
				screens[marquee.index].api.state.isFullShow = true;
				screens[marquee.index].block.triggerHandler('fullShow');
			};
			for (var i=0; i<screens.length; i++) {
				if (i!=marquee.index) screens[i].api.state.isFullShow = false;
			};
		} else {
			for (var i=0; i<screens.length; i++) {
				screens[i].api.state.isFullShow = false;
			};
		};
		var visible = [Math.floor(marquee.progress), Math.ceil(marquee.progress)];
		// full hide
		for (var i=0; i<screens.length; i++) {
			if (i==visible[0] || i==visible[1]) {
				screens[i].api.state.isFullHide = false;
				screens[i].block[0].style.display = 'block';
				marquee.section = screens[i].block.attr("data-marquee");
				//if (settings.activeClass) screens[i].block.addClass(settings.activeClass);
			} else if (!screens[i].api.state.isFullHide) {
				screens[i].block[0].style.display = 'none';
				screens[i].block.triggerHandler('fullHide');
				screens[i].api.state.isFullHide = true;
				//if (settings.activeClass) screens[i].block.removeClass(settings.activeClass);
			}
		}
	};
	// mark nav
	marquee.markNav = function(){
		if (settings.navPrev) settings.navPrev[marquee.progress<=0.5 ? 'addClass' : 'removeClass']('i-disabled');
		if (settings.navNext) settings.navNext[marquee.progress>=screens.length-1.5 ? 'addClass' : 'removeClass']('i-disabled');
	};
	// redraw
	marquee.draw = function(){
		if (!effect.move || screens[marquee.index].ratio*marquee.position >= screens[marquee.index].ratio-1) {
			var position = 1-Math.abs(screens[marquee.index].ratio*marquee.position-screens[marquee.index].ratio);
			if (marquee.index>=0) effect.hide(screens[marquee.index].block, position, marquee.size, screens[marquee.index].ratio);
			if (marquee.index<screens.length-1) effect.show(screens[marquee.index+1].block, position, marquee.size, screens[marquee.index+1].ratio);
		} else {
			if (marquee.index>=0) effect.move(screens[marquee.index].block, screens[marquee.index].ratio*marquee.position, marquee.size, screens[marquee.index].ratio);
			if (marquee.index<screens.length-1) effect.show(screens[marquee.index+1].block, 0, marquee.size, screens[marquee.index+1].ratio);
		}
		// hide invisibles
		marquee.hideInvisibles();
		// mark nav buttons
		marquee.markNav();
	};
	// {fn} on scroll start
	marquee.onScrollStart = function(){
		marquee.scrolling = true;
	};
	// {fn} on scroll
	marquee.onScroll = function(){
		index = 0;
		marquee.update();
		marquee.draw();
		marquee.callScreensAPI();
		if (scroll.moved) {
			var position = scroll[settings.vertical ? 'y' : 'x'] - scroll[settings.vertical ? 'pointY' : 'pointX'];
			for (var i=0; i<screens.length; i++) {
				if (position <= -screens[i].offset && position >= -screens[i].offset-screens[i].size) index = i;
			};
			marquee.setLimits(index);
		} else if (scroll.indicators && scroll.indicators[0].moved) {
			for (var i=0; i<screens.length; i++) {
				if (scroll[settings.vertical ? 'y' : 'x']-marquee.size/2 <= -screens[i].offset && scroll[settings.vertical ? 'y' : 'x']+marquee.size/2 >= -screens[i].offset-screens[i].size) index = i;
			};
			marquee.setLimits(index);
		};
	};
	// interactive
	marquee.grabTimer = false;
	var interactiveStart = function(){
		clearTimeout(marquee.grabTimer);
		if (!marquee.scrolling) {
			//$frame.addClass('i-scrolling');
			marquee.scrolling = true;
		}
	};
	var interactiveEnd = function(){
		if (marquee) clearTimeout(marquee.grabTimer);
		if (marquee && marquee.scrolling) {
			//$frame.removeClass('i-scrolling');
			marquee.scrolling = false;
		}
	};
	scroll.on('beforeWheelSnap', function(){
		index = 0;
		for (var i=0; i<screens.length; i++) {
			if (scroll[settings.vertical ? 'y' : 'x']-marquee.size/2 <= -screens[i].offset && scroll[settings.vertical ? 'y' : 'x']+marquee.size/2 >= -screens[i].offset-screens[i].size) index = i;
		};
		scroll.absStartX = settings.vertical ? 0 : -screens[index].offset;
		scroll.absStartY = -settings.vertical ? -screens[index].offset : 0;
		marquee.setLimits(index);
	})
	// {fn} on scroll end
	marquee.onScrollEnd = function(){
		marquee.refresh();
	};
	// {fn} refresh
	marquee.refresh = function(){
		marquee.update();
		marquee.draw();
		marquee.callScreensAPI();
		marquee.setLimits(marquee.index);
	};
	// {fn} resize
	marquee.resize = function(){
		if (!marquee) return false;
		$body.addClass('page_resize');
		resize();
		scroll.refresh();
		marquee.refresh();
		$body.removeClass('page_resize');
	};
	// {fn} enable
	marquee.enable = function(){
		marquee.enabled = true;
		scroll.enable();
		marquee.enableKeyboard();
	};
	// {fn} disable
	marquee.disable = function(){
		marquee.enabled = false;
		scroll.disable();
		marquee.disableKeyboard();
	};
	// {event} scroll start
	scroll.on('scrollStart', function(){
		if (!marquee) return false;
		marquee.onScrollStart();
	});
	// {event} scroll move
	scroll.on('scroll', function(){
		if (!marquee) return false;
		marquee.onScroll();
		if (scroll.moved) interactiveStart();
	});
	// {event} scroll end
	scroll.on('scrollEnd', function(){
		if (!marquee) return false;
		marquee.onScrollEnd();
		interactiveEnd();
	});
	// {event} grab
	scroll.on('grab', function(){
		if (!marquee) return false;
		// interavtive
		interactiveStart();
		marquee.grabTimer = setTimeout(function(){
			if (scroll) scroll.reset();
			interactiveEnd();
		}, 500);
		// update
		var index = 0,
			position = scroll[settings.vertical ? 'y' : 'x'] - scroll[settings.vertical ? 'pointY' : 'pointX'];
		for (var i=0; i<screens.length; i++) {
			if (position <= -screens[i].offset && position >= -screens[i].offset-screens[i].size) index = i;
		};
		marquee.setLimits(index);
	});
	// {event} window resize
	$window.on('resize', marquee.resize);
	// set limits on first screen
	marquee.setLimits(0);
	// {fn} scroll to
	marquee.scrollTo = function(index, duration){
		duration = duration === undefined && duration !== 0 ? 450 : duration;
		screens[index].block[0].style.display = 'block';
		setTimeout(function(){
			scroll.goToPage(!settings.vertical ? index : 0, settings.vertical ? index : 0, duration, IScroll.utils.ease.cubicOut);
			if (duration==0) marquee.refresh();
		}, 0);
	};
	// {fn} prev
	marquee.prev = function(duration){
		if (marquee.scrolling) return false;
		duration = duration===undefined ? settings.duration : duration;
		var remaining = (-scroll.y - screens[marquee.index].offset);
		if (settings.vertical && remaining) {
			scroll.scrollBy(0, Math.min(remaining, marquee.size), duration, IScroll.utils.ease.cubicOut);
		} else if (settings.vertical && scroll.y<=-marquee.size) {
			scroll.scrollBy(0, marquee.size, duration, IScroll.utils.ease.cubicOut);
		} else if (marquee.index>0) {
			scroll.prev(duration, IScroll.utils.ease.cubicOut);
		}
	};
	// {fn} next
	marquee.next = function(duration){
		if (marquee.scrolling) return false;
		duration = duration===undefined ? settings.duration : duration;
		var remaining = (screens[marquee.index].offset + screens[marquee.index].size) - (-scroll.y + marquee.size)
		if (remaining>marquee.size*0.1 && settings.vertical) {
			scroll.scrollBy(0, -Math.min(remaining, marquee.size), duration, IScroll.utils.ease.cubicOut);
		} else if (marquee.index<screens.length-1) {
			scroll.next(duration, IScroll.utils.ease.cubicOut);
		}
	};
	// {fn} get marquee param
	marquee.get = function(parameter){
		return marquee[parameter];
	};
	marquee.destroy = function(){
		$frame.find('.'+settings.spaceClass).remove();
		$frame.removeData('marquee');
		scroll.destroy();
		scroll = null;
		marquee = null;
	};
	// scroll
	if (settings.vertical) {
		var $scroll = $frame.find('.iScrollVerticalScrollbar');
		$scroll.addClass('ui-scroll').prepend('<div class="ui-scroll__bar" />');
		$scroll.find('.iScrollIndicator').addClass('ui-scroll__handle').prepend('<div class="ui-scroll__handle__inner" />');
	};
	// {event} click on prev
	if (settings.navPrev) settings.navPrev.on('click', function(){
		marquee.prev();
	});
	// {event} click on next
	if (settings.navNext) settings.navNext.on('click', function(){
		marquee.next();
	});
	// {event} enable keyboard
	var keyboardEventName = 'keydown.marquee-' + (name ? name : '') + (settings.vertical ? 'v' : 'h');
	marquee.enableKeyboard = function(){
		if (!app.device.support.touch) $document.on(keyboardEventName, function(e){
			if (!$(e.target).is('input,textarea,select') && !app.content.opened) {
				if (e.which==(settings.vertical ? 38 : 37)) marquee.prev();
				if (e.which==(settings.vertical ? 40 : 39)) marquee.next();
			}
		});
	};
	// {event} disable keyboard
	marquee.disableKeyboard = function(){
		if (!app.device.support.touch) $document.off(keyboardEventName);
	};

	marquee.scroll = scroll;

	// api
	$frame.data('marquee', {
		screens: screens,
		onScrollStart: $.noop,
		onScrollEnd: $.noop,
		scrollTo: marquee.scrollTo,
		get: marquee.get,
		scroll: scroll,
		update: marquee.onScroll,
		resize: marquee.resize,
		enable: marquee.enable,
		disable: marquee.disable,
		destroy: marquee.destroy,
		enableKeyboard: marquee.enableKeyboard,
		disableKeyboard: marquee.disableKeyboard
	});

	return marquee;
};

(function(){

    app.sections = {

        ready: false,

        items: {},

        state: null,

        init: function(section){

            $sections = $body.find('#sections');

            $sections.on('dragstart selectstart', function() {
                return false;
            });

            var index = 100,
                i = 0;

            $sections.find(".section__marquee").each(function() {
                _this.items[this.getAttribute("data-marquee")] = i;
                if (i === 0) {
                    _this.state = this.getAttribute("data-marquee");
                    this.style.opacity = "1";
                }
                this.style.zIndex = index;
                index--;
                i++;
            });

            _this.marquee = app.plugins.marquee($sections, {
                vertical: false,
                screens: '.section__marquee',
                effect: 'space',
                mousewheel: false,
                spaceClass: 'horizontal-space',
                duration: app.device.isPhone ? 350 : 450
            });

            var scroll = _this.marquee.scroll;

            scroll.on('scrollEnd', function(){
                _this.state = _this.marquee.section;
                if (_this.state === "dashboard"){
                    app.iScrollDashboardList.refresh();
                }
                else if (_this.state === "data"){
                    app.iScrollDataList.refresh();
                }
            });

            if (section) _this.nav(section, 0);
        },

        nav: function(section, duration){
            if (!section) return;
            var i = _this.items[section];
            if (i !== undefined) {
                _this.state = section;
                _this.marquee.scrollTo(i, duration !== undefined ? duration : undefined);
            }
        }
    };

    var _this = app.sections;

})();

(function(utils){

	utils.random = function(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	};

	utils.raf = function(callback){
		var func = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame;
		if (func) {
			return func(callback);
		} else {
			return window.setTimeout(callback, 1000 / 60);
		}
	};

	utils.caf = function(frame){
		var func = window.cancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
		func(frame);
		frame = null;
	};

	utils.support = {transitions: Modernizr.csstransitions},
	utils.transEndEventNames = {'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend'};
	utils.transEndEventName = utils.transEndEventNames[Modernizr.prefixed('transition')];
	utils.animEndEventNames = {'WebkitAnimation': 'webkitAnimationEnd', 'MozAnimation': 'animationend', 'OAnimation': 'oAnimationEnd', 'msAnimation': 'MSAnimationEnd', 'animation': 'animationend'};
	utils.animEndEventName = utils.animEndEventNames[Modernizr.prefixed('animation')];

	utils.onEndTransition = function(el, callback){
		var onEndCallbackFn = function( ev ) {
			if ( utils.support.transitions ) {
				if( ev.target != this ) return;
				this.removeEventListener( utils.transEndEventName, onEndCallbackFn );
			}
			if( callback && typeof callback === 'function' ) { callback.call(this); }
		};
		if( utils.support.transitions ) {
			el.addEventListener( utils.transEndEventName, onEndCallbackFn );
		}
		else {
			onEndCallbackFn();
		}
	};

	utils.onEndAnimation = function(el, callback){
		var onEndCallbackFn = function( ev ) {
			if ( utils.support.transitions ) {
				if( ev.target != this ) return;
				this.removeEventListener( utils.animEndEventName, onEndCallbackFn );
			}
			if( callback && typeof callback === 'function' ) { callback.call(this); }
		};
		if( utils.support.transitions ) {
			el.addEventListener( utils.animEndEventName, onEndCallbackFn );
		}
		else {
			onEndCallbackFn();
		}
	};

	utils.getScroll = function(scroll) {
        var x = scroll.x * -1,
            y = scroll.y * -1,
			maxX = scroll.maxScrollX * -1,
			maxY = scroll.maxScrollY * -1;
        return {x: x, y: y, maxX: maxX, maxY: maxY};
    };

})(app.utils);
