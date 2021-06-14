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
            <div v-for="game in games">
                <h1>{{ game.gameId }}</h1>
                <button v-if="gamePlaying !== game.gameId" @click="startGame(game.gameId)">Start Game</button>
                <button v-else @click="stopGame">Stop Game</button>
            </div>
        </div>
        `,
    methods: {
        handleLogin: function () {
            if (!this.$checkLogin())
                this.$router.push({name: 'Profile'})
        },
        getLibrary: function () {
            axios.get("http://localhost:3000/api/account/library")
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
