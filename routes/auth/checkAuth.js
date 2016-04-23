module.exports = function(req, res, next) {

	if (!req.session.user || req.session.user && !req.session.user.sid) return res.sendStatus(401);
	
	next();

};