var libs = process.cwd() + '/libs/';
var utils = require(libs + 'utils');
var mongoose = require('mongoose');
var db = mongoose.connection;

exports.post = function(req, res, next) {

	var username = req.body.username,
		password = req.body.password,
		logined = req.body.logined;
		
	if (!username || !password) return res.sendStatus(401);
		
	db.collection('users').find({"username": username}).toArray(function(err, data){
		if (err) {
			return next(err);
		}
		else {
			if (data.length){
				var user = data[0];
				if (logined === "false" && user.password !== utils.cryptoPass(password) || logined === "true" && user.password !== password){
					res.send('<script language="Javascript" type="text/javascript">' +
						'window.parent.postMessage({error: \'Не верный пароль\'}, "*");' +
					'</script>');
				}
				else {
					var _user = JSON.stringify(user);
					req.session.user = user;
					req.session.user.hash = utils.cryptoHash(user.username, user.password, user.sid);					
					res.send('<script language="Javascript" type="text/javascript">' +
						'window.parent.postMessage({result: \'OK\', user: ' + _user + '}, "*");' +
					'</script>');
				}
			}
			else {
				res.send('<script language="Javascript" type="text/javascript">' +
					'window.parent.postMessage({error: \'Не верный логин и/или пароль\'}, "*");' +
				'</script>');
			}
		}
	});
};