const Wishlist = {
    props: ['username'],
    data() {
        return {
            games: []
        }
    },
    template: `
    <div>
        <div v-for="(game, index) in games">
            <p>{{ game.gameId }}</p>
            <button v-if="username === Vue.$cookies.get('username')" @click="remove(index)">Remove</button>
            <button v-if="username === Vue.$cookies.get('username')" @click="addToCart(index)">Add to cart</button>
            <button v-else @click="giveTo(index)">Buy</button>
        </div>
    </div>
    `,
    methods: {
        getGames: function (){
            axios.get("http://localhost:3000/api/account/wishlist/" + this.$props.username)
                .then(response => this.games = response.data)
                .catch(error => console.log(error))
        },
        remove: function (index) {
            axios.delete("http://localhost:3000/api/account/wishlist/" + this.games[index].gameId)
                .then(() => Vue.delete(this.games, index))
                .catch(error => console.log(error))
        },
        addToCart: function (index) {
            axios.post("http://localhost:3000/api/account/cart", { data: { steam_appid: this.games[index].gameId }})
                .then(() => {
                    this.$router.push({ name: 'Cart' })
                })
                .catch(error => console.log(error))
        },
        giveTo: function (index) {
            axios.post("http://localhost:3000/api/account/library/gift", { username: this.$props.username, gameId: this.games[index].gameId })
                .catch(error => console.log(error))
        }
    },
    sockets: {
        gameGifted: function (){
            this.getGames()
        }
    },
    mounted(){
        this.getGames()
    }
}
