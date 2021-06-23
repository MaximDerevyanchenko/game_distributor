const Library = {
    data() {
        return {
            games: [],
            friends: [],
            friendsInGame: [],
            gameStarted: -1,
            gamePlaying: ""
        }
    },
    template: `
        <div>
            <p>Library</p>
            <div class="d-flex w-75 justify-content-center">
                <ul class="nav nav-pills flex-column w-25 me-auto" role="tablist">
                    <li class="nav-item" role="presentation" v-for="game in games">
                        <button @click="getFriendsWithGame(game.steam_appid)" role="tab" class="nav-link w-100" data-bs-toggle="pill" :data-bs-target="'#g' + game.steam_appid">{{ game.name }}</button>
                    </li>
                </ul>
                <div ref="tab_content" class="tab-content border bg-secondary p-2 w-75 invisible">
                    <div v-for="game in games" class="tab-pane fade card bg-primary" role="tabpanel" :id="'g' + game.steam_appid">
                        <img :src="game.header_image" alt="game.name" class="w-100">
                        <div class="p-3">
                            <div class="d-flex justify-content-between">
                                <router-link :to="{ name: 'Game', params: { gameId: game.steam_appid } }"><h4 class="text-light">{{ game.name }}</h4></router-link>
                                <p class="text-light">Time played: {{ game.timePlayed }}</p>
                            </div>
                            <button v-if="gamePlaying != game.steam_appid" @click="startGame(game.steam_appid)" class="btn btn-outline-light">Start Game</button>
                            <button v-else @click="stopGame" class="btn btn-outline-light">Stop Game</button>
                            <h5 class="mt-5 text-light">Friends in game</h5>
                            <ul class="list-unstyled">
                                <li v-for="friend in friendsInGame">
                                    <router-link :to="{ name: 'Profile', params: { username: friend.username } }">
                                        <img :src="friend.avatarImg == '' ? '../static/img/no-profile-image.png' : '../static/img/' + friend.username + '/' + friend.avatarImg" :alt="friend.nickname" class="img-thumbnail w-25">
                                        <h6 class="d-inline text-light">{{ friend.nickname }}</h6>
                                    </router-link>
                                </li>
                            </ul>
                            <h5 class="text-light">Friends that own this game</h5>
                            <ul class="list-unstyled">
                                <li v-for="friend in friends">
                                    <router-link :to="{ name: 'Profile', params: { username: friend.username } }">
                                        <img :src="friend.avatarImg == '' ? '../static/img/no-profile-image.png' : '../static/img/' + friend.username + '/' + friend.avatarImg" :alt="friend.nickname" class="img-thumbnail w-25">
                                        <h6 class="d-inline text-light">{{ friend.nickname }}</h6>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `,
    methods: {
        handleLogin: function () {
            if (!this.$checkLogin())
                this.$router.push({name: 'Store'})
        },
        getLibrary: function () {
            axios.get("http://localhost:3000/api/account/library/" + this.$cookies.get('username'))
                .then(response => {
                    response.data.forEach((game, index)=> {
                        axios.get("http://localhost:3000/api/steam_game/" + game.gameId)
                            .then(res => {
                                res.data.timePlayed = game.timePlayed < 60 ? game.timePlayed + " minutes" : Math.floor(game.timePlayed / 6) / 10 + " hours"
                                this.games.push(res.data)
                            })
                            .catch(err => console.log(err))
                    })
                })
                .catch(err => console.log(err))
        },
        startGame: function (gameId){
            if (this.gamePlaying === '') {
                this.gameStarted = Date.now()
                console.log(this.gameStarted)
                axios.post("http://localhost:3000/api/account", {state: "in game", inGame: gameId})
                    .then(() => {
                        this.gamePlaying = gameId
                        window.addEventListener('beforeunload', _ => {
                            axios.post('http://localhost:3000/api/' + this.$cookies.get('username') + '/game/' + this.gamePlaying + '/closed', { started: this.gameStarted } )
                                .then(_ => {})
                                .catch(err => console.log(err))
                        })
                    })
                    .catch(err => console.log(err))
            }
        },
        stopGame: function (){
            axios.post('http://localhost:3000/api/' + this.$cookies.get('username') + '/game/' + this.gamePlaying + '/closed', { started: this.gameStarted } )
                .then(_ => this.gameStarted = -1)
                .catch(err => console.log(err))

            axios.post("http://localhost:3000/api/account", { state: "online", inGame: ""})
                .then(() => this.gamePlaying = "")
                .catch(err => console.log(err))
        },
        getMyAccount: function () {
            axios.get('http://localhost:3000/api/account/' + this.$cookies.get('username'))
                .then(res => this.gamePlaying = res.data.inGame === undefined ? '' : res.data.inGame)
                .catch(err => console.log(err))
        },
        getFriendsWithGame: function (gameId) {
            this.$refs['tab_content'].classList.remove("invisible")
            axios.get('http://localhost:3000/api/' + this.$cookies.get('username') + '/game/' + gameId + '/friends')
                .then(res => {
                    this.friends = []
                    this.friendsInGame = []
                    res.data.forEach(friend => {
                        if (friend.inGame === String(gameId))
                            this.friendsInGame.push(friend)
                        else
                            this.friends.push(friend)
                    })
                })
                .catch(err => console.log(err))
        }
    },
    mounted() {
        this.handleLogin()
        this.getLibrary()
        this.getMyAccount()
        this.$on('log-event', () => {
            this.handleLogin()
        })
    }
}
