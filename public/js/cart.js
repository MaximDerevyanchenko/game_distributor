const Cart = {
    data: function (){
        return {
            logged: false,
            games: []
        }
    },
    template: `
    <div>
        <div class="col-md-10" v-if="logged">
            <div v-for="game in games">
                <h2>{{game.gameId}}</h2>
            </div>
        </div>
        <p v-else>Not logged</p>
    </div>
    `,
    methods: {
        getCart: function (){
            axios.get("http://localhost:3000/api/account/cart", { withCredentials: true })
                .then(response => {
                    this.games = response.data
                })
                .catch(error => console.log(error))
        }
    },
    mounted(){
        this.$checkLogin()
        this.logged = this.$logged
        this.getCart()
        this.$on('log-event', data => {
            this.logged = this.$logged
        })
    }
}
