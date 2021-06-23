const Cart = {
    data: function (){
        return {
            games: []
        }
    },
    template: `
    <div>
        <div class="col-md-10">
            <div v-for="(game,index) in games">
                <h2>{{game.gameId}}</h2>
                <button @click="remove(index)">Remove</button>
            </div>
            <button @click="buy">Buy</button>
        </div>
    </div>
    `,
    methods: {
        getCart: function (){
            axios.get("http://localhost:3000/api/account/cart")
                .then(response => {
                    this.games = response.data
                })
                .catch(error => console.log(error))
        },
        buy: function (){
            if (confirm("Are you sure to buy these items?"))
                this.games.forEach(game => game.timePlayed = 0)
                axios.post("http://localhost:3000/api/account/library", this.games)
                    .then(response => this.games = response.data)
                    .catch(err => console.log(err))
        },
        remove: function (index){
            if (confirm("Are you sure to remove this item from the cart?"))
                axios.delete("http://localhost:3000/api/account/cart/" + this.games[index].gameId)
                    .then(_ => Vue.delete(this.games, index))
                    .catch(err => console.log(err))
        }
    },
    mounted(){
        this.getCart()
        this.$on('log-event', () => {
            if (!this.$checkLogin())
                this.$router.push({ name: 'Store'})
        })
    }
}
