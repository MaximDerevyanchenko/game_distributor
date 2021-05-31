const Game = {
    props: ['game_id'],
    data: function () {
        return {
            game: null,
            onlinePlayers: 0,
            logged: false
        }
    },
    template: `
        <div class="homeContainer" v-if="game">
            <div>Title: {{ game.data.name }}</div>
            <div>Online players: {{ onlinePlayers }}</div>
            <button v-if="logged" @click="addToCart">Add to cart</button>
        </div>
    `,
    methods: {
        getGame: function () {
            axios.get("http://localhost:3000/api/game/" + this.$props.game_id)
                .then(response => {
                    var gameId = this.$props.game_id
                    if (response.data[gameId].success)
                        this.game = response.data[gameId]
                    else
                        console.log("game non trovato")
                })
                .catch(error => console.log(error))
        },
        getOnlinePlayers: function () {
            axios.get("http://localhost:3000/api/game/" + this.$props.game_id + "/players")
                .then(response => {
                    if (response.data.hasOwnProperty('player_count'))
                        this.onlinePlayers = response.data.player_count
                })
                .catch(error => console.log(error))
        },
        addToCart: function (){
            axios.post("http://localhost:3000/api/account/cart", this.game, { withCredentials: true })
                .then(response => {
                    console.log(response.data + "added to cart")
                    this.$router.push({ name: 'Cart' })
                })
                .catch(error => console.log(error))
        }
    },
    mounted() {
        this.getGame()
        this.getOnlinePlayers()
        this.$checkLogin()
        this.logged = this.$logged
        this.$on('log-event', data => {
            this.$checkLogin()
            this.logged = this.$logged
        })
    }
}
