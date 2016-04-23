var libs = process.cwd() + '/libs/';
var utils = require(libs + 'utils');

module.exports = function(req, res, next) {

	if (!req.session.user
		|| req.session.user && (!req.session.user.sid
		|| !utils.cryptoCheck(req.session.user.username, req.session.user.password, req.session.user.sid, req.session.user.hash))) return res.sendStatus(401);
	
	next();

};