module.exports = function (mongoose, io) {
	let GameSchema = require("../models/gameModel.js")(mongoose);

	const axios = require('axios')

	module.exports.show_main = function (req, res) {
		res.sendFile(appRoot + '/public/index.html');
	};

	module.exports.list_games = function (req, res) {
		GameSchema.aggregate().sample(10).exec((err, games) => {
			if (err)
				res.send(err)
			res.json(games)
		})
	}

	module.exports.steam_game_info = function (req, res) {
		axios.get("https://store.steampowered.com/api/appdetails?appids=" + req.params.game_id)
			.then(response => res.json(response.data))
			.catch(error => res.send(error))
	}

	module.exports.game_info = function (req, res) {
		GameSchema.findOne({ appid: req.params.game_id})
			.then(response => res.json(response))
			.catch(error => res.send(error.response))
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
		GameSchema.create(req.body)
			.then(game => res.status(201).json(game))
			.catch(err => res.send(err))
	}

}
