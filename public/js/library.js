const Library = {
    props: ['username'],
    data() {
        return {
            account: {},
            games: [],
            friends: [],
            friendsInGame: [],
            gamePlaying: "",
            logged: false
        }
    },
    template: `
        <div class="mt-3">
            <h4 class="text-center mb-4">Library</h4>
            <div id="spinnerLib" class="d-flex align-items-center m-3 justify-content-center">
              <strong>Loading... </strong>
              <div class="spinner-border ms-3" role="status" aria-hidden="true"></div>
            </div>
            <div id="Library" v-if="games.length !== 0" class="d-none">
                <ul class="nav nav-pills flex-row flex-md-column col-12 col-md-3" role="tablist">
                    <li class="nav-item col-6 col-md-12 border border-light" role="presentation" v-for="game in games">
                        <button @click="getFriendsWithGame(game.gameId)" role="tab" class="nav-link w-100 h-100 px-2 py-1 py-md-2" data-bs-toggle="pill" :data-bs-target="'#g' + game.gameId">{{ game.name }}</button>
                    </li>
                </ul>
                <div ref="tab_content" class="tab-content bg-secondary p-2 col-12 col-md-9 col-xl-7" :class="games.length > 0 ? 'border' : ''">
                    <div v-for="game in games" class="tab-pane fade card bg-primary" role="tabpanel" :id="'g' + game.gameId">
                        <img :src="game.header_image" alt="game.name" class="w-100">
                        <div class="p-3">
                            <div class="d-block d-sm-flex">
                                <router-link class="me-sm-auto" :to="{ name: 'Game', params: { gameId: game.gameId } }"><h4 class="text-light">{{ game.name }}</h4></router-link>
                                <p class="text-light">Time played: {{ game.timePlayed }}</p>
                            </div>
                            <div v-if="game.type === 'game'">
                                <div v-if="logged && username === Vue.$cookies.get('username')">
                                  <button role="button" v-if="gamePlaying == game.gameId" @click="stopGame" id="stopGame" class="btn btn-outline-light">Stop Game</button>
                                  <button role="button" v-else id="startGame" :aria-disabled="gamePlaying !== ''" :disabled="gamePlaying !== ''" @click="startGame(game.gameId)" class="btn btn-outline-light">Start Game</button>
                                </div>
                            </div>
                            <div v-else class="d-inline-block bg-dark border border-danger border-3 p-1 mt-2">Content not playable</div>
                            <div class="d-block d-lg-flex mt-5">
                                <div class="col-12 col-lg-6">
                                    <h5 class="text-light">Friends in game</h5>
                                    <div v-if="friendsInGame.length === 0" class="text-light ps-2">None of your friends is playing right now</div>
                                    <ul v-else class="list-unstyled">
                                        <li v-for="friend in friendsInGame" class="mb-2">
                                            <router-link :to="{ name: 'Profile', params: { username: friend.username } }">
                                                <img :src="friend.avatarImg === '' ? '../static/img/no-profile-image.png' : '../static/img/' + friend.username + '/' + friend.avatarImg" :alt="friend.nickname" class="rounded">
                                                <h6 class="d-inline text-light">{{ friend.nickname }}</h6>
                                            </router-link>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-12 col-lg-6">
                                    <h5 class="text-light mt-3 mt-lg-0">Friends that own this game</h5>
                                    <div v-if="friends.length === 0" class="text-light ps-2">None of your friends has this game</div>
                                    <ul v-else class="list-unstyled">
                                        <li v-for="friend in friends" class="mb-2">
                                            <router-link :to="{ name: 'Profile', params: { username: friend.username } }">
                                                <img :src="friend.avatarImg === '' ? '../static/img/no-profile-image.png' : '../static/img/' + friend.username + '/' + friend.avatarImg" :alt="friend.nickname" class="rounded">
                                                <h6 class="d-inline text-light">{{ friend.nickname }}</h6>
                                            </router-link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else id="emptyLib" class="justify-content-center m-3 d-none">
              <p>Your library is empty! Go to the <router-link to="/store" class="link-light">Store</router-link> and add something! <i class="fas fa-smile-wink"></i></p>
            </div>
        </div>
    `,
    watch: {
        $route: function (){
            this.games = []
            this.getLibrary()
        }
    },
    methods: {
        getLibrary: function () {
            axios.get("http://localhost:3000/api/account/"  + this.$props.username + "/library")
                .then(response => {
                    const promises = []
                    response.data.forEach(game => {
                        if (game.isLocal)
                            promises.push(
                                axios.get("http://localhost:3000/api/games/" + game.gameId + "/local")
                                    .then(res => {
                                        res.data.timePlayed = game.timePlayed < 60 ? game.timePlayed + " minutes" : Math.floor(game.timePlayed / 6) / 10 + " hours"
                                        if (res.data.header_image !== '')
                                            res.data.header_image = '../static/img/' + game.gameId + '/' + res.data.header_image
                                        else
                                            res.data.header_image = '../static/img/no-image.png'
                                        res.data.type = 'game'
                                        this.games.push(res.data)
                                        return res.data
                                    })
                                    .catch(err => console.log(err)))
                        else
                            promises.push(
                                axios.get("http://localhost:3000/api/games/" + game.gameId + "/steam")
                                    .then(res => {
                                        res.data.timePlayed = game.timePlayed < 60 ? game.timePlayed + " minutes" : Math.floor(game.timePlayed / 6) / 10 + " hours"
                                        this.games.push(res.data)
                                        return res.data
                                    })
                                    .catch(err => console.log(err)))
                    })
                    Promise.all(promises).then(games => {
                        document.querySelector('#spinnerLib').classList.add('d-none')
                        if (games.length > 0) {
                            document.querySelector('button[data-bs-target="#g' + games[0].gameId + '"]').classList.add('active')
                            document.querySelector('#g' + games[0].gameId).classList.add('active', 'show')
                            this.getFriendsWithGame(games[0].gameId)
                            document.querySelector('#Library').classList.remove('d-none')
                            document.querySelector('#Library').classList.add('d-block', 'd-md-flex')
                        } else {
                            document.querySelector('#emptyLib').classList.remove('d-none')
                            document.querySelector('#emptyLib').classList.add('d-flex')
                        }
                    })
                })
                .catch(err => console.log(err))
        },
        startGame: function (gameId){
            if (this.gamePlaying === '') {
                axios.post('http://localhost:3000/api/account/' + this.$props.username + '/library/' + gameId + '/start', { started: Date.now() })
                    .then(_ => {})
                    .catch(err => console.log(err))
                axios.post("http://localhost:3000/api/account/" + this.$props.username, {state: "in game", inGame: gameId})
                    .then(() => {
                        this.gamePlaying = gameId
                        window.addEventListener('beforeunload', this.listener)
                        this.$parent.$emit('log-event')
                    })
                    .catch(err => console.log(err))
            }
        },
        stopGame: function (){
            window.removeEventListener('beforeunload', this.listener)
            axios.post('http://localhost:3000/api/account/' + this.$props.username + '/library/' + this.gamePlaying + '/close')
                .then(_ => {})
                .catch(err => console.log(err))

            axios.post("http://localhost:3000/api/account/" + this.$props.username, { state: "online", inGame: ""})
                .then(() => this.gamePlaying = "")
                .catch(err => console.log(err))
        },
        getMyAccount: function () {
            axios.get('http://localhost:3000/api/account/' + this.$props.username)
                .then(res => {
                    this.account = res.data
                    this.gamePlaying = res.data.inGame === undefined ? '' : res.data.inGame
                })
                .catch(err => console.log(err))
        },
        getFriendsWithGame: function (gameId) {
            this.$refs['tab_content'].classList.remove("invisible")
            axios.get('http://localhost:3000/api/account/' + this.$props.username + '/friends/game/' + gameId)
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
        },
        listener: function () {
            this.stopGame()
            axios.post("http://localhost:3000/api/account/" + this.$props.username, { state: "offline" })
                .then(() => {})
                .catch(err => console.log(err))
        }
    },
    sockets: {
        friendStateChanged: function (change) {
            const user = change[0]
            const body = change[1]
            if (this.$cookies.isKey('username') && user.username !== this.$cookies.get('username') && this.account.friends.includes(user.username)) {
                user.state = body.state
                user.inGame = body.inGame
                if (body.state === 'in game') {
                    this.friendsInGame.push(user)
                    this.friends = this.friends.filter(f => f.username !== user.username)
                } else {
                    this.friends = this.friends.filter(f => f.username !== user.username)
                    this.friends.push(user)
                    this.friendsInGame = this.friendsInGame.filter(f => f.username !== user.username)
                }
            }
        },
        gameGifted: function () {
            this.getLibrary()
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.getLibrary()
        this.getMyAccount()
        this.$on('log-event', () => {
            this.getMyAccount()
            this.logged = this.$checkLogin()
        })
    }
}
