module.exports = function(app) {
	const gameController = require('../controllers/gameController')
	const accountController = require('../controllers/accountController')
	const cartController = require('../controllers/cartController')
	const libraryController = require('../controllers/libraryController')

	app.route('/api/games')
		.get(gameController.list_games)
		.post(gameController.sync_games)

	app.route('/api/create_game')
		.post(gameController.create_game)

	app.route('/api/game/:game_id')
		.get(gameController.game_info)

	app.route('/api/game/:game_id/players')
		.get(gameController.online_players)

	app.route('/api/account/login')
		.post(accountController.login)

	app.route('/api/account/signup')
		.post(accountController.signup)

	app.route('/api/account/cart')
		.post(cartController.addToCart)
		.get(cartController.getCart)

	app.route('/api/account/cart/:gameId')
		.delete(cartController.deleteFromCart)

	app.route('/api/account/library')
		.post(libraryController.addToLibrary)
		.get(libraryController.getLibrary)

	app.use(gameController.show_main)
}
