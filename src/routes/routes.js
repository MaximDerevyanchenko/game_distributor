module.exports = function(app, mongoose, io) {
	const accountController = require('../controllers/accountController')
	accountController(mongoose, io)
	const gameController = require('../controllers/gameController')
	gameController(mongoose, io)
	const cartController = require('../controllers/cartController')

	const wishlistController = require('../controllers/wishlistController')
	wishlistController(mongoose, io)
	const libraryController = require('../controllers/libraryController')
	libraryController(mongoose, io)
	const countryController = require('../controllers/countryController')
	countryController(mongoose, io)

	app.route('/api/countries')
		.get(countryController.getCountries)

	app.route('/api/games')
		.get(gameController.list_games)
		.post(gameController.searchGame)

	app.route('/api/games/count')
		.get(gameController.countAll)

	app.route('/api/create_game')
		.post(gameController.create_game)

	app.route('/api/game/:gameId/count')
		.get(gameController.countPages)

	app.route('/api/game/:gameId')
		.get(gameController.game_info)

	app.route('/api/steam_game/:gameId')
		.get(gameController.steam_game_info)

	app.route('/api/steam_game/:gameId/players')
		.get(gameController.online_players)

	app.route('/api/account/login')
		.post(accountController.login)

	app.route('/api/account')
		.post(accountController.updateMyAccount)
		.patch(accountController.becomeDeveloper)

	app.route('/api/account/state')
		.patch(accountController.changeState)

	app.route('/api/account/signup')
		.post(accountController.signup)

	app.route('/api/account/cart')
		.post(cartController.addToCart)
		.get(cartController.getCart)

	app.route('/api/account/friends')
		.post(accountController.addFriend)

	app.route('/api/account/friends/:username')
		.get(accountController.getFriends)

	app.route('/api/account/friends/:friend')
		.delete(accountController.removeFriend)

	app.route('/api/account/friendRequests')
		.get(accountController.getFriendRequests)
		.patch(accountController.acceptFriend)

	app.route('/api/account/pendingRequests')
		.get(accountController.getPendingRequests)

	app.route('/api/account/cart/:gameId')
		.delete(cartController.deleteFromCart)

	app.route('/api/account/library/')
		.post(libraryController.addToLibrary)//TODO apportare le modifiche all'utilizzo di addToLibrary (considerando username nel path)

	app.route('/api/account/library/gift')
		.post(libraryController.buyForFriend)

	app.route('/api/account/library/:username')
		.get(libraryController.getLibrary)

	app.route('/api/account/wishlist/:gameId')
		.delete(wishlistController.deleteFromWishlist)

	app.route('/api/account/wishlist')
		.post(wishlistController.addToWishlist)

	app.route('/api/account/wishlist/:username')
		.get(wishlistController.getWishlist)

	app.route('/api/account/:username')
		.get(accountController.getAccount)

	app.use(gameController.show_main)
}
