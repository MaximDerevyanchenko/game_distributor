module.exports = function(app) {
	const gameController = require('../controllers/gameController')
	const accountController = require('../controllers/accountController')

	app.route('/api/games')
		.get(gameController.list_games)
		.post(gameController.sync_games)

	app.route('/api/create_game')
		.post(gameController.create_game)

	app.route('/api/game/:game_id')
		.get(gameController.game_info)

	app.route('/api/game/:game_id/players')
		.get(gameController.online_players)

	app.route('/api/login')
		.post(accountController.login)

	app.route('/api/signup')
		.post(accountController.signup)

	app.use(gameController.show_main);
};
