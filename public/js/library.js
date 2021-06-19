const Library = {
    data() {
        return {
            games: [],
            gamePlaying: ""
        }
    },
    template: `
        <div>
            <p>Library</p>
            <div class="d-flex align-items-start">
                <ul class="nav nav-pills flex-column" role="tablist">
                    <li class="nav-item" role="presentation" v-for="game in games">
                        <button role="tab" class="nav-link" data-bs-toggle="pill" :data-bs-target="'#g' + game.gameId">{{ game.gameId }}</button>
                    </li>
                </ul>
                <div class="tab-content">
                    <div v-for="game in games" class="tab-pane fade" role="tabpanel" :id="'g' + game.gameId">
                        <h1>{{ game.gameId }}</h1>
                        <button v-if="gamePlaying !== game.gameId" @click="startGame(game.gameId)">Start Game</button>
                        <button v-else @click="stopGame">Stop Game</button>
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
                .then(response => this.games = response.data)
                .catch(err => console.log(err))
        },
        startGame: function (gameId){
            if (this.gamePlaying === "")
                axios.post("http://localhost:3000/api/account", { state: "in game", inGame: gameId})
                    .then(() => this.gamePlaying = gameId)
                    .catch(err => console.log(err))
        },
        stopGame: function (){
            axios.post("http://localhost:3000/api/account", { state: "online", inGame: ""})
                .then(() => this.gamePlaying = "")
                .catch(err => console.log(err))
        },
        getMyAccount: function () {
            axios.get('http://localhost:3000/api/account')
                .then(res => this.gamePlaying = res.data.inGame)
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
