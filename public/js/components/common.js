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
