const Profile = {
    props: ['username'],
    data: function() {
        return {
            account: {
                username: "",
                password: "",
                isDeveloper: false
            },
            day: 24*60*60,
            logged: false,
            game: {
                appid: -1,
                name: "",
                isLocal: true
            }
        }
    },
    template: `
    <div>
        <p>State: {{ account.state }}</p>
        <p>Name: {{ account.username }}</p>
        <div v-if="logged && username == Vue.$cookies.get('username')">
            <div v-if="account.isDeveloper">
                <h2>New Game</h2>
                <form>
                    <label for="gameId">GameId: </label>
                    <input id="gameId" type="number" v-model="game.appid" />
                    <label for="name">Name:</label>
                    <input id="name" type="text" v-model="game.name">
                    <input type="submit" @click.prevent="createGame"/>
                </form>
            </div>
            <div v-else>
                <button @click="becomeDeveloper">Become developer</button>
            </div>
        </div>
        <div>
            <div>
                <router-link class="nav-button" :to="{ name: 'Wishlist', params: { username: username }}">Wishlist</router-link>
            </div>
        </div>
    </div>`,
    methods: {
        getAccount: function () {
            axios.get('http://localhost:3000/api/account/' + this.username)
                .then(res => this.account = res.data)
                .catch(err => console.log(err))
        },
        becomeDeveloper: function (){
            axios.patch('http://localhost:3000/api/account', { isDeveloper: true })
                .then(() => this.account.isDeveloper = true)
                .catch(err => console.log(err))
        },
        createGame: function (){
            axios.post('http://localhost:3000/api/create_game', this.game)
                .then(() => this.$router.push({ name: 'Game', params: { game_id: this.game.appid }}))
                .catch(err => console.log(err))
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
        this.getAccount()
    },

}

