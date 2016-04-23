var mongoose = require('mongoose');
var db = mongoose.connection;

exports.post = function(req, res, next) {

	var username = req.body.username,
		password = req.body.password;
		
	if (!username || !password) return res.sendStatus(401);
		
	db.collection('users').find({"username": username}).toArray(function(err, data){
		if (err) {
			return next(err);
		}
		else {
			if (data.length){
				var user = data[0];
				if (user.password !== password){
					res.send('<script language="Javascript" type="text/javascript">' +
						'window.parent.postMessage({error: \'Не верный пароль\'}, "*");' +
					'</script>');
				}
				else {
					req.session.user = user;
					res.send('<script language="Javascript" type="text/javascript">' +
						'window.parent.postMessage({result: \'OK\', user: ' + JSON.stringify(user) + '}, "*");' +
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