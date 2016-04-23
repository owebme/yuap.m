var libs = process.cwd() + '/libs/';
var config = require(libs + 'config');
var crypto = require('crypto');
var iconv = require('iconv-lite');

var utils = {

	convert: function(data, from, to){
		return iconv.encode(iconv.decode(new Buffer(data, 'binary'), from), to).toString();
	},
	
	cryptoPass: function(pass){
		return crypto.createHash('sha256').update(pass + "." + config.get('session:secret')).digest('hex');
	},

	cryptoHash: function(username, pass, sid){
		return crypto.createHash('sha256').update(username + "." + pass + "." + sid).digest('hex');
	},
	
	cryptoCheck: function(username, pass, sid, hash){
		if (crypto.createHash('sha256').update(username + "." + pass + "." + sid).digest('hex') !== hash){
			return false;
		}
		else {
			return true;
		}
	}	
	
}

module.exports = utils;
