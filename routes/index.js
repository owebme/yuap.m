var checkAuth = require('./auth/checkAuth');

module.exports = function(app){

	app.use('/parser', require('./parser'));
	
	app.post('/auth', require('./auth').post);

	app.use('/api/dashboard', checkAuth, require('./api/dashboard'));

	app.use('/api/data/list', checkAuth, require('./api/dataList'));

}