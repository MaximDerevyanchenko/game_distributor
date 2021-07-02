module.exports = function (mongoose, io) {
	const GameSchema = require("../models/gameModel.js")(mongoose)
	const Accounts = mongoose.model('AccountSchema')
	const fs = require('fs')
	const axios = require('axios')

	module.exports.show_main = function (req, res) {
		res.sendFile(appRoot + '/public/index.html');
	};

	module.exports.list_games = function (req, res) {
		GameSchema.aggregate().sample(10).exec()
			.then(games => res.json(games))
			.catch(err => res.send(err))
	}

	module.exports.countEntries = function (req, res) {
		GameSchema.countDocuments({ name: { $regex : req.params.name, $options: 'i' }})
			.then(response => res.json(response))
			.catch(error => res.send(error))
	}

	module.exports.countAll = function (req, res) {
		GameSchema.estimatedDocumentCount()
			.then(response => res.json(response))
			.catch(error => res.send(error))
	}

	module.exports.searchGame = function (req, res) {
		GameSchema.find({ name: { $regex: req.body.name, $options: 'i' } })
			.sort({ name: "asc"})
			.limit(10)
			.skip(10 * (req.body.page - 1))
			.then(response => res.json(response))
			.catch(error => res.send(error))
	}

	module.exports.steam_game_info = function (req, res) {
		axios.get("https://store.steampowered.com/api/appdetails?appids=" + req.params.gameId)
			.then(response => {
				if (response.data[req.params.gameId].success) {
					let result = response.data[req.params.gameId].data
					result.gameId = result.steam_appid
					res.json(result)
				} else
					res.sendStatus(204)
			})
			.catch(error => res.send(error))
	}

	module.exports.game_info = function (req, res) {
		GameSchema.findOne({ gameId: req.params.gameId})
			.then(response => res.json(response))
			.catch(error => res.send(error.response))
	}

	module.exports.local_online_players = function (req, res) {
		Accounts.countDocuments({ inGame: req.params.gameId })
			.then(response => res.json(response))
			.catch(error => res.send(error))
	}

	module.exports.online_players = function (req, res) {
		axios.get("https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=" + req.params.gameId)
			.then(response => res.send(response.data.response))
			.catch(error => res.send(error.response.data.response))
	}

	module.exports.sync_games = function (req, res) {
		axios.get("https://api.steampowered.com/ISteamApps/GetAppList/v2/")
			.then(response => {
				console.log(response)
				var fs = require('fs')
				fs.writeFile('games.json', JSON.stringify(response.data.applist), function (err, result) {
					console.log(err, result)
				})
				// response.data.applist.apps.forEach(game => {
				// 	axios.post('http://localhost:3000/api/create_game', game)
				// 		.then(response => {
				// 			console.log(response)
				// 		})
				// 		.catch(error => console.log(error))
				// })
			})
			.catch(error => console.log(error))
	}

	module.exports.create_game = function (req, res) {
		GameSchema.findOne({ isLocal: true }, {}, { sort: { gameId: "desc"}})
			.then(lastInserted => {
				if (lastInserted === null)
					req.body.gameId = 1
				else
					req.body.gameId = lastInserted.gameId + 1
				const header = req.files.header_image
				req.body.header_image = header ? header.name : ""
				const gamePath = './public/img/' + req.body.gameId
				if (header)
					fs.mkdir(gamePath, err => {
						if (err != null)
							res.send(err)
						else
							fs.rename(header.path, gamePath + '/' + header.name, err => {
								if (err != null)
									res.send(err)
							})
					})
				GameSchema.create(req.body)
					.then(game => res.status(201).json(game))
					.catch(err => res.send(err))
				}
			)
			.catch(err => res.send(err))
	}

	module.exports.getMyGames = function (req, res) {
		GameSchema.find({ developer: req.cookies.username })
			.then(games => res.json(games))
			.catch(err => res.send(err))
	}
}
