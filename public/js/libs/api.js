var _$api = ['on','one','off','trigger'];
var $api = {
	_stores: [],
	addStore: function(store) {
		this._stores.push(store)
	}
}
_$api.forEach(function(event){
	$api[event] = function() {
		var args = [].slice.call(arguments)
		this._stores.forEach(function(el){
			el[event].apply(null, args)
	    })
	}
})
