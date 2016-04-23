var iconv = require('iconv-lite');

var utils = {

	convert: function(data, from, to){
		return iconv.encode(iconv.decode(new Buffer(data, 'binary'), from), to).toString();
	}
}

module.exports = utils;
