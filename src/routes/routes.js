module.exports = function(app, mongoose, io) {
	require('../models/accountModel')(mongoose)
	require("../models/gameModel.js")(mongoose)
	require('../models/gameCartModel')(mongoose)

	const countryController = require('../controllers/countryController')
	countryController(mongoose, io)
	const accountController = require('../controllers/accountController')
	accountController(mongoose, io)
	const gameController = require('../controllers/gameController')
	gameController(mongoose, io)
	const cartController = require('../controllers/cartController')
	cartController(mongoose, io)
	const wishlistController = require('../controllers/wishlistController')
	wishlistController(mongoose, io)
	const libraryController = require('../controllers/libraryController')
	libraryController(mongoose, io)

	//Countries
	app.route('/api/countries')
		.get(countryController.getCountries)

	//Games
	app.route('/api/games')
		.get(gameController.list_games)
		.post(gameController.searchGame)

	app.route('/api/games/count')
		.get(gameController.countAll)

	app.route('/api/games/create')
		.post(gameController.create_game)

	app.route('/api/games/:name/count')
		.get(gameController.countEntries)

	app.route('/api/games/:gameId/local')
		.get(gameController.game_info)

	app.route('/api/games/:gameId/local_count')
		.get(gameController.local_online_players)

	app.route('/api/games/:gameId/steam')
		.get(gameController.steam_game_info)

	app.route('/api/games/:gameId/steam_count')
		.get(gameController.online_players)

	//Accounts
	app.route('/api/account')
		.post(accountController.login)

	app.route('/api/account/create')
		.post(accountController.signup)

	app.route('/api/account/:username')
		.get(accountController.getAccount)
		.post(accountController.updateMyAccount)
		.patch(accountController.becomeDeveloper)

	app.route('/api/account/:username/state')
		.patch(accountController.changeState)

	app.route('/api/account/:username/developed')
		.get(gameController.getMyGames)

	//Cart
	app.route('/api/account/:username/cart')
		.post(cartController.addToCart)
		.get(cartController.getCart)
		.delete(cartController.deleteManyFromCart)

	app.route('/api/account/:username/cart/:gameId')
		.delete(cartController.deleteFromCart)

	//Friends
	app.route('/api/account/:username/friends')
		.post(accountController.addFriend)
		.get(accountController.getFriends)

	app.route('/api/account/:username/friends/:friend')
		.delete(accountController.removeFriend)

	app.route('/api/account/:username/friends/game/:gameId')
		.get(libraryController.getFriendsWithGame)

	//Friend requests
	app.route('/api/account/:username/friends/requests')
		.get(accountController.getFriendRequests)
		.patch(accountController.acceptFriend)

	app.route('/api/account/:username/friends/requests/:username')
		.delete(accountController.denyFriend)

	app.route('/api/account/:username/friends/pending')
		.get(accountController.getPendingRequests)

	//Library
	app.route('/api/account/:username/library')
		.get(libraryController.getLibrary)
		.post(libraryController.addToLibrary)

	app.route('/api/account/:username/library/gift')
		.post(libraryController.buyForFriend)

	app.route('/api/account/:username/library/:gameId/start')
		.post(libraryController.startGame)

	app.route('/api/account/:username/library/:gameId/close')
		.post(libraryController.closedGame)

	//Wishlist
	app.route('/api/account/:username/wishlist')
		.get(wishlistController.getWishlist)
		.post(wishlistController.addToWishlist)

	app.route('/api/account/:username/wishlist/:gameId')
		.delete(wishlistController.deleteFromWishlist)

	app.use(gameController.show_main)
}
