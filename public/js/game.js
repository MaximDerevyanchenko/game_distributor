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
            <div>Title: {{ game.name }}</div>
            <div>Online players: {{ onlinePlayers }}</div>
            <button v-if="logged" @click="addToCart">Add to cart</button>
            <button v-if="logged" @click="addToWishlist">Add to wishlist</button>
        </div>
    `,
    methods: {
        getGame: function () {
            axios.get("http://localhost:3000/api/game/" + this.$props.game_id)
                .then(response => {
                    this.game = response.data
                    if (!this.game.isLocal)
                        axios.get("http://localhost:3000/api/steam_game/" + this.game.appid)
                            .then(response => {
                                const gameId = this.game.appid;
                                if (response.data[gameId].success) {
                                    this.game = response.data[gameId]
                                    this.getOnlinePlayers()
                                } else
                                    console.log("game non trovato")
                            })
                            .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
        },
        getOnlinePlayers: function () {
            axios.get("http://localhost:3000/api/steam_game/" + this.game.gameId + "/players")
                .then(response => {
                    if (response.data.hasOwnProperty('player_count'))
                        this.onlinePlayers = response.data.player_count
                })
                .catch(error => console.log(error))
        },
        addToCart: function (){
            axios.post("http://localhost:3000/api/account/cart", this.game)
                .then(() => {
                    this.$router.push({ name: 'Cart' })
                })
                .catch(error => console.log(error))
        },
        addToWishlist: function (){
            axios.post("http://localhost:3000/api/account/wishlist", this.game)
                .then(() => {
                    this.$router.push({ name: 'Wishlist', params: { username: Vue.$cookies.get('username')}})
                })
                .catch(error => console.log(error))
        }
    },
    mounted() {
        this.getGame()
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
    }
}
